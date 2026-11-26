// Checks the MCP wiring without a model: list the filtered tools and call two of them.
//   GROUNDSOCIAL_API_KEY=gs_live_... npm run check
import { groundsocialMcp, groundsocialTools, TOOLS } from './groundsocial';

const tools = await groundsocialTools();
const names = Object.keys(tools).sort();
if (names.length !== TOOLS.length) throw new Error(`expected ${TOOLS.length} tools, got ${names.join(', ')}`);
console.log('tools:', names.join(', '));

const find: any = await (tools as any).groundsocial_utility_find_get.execute({ task: 'youtube transcript' });
console.log('utility_find_get:', JSON.stringify(find).slice(0, 120));
const posts: any = await (tools as any).groundsocial_reddit_search_posts.execute({ q: 'mastra ai', limit: 2 });
const text = JSON.stringify(posts);
if (!text.includes('Listing')) throw new Error(text.slice(0, 300));
console.log('reddit_search_posts:', text.slice(0, 120));
await groundsocialMcp.disconnect();
console.log('ok');
