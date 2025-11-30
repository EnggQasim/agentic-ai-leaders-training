---
title: Physical AI Textbook API
emoji: 🤖
colorFrom: green
colorTo: blue
sdk: docker
pinned: false
license: mit
app_port: 7860
---

# Physical AI Textbook RAG API

A RAG-powered chatbot API for the Physical AI & Humanoid Robotics textbook.

## Features

- Semantic search over textbook content using OpenAI embeddings
- Grounded responses with source citations
- FastAPI backend with health monitoring

## Endpoints

### Core
- `GET /` - API info
- `GET /health` - Health check

### Chat (RAG)
- `POST /api/chat/` - Chat with RAG context
- `GET /api/chat/search` - Search textbook content

### Diagram Generator
- `POST /api/diagram/generate` - Generate AI diagrams
- `GET /api/diagram/predefined` - List predefined diagrams
- `GET /api/diagram/cached` - List cached diagrams
- `GET /api/diagram/concept/{id}` - Get specific diagram

### Podcast Generator
- `GET /api/podcast/providers` - List TTS providers (OpenAI, Higgs Audio)
- `GET /api/podcast/providers/higgs/status` - Check Higgs Audio availability
- `POST /api/podcast/generate` - Generate podcast from chapter
- `GET /api/podcast/chapters` - List chapters with podcast info
- `GET /api/podcast/list` - List generated podcasts
- `GET /api/podcast/{id}` - Get specific podcast
- `GET /api/podcast/chapter/{id}/info` - Get chapter podcast info

### Authentication (OAuth)
- `GET /api/auth/status` - Check configured providers
- `GET /api/auth/session` - Get current session
- `GET /api/auth/github/url` - Get GitHub OAuth URL
- `GET /api/auth/google/url` - Get Google OAuth URL
- `GET /api/auth/github/callback` - Handle GitHub OAuth callback
- `GET /api/auth/google/callback` - Handle Google OAuth callback
- `POST /api/auth/signout` - Sign out current session
- `GET /api/auth/me` - Get current user info

### Personalization
- `GET /api/personalization/status` - Check onboarding status
- `GET /api/personalization/preferences` - Get user preferences
- `POST /api/personalization/preferences` - Set user preferences
- `DELETE /api/personalization/preferences` - Delete preferences
- `GET /api/personalization/progress` - Get reading progress
- `POST /api/personalization/progress` - Update chapter progress
- `GET /api/personalization/recommendations` - Get chapter recommendations
- `POST /api/personalization/simplify` - Get simplified content

### Translation (Urdu)
- `POST /api/translation/translate` - Translate text to Urdu
- `POST /api/translation/translate/paragraph` - Translate paragraph
- `GET /api/translation/cache/stats` - Get cache statistics
- `POST /api/translation/cache/clear` - Clear translation cache

## Environment Variables

Set the following secrets in your Hugging Face Space:
- `OPENAI_API_KEY` - Your OpenAI API key
- `GEMINI_API_KEY` - Your Google Gemini API key (for diagrams)
- `GITHUB_CLIENT_ID` - GitHub OAuth App client ID (optional)
- `GITHUB_CLIENT_SECRET` - GitHub OAuth App secret (optional)
- `GOOGLE_CLIENT_ID` - Google OAuth client ID (optional)
- `GOOGLE_CLIENT_SECRET` - Google OAuth secret (optional)
- `JWT_SECRET` - Secret for JWT tokens (auto-generated if not set)
