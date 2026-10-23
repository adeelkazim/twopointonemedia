import identities from './identities.js';
export const WIDTH=1880, HEIGHT=1400;
export const districts={access:'Arrival Gardens',mind:'Knowledge Quarter',workshop:'Maker Foundry',agents:'Team Courtyard',control:'Brass Gate',cloud:'Sky Docks',centre:'Heart of Town'};
const positions={1:[920,620],2:[220,160],3:[440,180],4:[220,360],5:[440,380],6:[740,160],7:[950,160],8:[1160,160],9:[740,350],30:[950,350],32:[1160,350],10:[160,620],11:[360,620],12:[560,620],13:[160,830],14:[360,830],15:[560,830],16:[160,1040],31:[360,1040],33:[560,1040],17:[850,1050],18:[1070,1050],19:[1290,1050],20:[850,1250],21:[1070,1250],22:[1290,1250],23:[1510,1080],24:[1730,1080],25:[1510,170],26:[1730,170],27:[1510,380],28:[1730,380],29:[1620,620]};
const descriptions=[
 'The runtime coordinates messages, models and tools. Think of this central hall as the place where a conversation becomes a sequence of work.',
 'The human starting point: Adeel sets goals, reviews outcomes and decides what happens next. This cottage represents the person, not an automated service.',
 'A desktop doorway into conversations and work. A client presents the experience; it is separate from the runtime that carries out the work.',
 'A messaging doorway for conversations from Telegram. The post office metaphor explains message delivery, not access to any real inbox here.',
 'An alternative client doorway into the same team. This lodge represents an interface, not another model or a source of private conversations.',
 'Shared rules give the team its operating boundaries. This hall represents reviewed context and conventions; no private charter text is displayed.',
 'A library for reviewed, reusable memory. Only explicitly approved catalog metadata belongs here. The public demo contains fictional garden notes, never real memories.',
 'A conceptual archive of conversations and their continuity. Session bodies, transcripts and account details are not available in this read-only town.',
 'A knowledge store for linked notes. This building explains the vault role without opening private files, note bodies or filesystem paths.',
 'A workshop catalog of reusable procedures. A skill helps an agent perform a kind of task; it is not the model doing the reasoning. Demo entries are fictional.',
 'Tools for commands and files belong behind explicit safety boundaries. This workshop explains their role but cannot execute commands or read a real filesystem.',
 'A tool for navigating and inspecting web pages. This town does not launch browsing jobs, visit external services or expose browser sessions.',
 'A research-adapter lookout for finding information. The conceptual tower represents a tool connection, not guaranteed access or current search activity.',
 'A workshop for document and media workflows. The town explains the capability without exposing documents, uploads, generated files or their contents.',
 'A clock tower for scheduled work. Schedules and next-run times are not invented here; this static view cannot start, stop or edit jobs.',
 'A dispatch desk for delegating bounded work. It represents coordination between tasks and workers, not a live queue or a way to start new work.',
 'The team lead coordinates work and reviews handoffs. This is a profile identity, not evidence that a process is active or a task is underway.',
 'The software specialist builds and tests artifacts. This profile cottage describes a team role, not access to build systems or live development activity.',
 'A worker profile for delegated tasks. A saved profile and a running process are different things; this building does not imply either current availability or load.',
 'Another worker profile for parallel tasks. Profile identity is preserved while current activity, availability and task contents remain unknown.',
 'A standby profile identity. The name does not guarantee an independent provider, active recovery service or current runtime availability.',
 'A shared board for task ownership, dependencies and handoffs. The display is read-only and does not reveal real cards, assignments or comments.',
 'The boundary where a human reviews consequential actions. Exploring a building never grants approval or starts a deployment.',
 'A locked symbol for credential handling, never a credential browser. No values, account details, authentication controls or real secret material are included.',
 'A model-provider connection supplies inference to the runtime. It is conceptually distinct from reusable skills. No provider account, quota or model usage is exposed.',
 'An external API integration for workspace workflows. This map cannot read or change mail, calendars, documents or any Google account.',
 'An external API integration for repository and website workflows. This static map cannot push code, open pull requests or change the published site.',
 'Public web resources sit outside the runtime. The dock marks an external information boundary, not a browsing session or a live connection.',
 'An external image-generation provider role. It is separate from local image transport and does not expose uploads, prompts or provider settings.',
 'A dashboard-service identity for presenting information. It is not the agent runtime or proof of current service availability.',
 'An adapter workshop between tools and API-shaped interfaces. This building is explanatory only and offers no callable operational API.',
 'A runtime-supervisor identity. Reliable health would require fresh, qualified evidence; this static town makes no claim that a process is active.',
 'A local image-workflow adapter, distinct from remote image computation. No local image filesystem, command execution or transport endpoint is exposed.'
];
export const places=identities.map(p=>({...p,x:positions[p.building][0],y:positions[p.building][1],description:descriptions[p.building-1]}));
export function findPlaces(query='',quarter=''){
 const q=query.trim().toLocaleLowerCase();
 return places.filter(p=>(!quarter||p.quarter===quarter)&&`${p.building} ${p.name} ${p.type} ${districts[p.quarter]}`.toLocaleLowerCase().includes(q));
}
