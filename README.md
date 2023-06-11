# Edgar API

Tech stack:
- local DB postgresql
- vector DB Pinecone
- ORM Prisma
- OpenAPI (Embedding/Completion)
- Langchain integration (HNSWLib, OpenAI API, Buffer memory)

Repository includes some experiments with the current state of langchain. There is an endpoint (`docs/upload`) which allows to upload and store embeddings (generated from uploaded files) within in-memory vector db (HNSWLib). Then you can make request to query endpoint (`docs/query`) asking about any information relevant to uploaded docs. Relevant data is gathered through similarity search. 
The response is generated with the help of OpenAI GPT-3.5-turbo.

```
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{
        "message": "Do you have a question?"
     }' \
     http://localhost:2137/assistant/conversation
```
