"""Content Personalization Service.

Provides:
- User preference management (role, experience level)
- Reading progress tracking
- Personalized content recommendations
- Simplified content generation
"""
import json
from datetime import datetime
from typing import Optional, Dict, Any, List
from pathlib import Path
import openai

from app.config import get_settings


# Experience levels
EXPERIENCE_LEVELS = {
    "beginner": "New to robotics and AI, needs simplified explanations",
    "intermediate": "Has some programming experience, familiar with basic concepts",
    "advanced": "Experienced developer, wants detailed technical content"
}

# User roles
USER_ROLES = {
    "student": "Learning robotics for academic or personal projects",
    "researcher": "Working on cutting-edge AI and robotics research",
    "engineer": "Building production robotics systems",
    "hobbyist": "Building robots as a hobby, interested in practical projects"
}

# In-memory storage (production would use database)
_user_preferences: Dict[str, Dict[str, Any]] = {}
_reading_progress: Dict[str, Dict[str, Any]] = {}
_simplified_content: Dict[str, str] = {}


class PersonalizationService:
    """Service for personalized content and recommendations."""

    def __init__(self):
        settings = get_settings()
        self.client = openai.OpenAI(api_key=settings.openai_api_key)
        self.chat_model = settings.chat_model

        # Chapter ordering for recommendations
        self.chapter_order = [
            "intro",
            "module-1-ros2-index",
            "module-1-ros2-nodes-topics",
            "module-1-ros2-services-actions",
            "module-1-ros2-rclpy",
            "module-2-simulation-index",
            "module-2-simulation-gazebo",
            "module-2-simulation-urdf",
            "module-3-nvidia-isaac-index",
            "module-3-nvidia-isaac-sim",
            "module-3-nvidia-isaac-ros",
            "module-4-vla-index",
            "module-4-vla-voice-commands",
            "module-4-vla-llm-integration"
        ]

        # Role-based chapter weights for recommendations
        self.role_weights = {
            "student": {
                "intro": 1.0,
                "module-1": 1.0,
                "module-2": 0.8,
                "module-3": 0.6,
                "module-4": 0.7
            },
            "researcher": {
                "intro": 0.5,
                "module-1": 0.7,
                "module-2": 0.8,
                "module-3": 1.0,
                "module-4": 1.0
            },
            "engineer": {
                "intro": 0.3,
                "module-1": 1.0,
                "module-2": 1.0,
                "module-3": 1.0,
                "module-4": 0.8
            },
            "hobbyist": {
                "intro": 1.0,
                "module-1": 0.9,
                "module-2": 1.0,
                "module-3": 0.5,
                "module-4": 0.8
            }
        }

    # ==================== User Preferences ====================

    def get_preferences(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user preferences."""
        return _user_preferences.get(user_id)

    def set_preferences(
        self,
        user_id: str,
        role: str,
        experience_level: str,
        interests: List[str] = None
    ) -> Dict[str, Any]:
        """Set or update user preferences."""
        if role not in USER_ROLES:
            raise ValueError(f"Invalid role: {role}. Must be one of {list(USER_ROLES.keys())}")
        if experience_level not in EXPERIENCE_LEVELS:
            raise ValueError(f"Invalid level: {experience_level}. Must be one of {list(EXPERIENCE_LEVELS.keys())}")

        prefs = {
            "user_id": user_id,
            "role": role,
            "experience_level": experience_level,
            "interests": interests or [],
            "created_at": _user_preferences.get(user_id, {}).get("created_at", datetime.utcnow().isoformat()),
            "updated_at": datetime.utcnow().isoformat()
        }
        _user_preferences[user_id] = prefs
        return prefs

    def delete_preferences(self, user_id: str) -> bool:
        """Delete user preferences."""
        if user_id in _user_preferences:
            del _user_preferences[user_id]
            return True
        return False

    def needs_onboarding(self, user_id: str) -> bool:
        """Check if user needs to complete onboarding."""
        return user_id not in _user_preferences

    # ==================== Reading Progress ====================

    def get_progress(self, user_id: str) -> Dict[str, Any]:
        """Get user's reading progress."""
        if user_id not in _reading_progress:
            _reading_progress[user_id] = {
                "user_id": user_id,
                "chapters": {},
                "total_time_seconds": 0,
                "last_activity": None
            }
        return _reading_progress[user_id]

    def update_chapter_progress(
        self,
        user_id: str,
        chapter_id: str,
        time_spent_seconds: int = 0,
        completed: bool = False
    ) -> Dict[str, Any]:
        """Update progress for a specific chapter."""
        progress = self.get_progress(user_id)

        if chapter_id not in progress["chapters"]:
            progress["chapters"][chapter_id] = {
                "time_spent": 0,
                "completed": False,
                "first_visit": datetime.utcnow().isoformat(),
                "last_visit": None
            }

        chapter = progress["chapters"][chapter_id]
        chapter["time_spent"] += time_spent_seconds
        chapter["last_visit"] = datetime.utcnow().isoformat()

        if completed:
            chapter["completed"] = True
            chapter["completed_at"] = datetime.utcnow().isoformat()

        progress["total_time_seconds"] += time_spent_seconds
        progress["last_activity"] = datetime.utcnow().isoformat()

        return progress

    def get_completed_chapters(self, user_id: str) -> List[str]:
        """Get list of completed chapter IDs."""
        progress = self.get_progress(user_id)
        return [
            chapter_id
            for chapter_id, data in progress["chapters"].items()
            if data.get("completed", False)
        ]

    # ==================== Recommendations ====================

    def get_recommendations(
        self,
        user_id: str,
        current_chapter: Optional[str] = None,
        limit: int = 3
    ) -> List[Dict[str, Any]]:
        """Get personalized chapter recommendations."""
        prefs = self.get_preferences(user_id)
        completed = set(self.get_completed_chapters(user_id))

        # Get role-based weights
        role = prefs["role"] if prefs else "student"
        weights = self.role_weights.get(role, self.role_weights["student"])

        # Score chapters
        scored = []
        for chapter_id in self.chapter_order:
            if chapter_id in completed:
                continue  # Skip completed

            # Calculate score
            score = 1.0
            for prefix, weight in weights.items():
                if chapter_id.startswith(prefix):
                    score *= weight
                    break

            # Boost sequential chapters
            if current_chapter:
                current_idx = self.chapter_order.index(current_chapter) if current_chapter in self.chapter_order else -1
                chapter_idx = self.chapter_order.index(chapter_id)
                if chapter_idx == current_idx + 1:
                    score *= 1.5  # Boost next chapter

            scored.append({
                "chapter_id": chapter_id,
                "score": score,
                "reason": self._get_recommendation_reason(chapter_id, role)
            })

        # Sort by score and return top recommendations
        scored.sort(key=lambda x: x["score"], reverse=True)
        return scored[:limit]

    def _get_recommendation_reason(self, chapter_id: str, role: str) -> str:
        """Generate a human-readable recommendation reason."""
        reasons = {
            "intro": "Great starting point to understand Physical AI concepts",
            "module-1-ros2-index": "Essential ROS2 fundamentals for any robotics project",
            "module-1-ros2-nodes-topics": "Learn the core ROS2 communication patterns",
            "module-1-ros2-services-actions": "Master request-response patterns in ROS2",
            "module-1-ros2-rclpy": "Python API for building ROS2 applications",
            "module-2-simulation-index": "Introduction to robot simulation environments",
            "module-2-simulation-gazebo": "Industry-standard Gazebo simulator",
            "module-2-simulation-urdf": "Define your robot's physical structure",
            "module-3-nvidia-isaac-index": "GPU-accelerated simulation with NVIDIA",
            "module-3-nvidia-isaac-sim": "Advanced physics simulation with Isaac Sim",
            "module-3-nvidia-isaac-ros": "Isaac ROS integration for real robots",
            "module-4-vla-index": "AI-powered robot control overview",
            "module-4-vla-voice-commands": "Add voice control to your robots",
            "module-4-vla-llm-integration": "Integrate LLMs for intelligent behavior"
        }

        base_reason = reasons.get(chapter_id, "Recommended for your learning path")

        # Add role-specific context
        if role == "researcher" and "module-4" in chapter_id:
            base_reason += " - cutting-edge AI research topic"
        elif role == "engineer" and "module-2" in chapter_id:
            base_reason += " - essential for production deployments"
        elif role == "hobbyist" and "module-2" in chapter_id:
            base_reason += " - perfect for testing robot designs"

        return base_reason

    # ==================== Simplified Content ====================

    async def get_simplified_content(
        self,
        content: str,
        chapter_id: str,
        user_level: str = "beginner"
    ) -> str:
        """Get or generate simplified version of content."""
        cache_key = f"{chapter_id}:{user_level}"

        if cache_key in _simplified_content:
            return _simplified_content[cache_key]

        # Generate simplified version
        simplified = await self._generate_simplified(content, user_level)
        _simplified_content[cache_key] = simplified

        return simplified

    async def _generate_simplified(self, content: str, level: str) -> str:
        """Generate simplified explanation using GPT-4o-mini."""
        level_description = EXPERIENCE_LEVELS.get(level, EXPERIENCE_LEVELS["beginner"])

        prompt = f"""Simplify the following technical content for someone who is:
{level_description}

Original content:
{content[:3000]}

Provide a simplified explanation that:
1. Uses simpler vocabulary and shorter sentences
2. Includes analogies where helpful
3. Focuses on practical understanding
4. Maintains technical accuracy

Simplified version:"""

        response = self.client.chat.completions.create(
            model=self.chat_model,
            messages=[
                {"role": "system", "content": "You are an educational content adapter who makes complex topics accessible."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1500
        )

        return response.choices[0].message.content

    # ==================== Static Data ====================

    def get_available_roles(self) -> Dict[str, str]:
        """Get available user roles."""
        return USER_ROLES.copy()

    def get_available_levels(self) -> Dict[str, str]:
        """Get available experience levels."""
        return EXPERIENCE_LEVELS.copy()


# Singleton instance
_personalization_service: Optional[PersonalizationService] = None


def get_personalization_service() -> PersonalizationService:
    """Get or create personalization service singleton."""
    global _personalization_service
    if _personalization_service is None:
        _personalization_service = PersonalizationService()
    return _personalization_service
