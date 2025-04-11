# PLATO: Multi-Agent RAG Infrastructure
#### Powering the future of Agentic Legaltech and AI-Powered Contract Drafting

## Frontend Cluster
- Next.js (Server-Side Rendering)
- Tailwind CSS (UI Styling)

## Backend & Orchestration Cluster
- LangChain (orchestration framework)
- Crew AI (agentic orchestration)
- API Gateway (API management)

## AI & Model Cluster
- Large Language Model used: Qwen-Turbo (for Text-to-Text Generation)

Qwen-Turbo is an ultra-large language model that supports multiple input languages such as Chinese and English.Compared to previous versions, the main improvement is in the extended context length. The maximum context length supported by the model has been expanded from 128k to 1M, which is approximately equivalent to 1 million English words or 1.5 million Chinese characters. This is roughly the same as 10 full-length novels, 150 hours of speech transcripts, or 30,000 lines of code.

## Data Storage Cluster
- locally hosted PostgreSQL & pgvector (vector database for embeddings)

## Infrastructure Cluster
- Alibaba Cloud Elastic Compute Service (cloud hosting)

## Data Flow
The user interacts with the Next.js frontend, which sends requests through the API Gateway. 

LangChain orchestrates the process, retrieving relevant context from AnalyticDB's vector store and sending prompts to the LLMs hosted on Alibaba Model Studio. 

The LLMs generate responses that are augmented with the retrieved information, and these are sent back through the API to be displayed on the frontend.
