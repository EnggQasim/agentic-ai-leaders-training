"""Personalization API endpoints."""
from fastapi import APIRouter, HTTPException, Cookie
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

from app.services.personalization import get_personalization_service
from app.services.auth import get_auth_service


router = APIRouter(prefix="/personalization", tags=["personalization"])


# Request/Response Models

class SetPreferencesRequest(BaseModel):
    """Request to set user preferences."""
    role: str = Field(..., description="User role (student, researcher, engineer, hobbyist)")
    experience_level: str = Field(..., description="Experience level (beginner, intermediate, advanced)")
    interests: List[str] = Field(default=[], description="List of interest topics")


class PreferencesResponse(BaseModel):
    """User preferences response."""
    user_id: str
    role: str
    experience_level: str
    interests: List[str]
    created_at: str
    updated_at: str


class UpdateProgressRequest(BaseModel):
    """Request to update reading progress."""
    chapter_id: str = Field(..., description="Chapter identifier")
    time_spent_seconds: int = Field(0, ge=0, description="Time spent reading in seconds")
    completed: bool = Field(False, description="Whether the chapter is completed")


class ProgressResponse(BaseModel):
    """Reading progress response."""
    user_id: str
    chapters: Dict[str, Any]
    total_time_seconds: int
    last_activity: Optional[str]


class RecommendationItem(BaseModel):
    """A recommendation item."""
    chapter_id: str
    score: float
    reason: str


class SimplifyRequest(BaseModel):
    """Request to simplify content."""
    content: str = Field(..., description="Content to simplify")
    chapter_id: str = Field(..., description="Chapter identifier for caching")


class SimplifyResponse(BaseModel):
    """Simplified content response."""
    original_length: int
    simplified_content: str
    user_level: str


class OnboardingStatusResponse(BaseModel):
    """Onboarding status response."""
    needs_onboarding: bool
    available_roles: Dict[str, str]
    available_levels: Dict[str, str]


# Helper function to get user ID from token
def get_user_id_from_token(auth_token: Optional[str]) -> Optional[str]:
    """Extract user ID from auth token."""
    if not auth_token:
        return None
    auth_service = get_auth_service()
    user_info = auth_service.verify_token(auth_token)
    return user_info["user_id"] if user_info else None


# Endpoints

@router.get("/status", response_model=OnboardingStatusResponse)
async def get_onboarding_status(
    auth_token: Optional[str] = Cookie(None, alias="auth_token")
) -> OnboardingStatusResponse:
    """
    Check if user needs onboarding and get available options.
    """
    service = get_personalization_service()
    user_id = get_user_id_from_token(auth_token)

    return OnboardingStatusResponse(
        needs_onboarding=service.needs_onboarding(user_id) if user_id else True,
        available_roles=service.get_available_roles(),
        available_levels=service.get_available_levels()
    )


@router.get("/preferences", response_model=Optional[PreferencesResponse])
async def get_preferences(
    auth_token: Optional[str] = Cookie(None, alias="auth_token")
) -> Optional[PreferencesResponse]:
    """
    Get current user's preferences.
    """
    user_id = get_user_id_from_token(auth_token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    service = get_personalization_service()
    prefs = service.get_preferences(user_id)

    if not prefs:
        return None

    return PreferencesResponse(**prefs)


@router.post("/preferences", response_model=PreferencesResponse)
async def set_preferences(
    request: SetPreferencesRequest,
    auth_token: Optional[str] = Cookie(None, alias="auth_token")
) -> PreferencesResponse:
    """
    Set or update user preferences.
    """
    user_id = get_user_id_from_token(auth_token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    service = get_personalization_service()

    try:
        prefs = service.set_preferences(
            user_id=user_id,
            role=request.role,
            experience_level=request.experience_level,
            interests=request.interests
        )
        return PreferencesResponse(**prefs)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/preferences")
async def delete_preferences(
    auth_token: Optional[str] = Cookie(None, alias="auth_token")
) -> Dict[str, bool]:
    """
    Delete user preferences (reset onboarding).
    """
    user_id = get_user_id_from_token(auth_token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    service = get_personalization_service()
    deleted = service.delete_preferences(user_id)

    return {"deleted": deleted}


@router.get("/progress", response_model=ProgressResponse)
async def get_progress(
    auth_token: Optional[str] = Cookie(None, alias="auth_token")
) -> ProgressResponse:
    """
    Get user's reading progress.
    """
    user_id = get_user_id_from_token(auth_token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    service = get_personalization_service()
    progress = service.get_progress(user_id)

    return ProgressResponse(**progress)


@router.post("/progress", response_model=ProgressResponse)
async def update_progress(
    request: UpdateProgressRequest,
    auth_token: Optional[str] = Cookie(None, alias="auth_token")
) -> ProgressResponse:
    """
    Update reading progress for a chapter.
    """
    user_id = get_user_id_from_token(auth_token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    service = get_personalization_service()
    progress = service.update_chapter_progress(
        user_id=user_id,
        chapter_id=request.chapter_id,
        time_spent_seconds=request.time_spent_seconds,
        completed=request.completed
    )

    return ProgressResponse(**progress)


@router.get("/recommendations", response_model=List[RecommendationItem])
async def get_recommendations(
    current_chapter: Optional[str] = None,
    limit: int = 3,
    auth_token: Optional[str] = Cookie(None, alias="auth_token")
) -> List[RecommendationItem]:
    """
    Get personalized chapter recommendations.
    """
    user_id = get_user_id_from_token(auth_token)
    if not user_id:
        # Return default recommendations for anonymous users
        user_id = "anonymous"

    service = get_personalization_service()
    recommendations = service.get_recommendations(
        user_id=user_id,
        current_chapter=current_chapter,
        limit=limit
    )

    return [RecommendationItem(**rec) for rec in recommendations]


@router.post("/simplify", response_model=SimplifyResponse)
async def simplify_content(
    request: SimplifyRequest,
    auth_token: Optional[str] = Cookie(None, alias="auth_token")
) -> SimplifyResponse:
    """
    Get simplified version of content based on user's experience level.
    """
    user_id = get_user_id_from_token(auth_token)
    service = get_personalization_service()

    # Get user's level or default to beginner
    user_level = "beginner"
    if user_id:
        prefs = service.get_preferences(user_id)
        if prefs:
            user_level = prefs.get("experience_level", "beginner")

    simplified = await service.get_simplified_content(
        content=request.content,
        chapter_id=request.chapter_id,
        user_level=user_level
    )

    return SimplifyResponse(
        original_length=len(request.content),
        simplified_content=simplified,
        user_level=user_level
    )
