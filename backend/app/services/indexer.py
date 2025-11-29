"""Content indexer for loading book content into vector store on startup."""
import re
from pathlib import Path
from typing import List, Dict, Any


def parse_markdown_file(file_path: Path, base_url: str) -> List[Dict[str, Any]]:
    """Parse a markdown file and extract chunks."""
    chunks = []

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract frontmatter title if exists
    title_match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
    chapter_title = title_match.group(1) if title_match else file_path.stem

    # Determine URL path from file path
    # Convert path like: content/module-1-ros2/01-nodes-topics.md
    # To URL like: /docs/module-1-ros2/01-nodes-topics
    relative_parts = []
    current = file_path
    while current.name != "content":
        relative_parts.insert(0, current.stem if current.suffix == ".md" else current.name)
        current = current.parent
        if current == current.parent:  # reached root
            break

    url_path = "/".join(relative_parts)
    if url_path.endswith("index"):
        url_path = url_path[:-6]  # Remove /index
    url = f"{base_url}/docs/{url_path}"

    # Split by headings (## or ###)
    sections = re.split(r"(?=^#{2,3}\s)", content, flags=re.MULTILINE)

    current_section = "Introduction"

    for section in sections:
        if not section.strip():
            continue

        # Check if section starts with heading
        heading_match = re.match(r"^(#{2,3})\s+(.+)$", section, re.MULTILINE)
        if heading_match:
            current_section = heading_match.group(2).strip()
            # Remove the heading from content
            section_content = section[heading_match.end():].strip()
        else:
            section_content = section.strip()

        # Skip empty sections
        if not section_content or len(section_content) < 50:
            continue

        # Remove code blocks for chunking (but we'll include them in content)
        text_for_chunking = re.sub(r"```[\s\S]*?```", "[CODE BLOCK]", section_content)

        # Create chunk if content is substantial
        if len(text_for_chunking) > 100:
            # Split long sections into smaller chunks (~500 tokens)
            if len(section_content) > 2000:
                # Split by paragraphs
                paragraphs = section_content.split("\n\n")
                current_chunk = ""

                for para in paragraphs:
                    if len(current_chunk) + len(para) < 2000:
                        current_chunk += para + "\n\n"
                    else:
                        if current_chunk.strip():
                            chunks.append({
                                "chapter": chapter_title,
                                "section": current_section,
                                "content": current_chunk.strip(),
                                "url": url,
                            })
                        current_chunk = para + "\n\n"

                if current_chunk.strip():
                    chunks.append({
                        "chapter": chapter_title,
                        "section": current_section,
                        "content": current_chunk.strip(),
                        "url": url,
                    })
            else:
                chunks.append({
                    "chapter": chapter_title,
                    "section": current_section,
                    "content": section_content,
                    "url": url,
                })

    return chunks


def index_all_content(vector_store, content_dir: Path = None) -> int:
    """Index all markdown files into the vector store."""
    if content_dir is None:
        # Default to content directory relative to this file
        content_dir = Path(__file__).parent.parent.parent / "content"

    base_url = "https://enggqasim.github.io/physical-ai-robotics-textbook"

    if not content_dir.exists():
        print(f"Warning: Content directory not found: {content_dir}")
        return 0

    # Find all markdown files
    md_files = list(content_dir.glob("**/*.md"))
    print(f"Found {len(md_files)} markdown files to index")

    all_chunks = []

    for md_file in md_files:
        # Skip category files
        if md_file.name.startswith("_"):
            continue

        chunks = parse_markdown_file(md_file, base_url)
        all_chunks.extend(chunks)

    if not all_chunks:
        print("No content to index!")
        return 0

    print(f"Total chunks to index: {len(all_chunks)}")

    # Clear and reindex
    vector_store.clear_collection()

    # Add chunks in batches
    batch_size = 20
    total_indexed = 0

    for i in range(0, len(all_chunks), batch_size):
        batch = all_chunks[i:i + batch_size]
        indexed = vector_store.add_chunks(batch)
        total_indexed += indexed

    print(f"Successfully indexed {total_indexed} chunks!")
    return total_indexed
