# Agent Specification: Multimodal RAG Agent

**Version**: 1.0.0
**Created**: 2025-12-02
**Status**: Production-Ready Specification
**Source**: Physical AI Textbook Project Experience

## Overview

An AI agent specialized in Retrieval-Augmented Generation (RAG) supporting both text and image search. Enables context-aware Q&A, selected text explanations, and diagram/image retrieval from indexed content.

## Agent Identity

```yaml
name: multimodal-rag-agent
type: specialized
framework: claude-agent-sdk  # or langchain/crewai
role: Knowledge Retrieval & Question Answering
goal: Answer questions accurately using indexed content with source citations
backstory: |
  Expert in information retrieval, semantic search, and multimodal AI.
  Skilled at finding relevant text and images from large knowledge bases
  and generating accurate, well-cited responses.
```

## Core Capabilities

### 1. Text-Based Q&A

- Answer questions from indexed content
- Maintain conversation context (5+ turns)
- Provide source citations with every answer
- Handle follow-up questions naturally

### 2. Selected Text Explanation

- Explain highlighted passages
- Simplify complex concepts
- Provide additional context
- Support code explanation

### 3. Image/Diagram Search

- Find relevant diagrams by description
- Return images with captions and locations
- Support hybrid text+image queries

### 4. Conversation Management

- Session-based memory
- Context preservation across page navigation
- "New Chat" reset capability

## Architecture

### Dual-Embedding Strategy

```yaml
embedding_strategy:
  text:
    model: text-embedding-3-small
    dimensions: 1536
    provider: OpenAI

  image:
    model: CLIP ViT-B/32
    dimensions: 512
    provider: Local (transformers)
```

### Vector Database Schema (Qdrant)

```json
{
  "collection_name": "knowledge_base",
  "vectors": {
    "text": { "size": 1536, "distance": "Cosine" },
    "image": { "size": 512, "distance": "Cosine" }
  },
  "payload_schema": {
    "chunk_id": "string",
    "content": "string",
    "chapter_id": "string",
    "section": "string",
    "content_type": "enum[text, image]",
    "url": "string",
    "alt_text": "string",
    "position": "integer"
  }
}
```

### Chunking Strategy

```python
CHUNKING_CONFIG = {
    "text": {
        "max_tokens": 512,
        "overlap_tokens": 50,
        "respect_boundaries": True,  # Don't split mid-sentence
        "separators": ["\n## ", "\n### ", "\n\n", "\n", ". "]
    },
    "image": {
        "supported_formats": ["png", "jpg", "jpeg", "gif", "svg"],
        "extract_from": ["markdown_images", "static_folder"],
        "require_alt_text": True,
        "skip_icons": True,
        "min_dimensions": (100, 100)
    }
}
```

## Tools & Integrations

### Required Tools

```yaml
tools:
  - name: text_embedder
    description: Generate text embeddings
    provider: openai
    model: text-embedding-3-small

  - name: clip_embedder
    description: Generate image embeddings
    provider: local
    model: CLIP ViT-B/32

  - name: vector_search
    description: Search Qdrant vector database
    provider: qdrant
    operations: [search, upsert, delete]

  - name: llm_generator
    description: Generate responses from retrieved context
    provider: openai
    model: gpt-4o-mini

  - name: content_indexer
    description: Index new content into vector database
    provider: local
    operations: [chunk, embed, store]
```

### API Endpoints

```yaml
endpoints:
  - POST /chat
    input: { message: string, session_id?: string, selected_text?: string }
    output: { response: string, sources: Source[], session_id: string }

  - POST /chat/stream
    input: { message: string, session_id?: string }
    output: SSE stream of response chunks

  - GET /chat/history/{session_id}
    output: { messages: Message[], created_at: timestamp }

  - DELETE /chat/session/{session_id}
    output: { success: boolean }

  - POST /search/text
    input: { query: string, limit?: number }
    output: { results: TextResult[] }

  - POST /search/image
    input: { query: string, limit?: number }
    output: { results: ImageResult[] }

  - POST /search/hybrid
    input: { query: string, text_weight?: number, image_weight?: number }
    output: { results: HybridResult[] }

  - POST /index/content
    input: { content: string, metadata: ContentMetadata }
    output: { chunk_count: number, success: boolean }
```

## Query Processing Pipeline

