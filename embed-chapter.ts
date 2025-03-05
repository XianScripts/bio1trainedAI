// embed-chapter.ts (CommonJS with TypeScript)

// Remove "export {}"
// Just start with top-level code

const fs = require('fs');
const path = require('path');
require('dotenv').config();
const OpenAI = require('openai');

(async () => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const textFilePath = path.join(process.cwd(), 'chapter2.txt');
    const rawText = fs.readFileSync(textFilePath, 'utf-8');

    const words = rawText.split(/\s+/);
    const chunkSize = 500;
    const chunks = [];

    for (let i = 0; i < words.length; i += chunkSize) {
      const slice = words.slice(i, i + chunkSize);
      chunks.push(slice.join(' '));
    }

    console.log(`Created ${chunks.length} chunks to embed.`);

    const embeddedData = [];
    let counter = 0;

    for (const chunk of chunks) {
      if (!chunk.trim()) continue;
      counter++;
      console.log(`Embedding chunk ${counter}/${chunks.length}...`);

      const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: chunk
      });

      const [record] = response.data;
      embeddedData.push({
        id: `chunk-${counter}`,
        text: chunk,
        embedding: record.embedding
      });
    }

    const outPath = path.join(process.cwd(), 'chapter2-embeddings.json');
    fs.writeFileSync(outPath, JSON.stringify(embeddedData, null, 2));

    console.log(`Done! Created ${embeddedData.length} embeddings.`);
    console.log(`Saved to: ${outPath}`);
  } catch (err) {
    console.error('Error in embed script:', err);
  }
})();
