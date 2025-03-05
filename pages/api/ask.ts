import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
// For openai@4.x, import the default export:
import OpenAI from 'openai';

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed.' });
  }

  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'No question provided.' });
  }

  try {
    // 1) Initialize client
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // 2) Load your chapter2-embeddings.json
    const embeddingsPath = path.join(process.cwd(), 'chapter2-embeddings.json');
    const embeddedData = JSON.parse(fs.readFileSync(embeddingsPath, 'utf-8'));

    // 3) Embed the user question
    const embedRes = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: question
    });
    const userEmbedding = embedRes.data[0].embedding;

    // 4) Find best chunk by cosine similarity
    let bestChunk = null;
    let bestScore = -Infinity;

    for (const chunkObj of embeddedData) {
      const score = cosineSimilarity(userEmbedding, chunkObj.embedding);
      if (score > bestScore) {
        bestScore = score;
        bestChunk = chunkObj;
      }
    }

    if (!bestChunk) {
      return res.status(200).json({ answer: 'No matching chunk found.' });
    }

    // 5) Now call GPT with that chunk as context
    // Using Chat Completions
    const chatRes = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful tutor. Use ONLY the following text to answer. If it's not in the text, say "Not enough info."\n\nText:\n${bestChunk.text}`
        },
        { role: 'user', content: question }
      ],
      temperature: 0.0
    });

    const answer = chatRes.choices[0].message?.content || 'No answer found.';
    return res.status(200).json({ answer });

  } catch (err: any) {
    console.error('Error in ask API route:', err.message || err);
    return res.status(500).json({ error: err.message });
  }
}
