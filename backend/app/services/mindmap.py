"""AI Mind Map & Summary Generator Service.

Generates structured summaries and interactive mind maps from chapter content
using OpenAI GPT-4o-mini with JSON structured output.
"""
import hashlib
import json
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, Any, List

import openai

from app.config import get_settings


class MindMapService:
    """Service for generating AI-powered summaries and mind maps from chapter content."""

    _instance = None

    def __init__(self):
        settings = get_settings()
        self.client = openai.OpenAI(api_key=settings.openai_api_key)
        self.chat_model = settings.chat_model

        # Cache directory for generated content
        self.cache_dir = Path(__file__).parent.parent.parent / "mindmap"
        self.cache_dir.mkdir(parents=True, exist_ok=True)

        # Cache metadata file
        self.cache_file = self.cache_dir / "cache.json"
        self._cache = self._load_cache()

    def _get_cache_key(self, chapter_id: str, content: str) -> str:
        """Generate a cache key from chapter ID and content hash."""
        return hashlib.md5(f"{chapter_id}:{content[:500]}".encode()).hexdigest()[:12]

    def _load_cache(self) -> dict:
        """Load cache from disk."""
        if self.cache_file.exists():
            try:
                return json.loads(self.cache_file.read_text())
            except json.JSONDecodeError:
                return {"version": "1.0", "summaries": {}, "mindmaps": {}}
        return {"version": "1.0", "summaries": {}, "mindmaps": {}}

    def _save_cache(self):
        """Persist cache to disk."""
        self.cache_file.write_text(json.dumps(self._cache, indent=2))

    async def generate_summary(
        self,
        chapter_id: str,
        chapter_content: str,
        chapter_title: str,
        force_regenerate: bool = False
    ) -> Dict[str, Any]:
        """
        Generate an AI-powered summary of chapter content.

        Args:
            chapter_id: Unique chapter identifier
            chapter_content: Full chapter text
            chapter_title: Chapter title
            force_regenerate: Force new generation even if cached

        Returns:
            Dict with success status, summary data, and cache info
        """
        cache_key = self._get_cache_key(chapter_id, chapter_content)

        # Return cached if available
        if not force_regenerate and cache_key in self._cache.get("summaries", {}):
            cached = self._cache["summaries"][cache_key]
            return {
                "success": True,
                "summary": cached["summary"],
                "cached": True,
                "generated_at": cached.get("generated_at")
            }

        try:
            # Generate summary using OpenAI
            prompt = f"""Analyze this chapter content and create a structured summary.

Chapter Title: {chapter_title}

Content:
{chapter_content[:6000]}

Output as JSON with exactly these fields:
{{
  "key_points": ["3-5 bullet points summarizing main ideas, each 10-50 words"],
  "main_concepts": [
    {{"term": "concept name", "definition": "1-2 sentence definition"}}
  ],
  "takeaways": ["2-4 practical learning takeaways"]
}}

Requirements:
- key_points: 3-5 items, each capturing a distinct main idea
- main_concepts: 3-6 key terms with clear definitions
- takeaways: 2-4 actionable learning outcomes
- Focus on what readers should understand and remember"""

            response = self.client.chat.completions.create(
                model=self.chat_model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an educational content summarizer. Output valid JSON only, no markdown formatting."
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=1500,
                response_format={"type": "json_object"}
            )

            # Parse response
            summary_data = json.loads(response.choices[0].message.content)

            # Calculate word count
            word_count = (
                sum(len(kp.split()) for kp in summary_data.get("key_points", [])) +
                sum(len(c.get("definition", "").split()) for c in summary_data.get("main_concepts", [])) +
                sum(len(t.split()) for t in summary_data.get("takeaways", []))
            )

            # Build summary object
            summary = {
                "chapter_id": chapter_id,
                "title": chapter_title,
                "key_points": summary_data.get("key_points", []),
                "main_concepts": summary_data.get("main_concepts", []),
                "takeaways": summary_data.get("takeaways", []),
                "word_count": word_count,
                "generated_at": datetime.now().isoformat()
            }

            # Cache result
            self._cache.setdefault("summaries", {})[cache_key] = {
                "chapter_id": chapter_id,
                "summary": summary,
                "generated_at": datetime.now().isoformat(),
                "content_hash": cache_key
            }
            self._save_cache()

            return {
                "success": True,
                "summary": summary,
                "cached": False
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "summary": None,
                "cached": False
            }

    async def generate_mindmap(
        self,
        chapter_id: str,
        chapter_content: str,
        chapter_title: str,
        force_regenerate: bool = False
    ) -> Dict[str, Any]:
        """
        Generate an AI-powered mind map structure from chapter content.

        Args:
            chapter_id: Unique chapter identifier
            chapter_content: Full chapter text
            chapter_title: Chapter title
            force_regenerate: Force new generation even if cached

        Returns:
            Dict with success status, mind map data, and cache info
        """
        cache_key = self._get_cache_key(chapter_id, chapter_content)

        # Return cached if available
        if not force_regenerate and cache_key in self._cache.get("mindmaps", {}):
            cached = self._cache["mindmaps"][cache_key]
            return {
                "success": True,
                "mindmap": cached["mindmap"],
                "cached": True,
                "generated_at": cached.get("generated_at")
            }

        try:
            # Generate mind map structure using OpenAI
            prompt = f"""Analyze this chapter and create a hierarchical mind map structure.

Chapter Title: {chapter_title}

Content:
{chapter_content[:6000]}

Output as JSON with this exact structure:
{{
  "central_topic": {{
    "id": "central",
    "label": "{chapter_title[:30]}",
    "description": "Brief description of chapter main theme",
    "level": 0,
    "parent_id": null
  }},
  "nodes": [
    {{
      "id": "node_1",
      "label": "Primary concept (2-5 words)",
      "description": "1-2 sentence explanation",
      "level": 1,
      "parent_id": "central"
    }},
    {{
      "id": "node_1_1",
      "label": "Sub-concept",
      "description": "Detail or example",
      "level": 2,
      "parent_id": "node_1"
    }}
  ]
}}

Requirements:
- Create 4-6 primary nodes (level 1) for main concepts
- Add 2-3 child nodes (level 2) for each primary concept
- Maximum 25 total nodes
- Each label: 2-30 characters
- Each description: 10-200 characters
- Use meaningful concept relationships"""

            response = self.client.chat.completions.create(
                model=self.chat_model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an educational content analyzer creating mind map structures. Output valid JSON only."
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4,
                max_tokens=2500,
                response_format={"type": "json_object"}
            )

            # Parse response
            mindmap_data = json.loads(response.choices[0].message.content)

            central_topic = mindmap_data.get("central_topic", {
                "id": "central",
                "label": chapter_title[:30],
                "description": f"Overview of {chapter_title}",
                "level": 0,
                "parent_id": None
            })

            nodes = mindmap_data.get("nodes", [])

            # Generate edges from parent relationships
            edges = []
            edge_id = 1

            # Connect central to level 1 nodes
            for node in nodes:
                if node.get("parent_id"):
                    edges.append({
                        "id": f"e{edge_id}",
                        "source": node["parent_id"],
                        "target": node["id"],
                        "type": "default"
                    })
                    edge_id += 1

            # Calculate stats
            all_nodes = [central_topic] + nodes
            node_count = len(all_nodes)
            max_depth = max(n.get("level", 0) for n in all_nodes) if all_nodes else 0

            # Build mind map object
            mindmap = {
                "chapter_id": chapter_id,
                "title": chapter_title,
                "central_topic": central_topic,
                "nodes": nodes,
                "edges": edges,
                "node_count": node_count,
                "max_depth": max_depth,
                "generated_at": datetime.now().isoformat()
            }

            # Cache result
            self._cache.setdefault("mindmaps", {})[cache_key] = {
                "chapter_id": chapter_id,
                "mindmap": mindmap,
                "generated_at": datetime.now().isoformat(),
                "content_hash": cache_key
            }
            self._save_cache()

            return {
                "success": True,
                "mindmap": mindmap,
                "cached": False
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "mindmap": None,
                "cached": False
            }

    def get_chapter_info(self, chapter_id: str) -> Dict[str, Any]:
        """
        Get cached summary and mind map status for a chapter.

        Args:
            chapter_id: Chapter identifier to look up

        Returns:
            Dict with availability status and cached data
        """
        # Search through cached items by chapter_id
        summary = None
        mindmap = None

        for cache_key, data in self._cache.get("summaries", {}).items():
            if data.get("chapter_id") == chapter_id:
                summary = data.get("summary")
                break

        for cache_key, data in self._cache.get("mindmaps", {}).items():
            if data.get("chapter_id") == chapter_id:
                mindmap = data.get("mindmap")
                break

        return {
            "chapter_id": chapter_id,
            "has_summary": summary is not None,
            "has_mindmap": mindmap is not None,
            "summary": summary,
            "mindmap": mindmap
        }

    def get_cached_items(self) -> Dict[str, Any]:
        """
        Get list of all cached summaries and mind maps.

        Returns:
            Dict with lists of cached summaries and mindmaps
        """
        summaries = []
        for cache_key, data in self._cache.get("summaries", {}).items():
            summaries.append({
                "chapter_id": data.get("chapter_id"),
                "generated_at": data.get("generated_at")
            })

        mindmaps = []
        for cache_key, data in self._cache.get("mindmaps", {}).items():
            mindmaps.append({
                "chapter_id": data.get("chapter_id"),
                "generated_at": data.get("generated_at")
            })

        return {
            "summaries": summaries,
            "mindmaps": mindmaps
        }


# Singleton instance
_mindmap_service: Optional[MindMapService] = None


def get_mindmap_service() -> MindMapService:
    """Get or create mind map service singleton."""
    global _mindmap_service
    if _mindmap_service is None:
        _mindmap_service = MindMapService()
    return _mindmap_service
