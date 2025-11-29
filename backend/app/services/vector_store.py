"""Vector store service using Qdrant."""
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
)
from typing import List, Dict, Any, Optional
from app.config import get_settings
from app.services.embedding import get_embedding_service
import uuid


class VectorStoreService:
    """Service for Qdrant vector operations."""

    def __init__(self):
        settings = get_settings()

        # Use in-memory Qdrant if URL is not properly configured or for local dev
        if settings.qdrant_use_memory or not settings.qdrant_url:
            print("Using in-memory Qdrant (set QDRANT_USE_MEMORY=false and configure QDRANT_URL for cloud)")
            self.client = QdrantClient(":memory:")
        else:
            print(f"Connecting to Qdrant at {settings.qdrant_url}")
            self.client = QdrantClient(
                url=settings.qdrant_url,
                api_key=settings.qdrant_api_key,
            )
        self.collection_name = settings.qdrant_collection
        self.embedding_service = get_embedding_service()
        self.dimensions = settings.embedding_dimensions

    def ensure_collection(self) -> bool:
        """Create collection if it doesn't exist."""
        collections = self.client.get_collections().collections
        collection_names = [c.name for c in collections]

        if self.collection_name not in collection_names:
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(
                    size=self.dimensions,
                    distance=Distance.COSINE,
                ),
            )
            return True
        return False

    def add_chunks(self, chunks: List[Dict[str, Any]]) -> int:
        """Add text chunks to the vector store."""
        if not chunks:
            return 0

        texts = [chunk["content"] for chunk in chunks]
        embeddings = self.embedding_service.embed_texts(texts)

        points = []
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            point = PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload={
                    "chapter": chunk.get("chapter", ""),
                    "section": chunk.get("section", ""),
                    "content": chunk["content"],
                    "url": chunk.get("url", ""),
                    "chunk_index": i,
                },
            )
            points.append(point)

        self.client.upsert(
            collection_name=self.collection_name,
            points=points,
        )
        return len(points)

    def search(
        self,
        query: str,
        limit: int = 5,
        chapter_filter: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Search for similar content."""
        query_embedding = self.embedding_service.embed_text(query)

        search_filter = None
        if chapter_filter:
            search_filter = Filter(
                must=[
                    FieldCondition(
                        key="chapter",
                        match=MatchValue(value=chapter_filter),
                    )
                ]
            )

        results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding,
            limit=limit,
            query_filter=search_filter,
        )

        return [
            {
                "chapter": hit.payload.get("chapter", ""),
                "section": hit.payload.get("section", ""),
                "content": hit.payload.get("content", ""),
                "url": hit.payload.get("url", ""),
                "score": hit.score,
            }
            for hit in results
        ]

    def get_collection_info(self) -> Dict[str, Any]:
        """Get collection statistics."""
        try:
            info = self.client.get_collection(self.collection_name)
            return {
                "points_count": info.points_count,
                "vectors_count": info.vectors_count,
                "status": info.status.value,
            }
        except Exception:
            return {"points_count": 0, "vectors_count": 0, "status": "not_found"}

    def clear_collection(self) -> bool:
        """Delete all points from collection."""
        try:
            self.client.delete_collection(self.collection_name)
            self.ensure_collection()
            return True
        except Exception:
            return False


# Singleton instance
_vector_store = None


def get_vector_store() -> VectorStoreService:
    """Get or create vector store instance."""
    global _vector_store
    if _vector_store is None:
        _vector_store = VectorStoreService()
    return _vector_store
