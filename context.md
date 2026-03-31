# Project Context: Unified AI Agent (Claude + OpenClaw)

## 🎯 Vision
A high-performance, single-application AI assistant that combines the "Claude.ai" web experience (premium chat, artifacts, visual reasoning) with "OpenClaw" autonomous agent capabilities (shell execution, browser automation, file system manipulation).

## 🛠 Technology Stack
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion, Monaco Editor (Code), XTerm.js (Terminal).
- **Backend**: Python 3.11+, FastAPI (Async), SQLAlchemy (ORM).
- **Agent Orchestrator**: LangChain / LangGraph, Pydantic (Schema validation).
- **Runtime & Tools**: 
    - Playwright (Browser Automation & Visual Reasoning).
    - Docker (Sandboxed Shell & File System).
- **Models**:
    - **Primary**: Claude 3.5 Sonnet (Peak complexity).
    - **Local/Test**: Ollama (Llama 3.1, Mistral) for cost-free iteration.

## 🏗 Current Architecture
- **Model Adapter Pattern**: Unified interface for switching between remote (Anthropic) and local (Ollama) models.
- **Thought-Action-Result Loop**: Transparent agent logs shown to the user in a dedicated "Observer" dashboard.
- **Premium Artifacts**: Side-panel for rendering live HTML/React previews, diagrams (Mermaid), and interactive code.

## 📈 Progress & Roadmap
- [x] High-level System Design & Technical Architecture.
- [x] Project Initialization (Next.js & FastAPI Boilerplate).
- [/] **Sprint 1 (Current)**: Foundation - Secure streaming chat + model toggle + simple artifacts.
- [ ] **Sprint 2**: Agentic Core - Docker-based Shell & File System integration.
- [ ] **Sprint 3**: Visual Automation - Playwright integration & vision-loop.

**Commit Status**: 3/50 granular commits completed.