```python
async def process_query(query: str, session_id: str, query_type: str = "auto"):
    """
    Main query processing pipeline.

    1. Detect query type (text/image/hybrid)
    2. Generate embeddings
    3. Search vector database
    4. Retrieve relevant context
    5. Generate response with citations
    """

    # Step 1: Detect query type
    if query_type == "auto":
        query_type = detect_query_type(query)  # text/image/hybrid

    # Step 2: Get conversation history
    history = get_session_history(session_id, limit=5)

    # Step 3: Search based on query type
    results = []

    if query_type in ["text", "hybrid"]:
        text_embedding = await embed_text(query)
        text_results = await qdrant.search(
            collection="knowledge_base",
            vector=text_embedding,
            vector_name="text",
            limit=5,
            score_threshold=0.7
        )
        results.extend(text_results)

    if query_type in ["image", "hybrid"]:
        image_embedding = await embed_with_clip(query)
        image_results = await qdrant.search(
            collection="knowledge_base",
            vector=image_embedding,
            vector_name="image",
            limit=3,
            score_threshold=0.7
        )
        results.extend(image_results)

    # Step 4: Dedupe and rank
    context = dedupe_and_rank(results)

    # Step 5: Generate response
    response = await generate_response(
        query=query,
        context=context,
        history=history,
        require_citations=True
    )

    # Step 6: Update session
    update_session(session_id, query, response)

    return {
        "response": response.text,
        "sources": response.citations,
        "session_id": session_id
    }
```

## Retrieval Configuration

```python
RETRIEVAL_CONFIG = {
    "text_top_k": 5,
    "image_top_k": 3,
    "score_threshold": 0.7,  # Minimum relevance
    "hybrid_weights": {
        "text": 0.7,
        "image": 0.3
    },
    "reranking": {
        "enabled": True,
        "model": "cross-encoder/ms-marco-MiniLM-L-6-v2"
    },
    "context_window": {
        "max_tokens": 4000,
        "include_surrounding": True
    }
}
```

## Response Generation

### System Prompt Template

```
You are a helpful assistant that answers questions based ONLY on the provided context.
Your knowledge is limited to the content in the knowledge base.

Rules:
1. Only answer questions using the provided context
2. Cite sources for every factual claim: [Chapter X, Section Y]
3. If information is not in context, say "I couldn't find information about that"
4. For off-topic questions, redirect to available topics
5. Keep responses concise but complete
6. Include relevant images/diagrams when available

Context:
{retrieved_context}

Conversation History:
{conversation_history}

User Question: {query}
```

### Citation Format

```json
{
  "source": {
    "chapter_slug": "module-1-ros2",
    "section_heading": "Nodes and Topics",
    "url": "/docs/module-1-ros2/nodes-topics",
    "relevance_score": 0.89,
    "content_preview": "First 100 characters..."
  }
}
```

## Memory & State

```yaml
memory:
  session:
    type: "in-memory + localStorage"
    max_messages: 50
    expiry_minutes: 30
    fields:
      - session_id: string
      - messages: Message[]
      - created_at: timestamp
      - last_active: timestamp

  conversation:
    context_turns: 5  # Last 5 messages for context
    summary_after: 20  # Summarize after 20 messages

persistence:
  vector_db: Qdrant Cloud / Local
  session_store: Redis / localStorage
  index_metadata: PostgreSQL / JSON file
```

## Data Entities

```python
@dataclass
class ChatSession:
    session_id: str
    messages: List[Message]
    created_at: datetime
    last_active: datetime

@dataclass
class Message:
    role: Literal["user", "assistant"]
    content: str
    timestamp: datetime
    sources: List[Source]

@dataclass
class Source:
    chapter_slug: str
    section_heading: str
    relevance_score: float
    url: str
    content_preview: str

@dataclass
class ContentChunk:
    chunk_id: str
    text: str
    chapter_id: str
    section: str
    embedding_vector: List[float]
    position: int

@dataclass
class ImageIndex:
    image_id: str
    url: str
    alt_text: str
    caption: str
    chapter_id: str
    clip_embedding: List[float]
```

## Quality Assurance

### Validation Rules

```python
VALIDATION = {
    "response": {
        "max_length": 2000,  # characters
        "require_citation": True,
        "grounding_check": True  # Verify claims against context
    },
    "retrieval": {
        "min_score": 0.7,
        "max_results": 8,
        "diversity_threshold": 0.3  # Avoid duplicate content
    },
    "session": {
        "max_messages": 50,
        "max_duration_minutes": 30
    }
}
```

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Answer relevance | 90%+ | Sample review of 20 questions |
| Streaming start time | < 3 seconds | API response timing |
| Complete response time | < 10 seconds | End-to-end timing |
| Citation accuracy | 95%+ | Manual verification |
| Image search relevance | 80%+ | Sample review |
| Context maintenance | 100% | Follow-up question tests |
| Concurrent sessions | 50+ | Load testing |

## Error Handling

```python
ERROR_RESPONSES = {
    "off_topic": "I can only answer questions about {DOMAIN} topics covered in this knowledge base. Try asking about {TOPIC_LIST}.",
    "ambiguous": "I found information about both {TOPIC_A} and {TOPIC_B}. Which would you like to know about?",
    "not_found": "I couldn't find information about that in the knowledge base. Topics covered include: {TOPIC_LIST}",
    "too_long": "Your question was shortened. For best results, keep questions under 500 characters.",
    "api_error": "Chat is temporarily unavailable. Please try again in a moment.",
    "rate_limited": "Too many requests. Please wait a moment before trying again."
}
```

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Off-topic questions | Redirect with available topics list |
| Ambiguous queries | Ask clarifying question |
| Very long questions | Truncate with warning |
| Empty/gibberish input | Request rephrasing |
| API unavailable | Show retry button |
| Slow response | Show "Still thinking..." after 5s |
| No relevant content | List available topics |

