// Checks the MCP wiring without a model.  GROUNDSOCIAL_API_KEY=gs_live_... npm run check
import { connectGroundsocial, TOOLS } from './groundsocial';

const { client, tools } = await connectGroundsocial();
const names = Object.keys(tools).sort();
if (names.length !== TOOLS.length) throw new Error(`got ${names.join(', ')}`);
console.log('tools:', names.join(', '));
const opts = { toolCallId: 'check', messages: [] } as any;
const out: any = await (tools as any).reddit_search_posts.execute({ q: 'vercel ai sdk', limit: 2 }, opts);
const text = JSON.stringify(out);
if (!text.includes('Listing')) throw new Error(text.slice(0, 300));
console.log('reddit_search_posts:', text.slice(0, 120));
await client.close();
console.log('ok');
