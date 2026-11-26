// A Mastra agent that researches social media through the Groundsocial MCP server.
//   npm install && OPENAI_API_KEY=sk-... GROUNDSOCIAL_API_KEY=gs_live_... npm start -- "your question"
import { Agent } from '@mastra/core/agent';
import { groundsocialMcp, groundsocialTools } from './groundsocial';

const agent = new Agent({
  id: 'social-researcher',
  name: 'Social researcher',
  instructions:
    'You research what people say online with the Groundsocial tools (Reddit, TikTok, YouTube). ' +
    'Quote real posts with links and say how many sources you read.',
  model: 'openai/gpt-5-mini',
  tools: await groundsocialTools(),
});

const question = process.argv.slice(2).join(' ') || 'What are people saying about Mastra on Reddit this month?';
const response = await agent.generate(question, { maxSteps: 10 });
console.log(response.text);
await groundsocialMcp.disconnect();
