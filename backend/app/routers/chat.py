"""Chat router for RAG-powered Q&A."""
from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse, SearchRequest, SearchResponse, SearchResult
from app.services.chat import get_chat_service
from app.services.vector_store import get_vector_store

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Answer a question using RAG with source citations.

    The response will include:
    - An AI-generated answer grounded in the textbook content
    - Source citations with chapter, section, and relevant snippets
    - A flag indicating if the answer is grounded in content
    """
    try:
        chat_service = get_chat_service()
        response = chat_service.generate_response(
            message=request.message,
            history=request.history,
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


@router.post("/search", response_model=SearchResponse)
async def search(request: SearchRequest) -> SearchResponse:
    """
    Search for relevant content in the textbook.

    Returns top matching chunks with relevance scores.
    """
    try:
        vector_store = get_vector_store()
        results = vector_store.search(query=request.query, limit=request.limit)

        search_results = [
            SearchResult(
                chapter=r["chapter"],
                section=r["section"],
                content=r["content"],
                url=r["url"],
                score=r["score"],
            )
            for r in results
        ]

        return SearchResponse(results=search_results, query=request.query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")
