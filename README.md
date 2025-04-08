# RAG Service Architecture on Alibaba Cloud

## Frontend Cluster
- Next.js + Tailwind CSS (UI framework and styling)
- VM-WebUI (hosting environment for web interface)

## Backend & Orchestration Cluster
- LangChain (orchestration framework)
- API Gateway (API management)
- CidrBlock (user input handling)

## AI & Model Cluster
- PAI-EAS (Platform for AI - Elastic Algorithm Service)
- Large Language Models:
 - QWen 7/13B
 - Llama 2 7/13B
 - Other LLMs

## Data Storage Cluster
- AnalyticDB for PostgreSQL (vector database for embeddings)

## Infrastructure Cluster
- Alibaba Cloud (cloud provider)
- Compute Nest (deployment platform)

## Data Flow
The user interacts with the Next.js frontend, which sends requests through the API Gateway. 

LangChain orchestrates the process, retrieving relevant context from AnalyticDB's vector store and sending prompts to the LLMs hosted on PAI-EAS. 

The LLMs generate responses that are augmented with the retrieved information, and these are sent back through the API to be displayed on the frontend.