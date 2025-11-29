"""Health check router."""
from fastapi import APIRouter
from app.models.schemas import HealthResponse
from app.services.vector_store import get_vector_store
from app.config import get_settings
from openai import OpenAI

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """
    Health check endpoint.

    Returns status of:
    - Qdrant connection
    - OpenAI connection
    - Number of indexed chunks
    """
    settings = get_settings()

    # Check Qdrant
    qdrant_connected = False
    indexed_chunks = 0
    try:
        vector_store = get_vector_store()
        info = vector_store.get_collection_info()
        qdrant_connected = info.get("status") != "not_found"
        indexed_chunks = info.get("points_count", 0)
    except Exception:
        pass

    # Check OpenAI
    openai_connected = False
    try:
        client = OpenAI(api_key=settings.openai_api_key)
        client.models.list()
        openai_connected = True
    except Exception:
        pass

    status = "healthy" if qdrant_connected and openai_connected else "degraded"

    return HealthResponse(
        status=status,
        qdrant_connected=qdrant_connected,
        openai_connected=openai_connected,
        indexed_chunks=indexed_chunks,
    )
