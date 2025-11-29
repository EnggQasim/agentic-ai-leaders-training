"""Script to index book content into Qdrant vector store."""
import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Any

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv

load_dotenv()

from app.services.vector_store import get_vector_store


def parse_markdown_file(file_path: Path, base_url: str) -> List[Dict[str, Any]]:
    """Parse a markdown file and extract chunks."""
    chunks = []

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Extract frontmatter title if exists
    title_match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
    chapter_title = title_match.group(1) if title_match else file_path.stem

    # Determine URL path
    relative_path = file_path.relative_to(Path(__file__).parent.parent.parent / "frontend" / "docs")
    url_path = str(relative_path).replace(".md", "").replace("\\", "/")
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
            section_content = section[heading_match.end() :].strip()
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
                            chunks.append(
                                {
                                    "chapter": chapter_title,
                                    "section": current_section,
                                    "content": current_chunk.strip(),
                                    "url": url,
                                }
                            )
                        current_chunk = para + "\n\n"

                if current_chunk.strip():
                    chunks.append(
                        {
                            "chapter": chapter_title,
                            "section": current_section,
                            "content": current_chunk.strip(),
                            "url": url,
                        }
                    )
            else:
                chunks.append(
                    {
                        "chapter": chapter_title,
                        "section": current_section,
                        "content": section_content,
                        "url": url,
                    }
                )

    return chunks


def index_all_content():
    """Index all markdown files from the docs directory."""
    docs_dir = Path(__file__).parent.parent.parent / "frontend" / "docs"
    base_url = "https://enggqasim.github.io/physical-ai-robotics-textbook"

    if not docs_dir.exists():
        print(f"Error: Docs directory not found: {docs_dir}")
        return

    # Find all markdown files
    md_files = list(docs_dir.glob("**/*.md"))
    print(f"Found {len(md_files)} markdown files")

    all_chunks = []

    for md_file in md_files:
        # Skip category files
        if md_file.name.startswith("_"):
            continue

        print(f"Processing: {md_file.name}")
        chunks = parse_markdown_file(md_file, base_url)
        all_chunks.extend(chunks)
        print(f"  -> {len(chunks)} chunks")

    print(f"\nTotal chunks to index: {len(all_chunks)}")

    if not all_chunks:
        print("No content to index!")
        return

    # Index into Qdrant
    print("\nConnecting to Qdrant...")
    vector_store = get_vector_store()

    # Clear existing data
    print("Clearing existing collection...")
    vector_store.clear_collection()

    # Add chunks in batches
    batch_size = 20
    total_indexed = 0

    for i in range(0, len(all_chunks), batch_size):
        batch = all_chunks[i : i + batch_size]
        indexed = vector_store.add_chunks(batch)
        total_indexed += indexed
        print(f"Indexed batch {i // batch_size + 1}: {indexed} chunks")

    print(f"\nSuccessfully indexed {total_indexed} chunks!")

    # Verify
    info = vector_store.get_collection_info()
    print(f"Collection info: {info}")


if __name__ == "__main__":
    index_all_content()
