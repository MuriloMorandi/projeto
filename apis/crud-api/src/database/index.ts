import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({
    url: 'libsql://teste-murilomorandi.aws-us-east-1.turso.io',
    authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicm8iLCJleHAiOjE3NDU0NjQ4OTgsImlhdCI6MTc0NTM3ODQ5OCwiaWQiOiJiNjdmNjk2NS00YmY3LTRjNGMtYmYwYi1iNjQwYWI5YWI1ODQiLCJyaWQiOiJmMjlkYzI1ZS03MTA0LTQxYTYtODgxZS0wOTlmYWUyNGE5NzkifQ.PZSyAueDeyXaEuYoi1s18NsdZVY0hNdLbbKaKoYw50yDabwAHgzwJ_-E3UtE0R1aFLb4zWl-h9fmOrW107tFCw'
}); 

export const db = drizzle(client);


export const dbTest = drizzle(createClient({
   url:'file:teste.db' 
}));