// The Vercel AI SDK with the Groundsocial MCP server.
//   npm install && AI_GATEWAY_API_KEY=... GROUNDSOCIAL_API_KEY=gs_live_... npm start -- "your question"
// (For plain function tools without MCP, see the @groundsocial/ai-sdk package.)
import { generateText, isStepCount } from 'ai';
import { connectGroundsocial } from './groundsocial';

const { client, tools } = await connectGroundsocial();
try {
  const { text } = await generateText({
    model: 'openai/gpt-5-mini',
    tools,
    stopWhen: isStepCount(8),
    prompt: process.argv.slice(2).join(' ') || 'What are developers on Reddit saying about the Vercel AI SDK this week?',
  });
  console.log(text);
} finally {
  await client.close();
}
