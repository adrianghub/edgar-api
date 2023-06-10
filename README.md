# Edgar API

Tech stack:
- local DB postgresql
- vector DB Pinecone
- ORM Prisma
- OpenAPI (Embedding/Completion)


```
curl -X POST \
     -H "Content-Type: application/json" \
     -d '{
        "message": "Do you have a question?"
     }' \
     http://localhost:2137/assistant/conversation
```
