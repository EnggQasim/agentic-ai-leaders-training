"""Mind Map & Summary API endpoints."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

from app.services.mindmap import get_mindmap_service


router = APIRouter(prefix="/mindmap", tags=["mindmap"])


# ============= Request/Response Models =============

class SummaryRequest(BaseModel):
    """Request to generate a chapter summary."""
    chapter_id: str = Field(..., description="Unique chapter identifier")
    chapter_content: str = Field(..., min_length=100, description="Full chapter text content")
    chapter_title: str = Field(..., description="Chapter title")
    force_regenerate: bool = Field(False, description="Force regeneration even if cached")


class Concept(BaseModel):
    """A key concept with definition."""
    term: str
    definition: str


class Summary(BaseModel):
    """AI-generated chapter summary."""
    chapter_id: str
    title: str
    key_points: List[str]
    main_concepts: List[Concept]
    takeaways: List[str]
    word_count: int
    generated_at: str


class SummaryResponse(BaseModel):
    """Response with generated summary."""
    success: bool
    summary: Optional[Summary] = None
    cached: bool = False
    error: Optional[str] = None


class MindMapRequest(BaseModel):
    """Request to generate a mind map."""
    chapter_id: str = Field(..., description="Unique chapter identifier")
    chapter_content: str = Field(..., min_length=100, description="Full chapter text content")
    chapter_title: str = Field(..., description="Chapter title")
    force_regenerate: bool = Field(False, description="Force regeneration even if cached")


class MindMapNode(BaseModel):
    """Individual concept in the mind map."""
    id: str
    label: str
    description: str
    level: int
    parent_id: Optional[str] = None
    content_anchor: Optional[str] = None
    position: Optional[Dict[str, float]] = None


class MindMapEdge(BaseModel):
    """Connection between two nodes."""
    id: str
    source: str
    target: str
    label: Optional[str] = None
    type: str = "default"


class MindMap(BaseModel):
    """AI-generated mind map structure."""
    chapter_id: str
    title: str
    central_topic: MindMapNode
    nodes: List[MindMapNode]
    edges: List[MindMapEdge]
    node_count: int
    max_depth: int
    generated_at: str


class MindMapResponse(BaseModel):
    """Response with generated mind map."""
    success: bool
    mindmap: Optional[MindMap] = None
    cached: bool = False
    error: Optional[str] = None


class ChapterInfoResponse(BaseModel):
    """Combined summary and mind map status for a chapter."""
    chapter_id: str
    has_summary: bool
    has_mindmap: bool
    summary: Optional[Summary] = None
    mindmap: Optional[MindMap] = None


class CachedItem(BaseModel):
    """A cached summary or mind map entry."""
    chapter_id: str
    generated_at: str


class CachedListResponse(BaseModel):
    """List of all cached content."""
    summaries: List[CachedItem]
    mindmaps: List[CachedItem]


# ============= Endpoints =============

@router.post("/summary", response_model=SummaryResponse)
async def generate_summary(request: SummaryRequest) -> SummaryResponse:
    """
    Generate an AI-powered summary of chapter content.

    - **chapter_id**: Unique identifier for the chapter (e.g., 'intro', 'module-1-ros2-nodes')
    - **chapter_content**: Full text content of the chapter (minimum 100 characters)
    - **chapter_title**: Title of the chapter
    - **force_regenerate**: Set to true to regenerate even if cached
    """
    service = get_mindmap_service()
    result = await service.generate_summary(
        chapter_id=request.chapter_id,
        chapter_content=request.chapter_content,
        chapter_title=request.chapter_title,
        force_regenerate=request.force_regenerate
    )
    return SummaryResponse(**result)


@router.post("/generate", response_model=MindMapResponse)
async def generate_mindmap(request: MindMapRequest) -> MindMapResponse:
    """
    Generate an AI-powered mind map from chapter content.

    - **chapter_id**: Unique identifier for the chapter
    - **chapter_content**: Full text content of the chapter (minimum 100 characters)
    - **chapter_title**: Title of the chapter
    - **force_regenerate**: Set to true to regenerate even if cached
    """
    service = get_mindmap_service()
    result = await service.generate_mindmap(
        chapter_id=request.chapter_id,
        chapter_content=request.chapter_content,
        chapter_title=request.chapter_title,
        force_regenerate=request.force_regenerate
    )
    return MindMapResponse(**result)


@router.get("/chapter/{chapter_id}", response_model=ChapterInfoResponse)
async def get_chapter_info(chapter_id: str) -> ChapterInfoResponse:
    """
    Get cached summary and mind map status for a chapter.

    Returns both the summary and mind map if they exist in cache,
    along with availability flags.
    """
    service = get_mindmap_service()
    result = service.get_chapter_info(chapter_id)
    return ChapterInfoResponse(**result)


@router.get("/cached", response_model=CachedListResponse)
async def list_cached_content() -> CachedListResponse:
    """
    List all cached summaries and mind maps.

    Returns lists of chapter IDs with their generation timestamps.
    """
    service = get_mindmap_service()
    result = service.get_cached_items()
    return CachedListResponse(**result)
