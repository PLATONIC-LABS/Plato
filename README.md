# PLATO RAG Architecture on Alibaba Cloud

## Frontend Cluster
- Next.js + Tailwind CSS (UI framework and styling)
- VM-WebUI (hosting environment for web interface)

## Backend & Orchestration Cluster
- LangChain (orchestration framework)
- Crew AI (agentic orchestration)
- API Gateway (API management)
- CidrBlock (user input handling)

## AI & Model Cluster
- PAI-EAS (Platform for AI - Elastic Algorithm Service)
- Large Language Model to use: Qwen-Turbo (Text-to-Text)

Qwen-Turbo is an ultra-large language model that supports multiple input languages such as Chinese and English.Compared to previous versions, the main improvement is in the extended context length. The maximum context length supported by the model has been expanded from 128k to 1M, which is approximately equivalent to 1 million English words or 1.5 million Chinese characters. This is roughly the same as 10 full-length novels, 150 hours of speech transcripts, or 30,000 lines of code.


## Data Storage Cluster
- AnalyticDB for PostgreSQL (vector database for embeddings)

## Infrastructure Cluster
- Alibaba Cloud (cloud provider)
- Compute Nest (deployment platform)

## Data Flow
The user interacts with the Next.js frontend, which sends requests through the API Gateway. 

LangChain orchestrates the process, retrieving relevant context from AnalyticDB's vector store and sending prompts to the LLMs hosted on PAI-EAS. 

The LLMs generate responses that are augmented with the retrieved information, and these are sent back through the API to be displayed on the frontend.