## Reusability Configuration

### Domain Customization

```yaml
domain_configs:
  technical_documentation:
    topics: ["API", "SDK", "Configuration"]
    response_style: "technical, precise"
    citation_format: "[Section: {section}]"

  educational_content:
    topics: ["Concepts", "Tutorials", "Examples"]
    response_style: "explanatory, friendly"
    citation_format: "[Chapter {chapter}, {section}]"

  customer_support:
    topics: ["FAQ", "Troubleshooting", "Features"]
    response_style: "helpful, concise"
    citation_format: "[Help Article: {title}]"

  research_papers:
    topics: ["Methods", "Results", "Discussion"]
    response_style: "academic, thorough"
    citation_format: "[{author}, {year}, p.{page}]"
```

### Integration Examples

**LangChain Integration:**
```python
from langchain.chains import RetrievalQA
from langchain.vectorstores import Qdrant
from langchain.embeddings import OpenAIEmbeddings

vectorstore = Qdrant(
    collection_name="knowledge_base",
    embeddings=OpenAIEmbeddings()
)

rag_chain = RetrievalQA.from_chain_type(
    llm=ChatOpenAI(model="gpt-4o-mini"),
    chain_type="stuff",
    retriever=vectorstore.as_retriever(search_kwargs={"k": 5}),
    return_source_documents=True
)
```

**CrewAI Integration:**
```python
from crewai import Agent, Task, Tool

rag_tool = Tool(
    name="knowledge_search",
    description="Search the knowledge base for relevant information",
    func=rag_agent.search
)

researcher = Agent(
    role="Knowledge Researcher",
    goal="Find accurate information from the knowledge base",
    tools=[rag_tool],
    verbose=True
)
```

**Claude Agent SDK Integration:**
```typescript
import { Agent, Tool } from '@anthropic-ai/claude-agent-sdk';

const ragAgent = new Agent({
  name: 'multimodal-rag-agent',
  tools: [
    new Tool({
      name: 'search_knowledge',
      description: 'Search for information in the knowledge base',
      parameters: { query: { type: 'string' } },
      execute: async ({ query }) => await searchKnowledgeBase(query)
    }),
    new Tool({
      name: 'search_images',
      description: 'Search for diagrams and images',
      parameters: { query: { type: 'string' } },
      execute: async ({ query }) => await searchImages(query)
    })
  ]
});
```

## Indexing Pipeline

### Content Indexing Workflow

```python
async def index_content(source_path: str, content_type: str):
    """
    Index content into the vector database.

    1. Parse content (markdown, HTML, etc.)
    2. Extract text and images
    3. Chunk text appropriately
    4. Generate embeddings
    5. Store in Qdrant
    """

    # Parse content
    if content_type == "markdown":
        content = parse_markdown(source_path)
    elif content_type == "html":
        content = parse_html(source_path)

    # Index text chunks
    chunks = chunk_text(content.text, CHUNKING_CONFIG["text"])
    for chunk in chunks:
        embedding = await embed_text(chunk.text)
        await qdrant.upsert(
            collection="knowledge_base",
            points=[{
                "id": chunk.id,
                "vector": {"text": embedding},
                "payload": {
                    "content": chunk.text,
                    "chapter_id": chunk.chapter_id,
                    "section": chunk.section,
                    "content_type": "text"
                }
            }]
        )

    # Index images
    for image in content.images:
        clip_embedding = await embed_with_clip(image.path)
        await qdrant.upsert(
            collection="knowledge_base",
            points=[{
                "id": image.id,
                "vector": {"image": clip_embedding},
                "payload": {
                    "url": image.url,
                    "alt_text": image.alt_text,
                    "caption": image.caption,
                    "chapter_id": image.chapter_id,
                    "content_type": "image"
                }
            }]
        )
```

## Cost Estimation

```yaml
cost_per_1000_queries:
  text_embedding: $0.02  # OpenAI text-embedding-3-small
  clip_embedding: $0.00  # Local model
  llm_generation: $0.08  # GPT-4o-mini (avg 500 tokens response)
  vector_search: $0.001  # Qdrant Cloud
  total: ~$0.10

monthly_estimate:
  10k_queries: ~$100
  100k_queries: ~$1000
```

## References

1. **ADR-004**: Multimodal RAG Architecture decision
2. **OpenAI Embedding Guide**: Best practices for embeddings
3. **Qdrant Documentation**: Vector search optimization
4. **LangChain RAG**: Retrieval-augmented generation patterns
5. **CLIP Paper**: Learning Transferable Visual Models

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-02 | Initial specification from Physical AI Textbook project |
