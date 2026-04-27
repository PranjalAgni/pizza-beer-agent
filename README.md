# Pizza Beer Pairing Agent

A tiny AI agent that figures out which pizza and beer to order together. Built on a weekend as my first LangGraph project.

You give it your mood, budget, and whether you're vegetarian — it filters the menu and asks GPT-4 Mini to pick the perfect pairing with a reason why.

```
Mood: "date night", Budget: ₹700, Spicy: yes

→ Spicy Paneer Pizza + Kingfisher Premium
   "The heat from the paneer is balanced nicely by the crisp lager..."
```

## How it works

Three nodes wired up as a LangGraph state machine:

1. **collectPreferences** — validates that mood and budget are present
2. **fetchMenus** — splits the budget 70/30 (pizza/beer), filters the menu JSON files
3. **pairItems** — sends the filtered options to GPT-4 Mini, gets back a JSON pairing + reasoning

```
collectPreferences → fetchMenus → pairItems
```

## Stack

- **LangGraph** — graph-based workflow orchestration (the whole point of this project)
- **LangChain** — tools for filtering menu items, OpenAI wrapper
- **OpenAI GPT-4 Mini** — does the actual pairing logic
- **Zod** — schema validation for state flowing through the graph
- **TypeScript + tsx**

## Project structure

```
src/
├── index.ts       # entry point, kicks off the graph
├── graph.ts       # the three-node LangGraph workflow
├── state.ts       # Zod schemas for the shared state
├── tools.ts       # LangChain tools that filter pizzas/beers
└── menu/
    ├── pizzas.json
    └── beers.json
```

## Setup

```bash
npm install
```

Create a `.env` file:

```
OPENAI_API_KEY=your_key_here
```

## Run

```bash
npm run dev
```

The input preferences are hardcoded in `src/index.ts` — change the mood, budget, and dietary flags there to try different combinations.

## What I learned

- How LangGraph nodes work (pure functions that return partial state updates)
- Wiring up LangChain tools inside a graph
- Constraining LLM output to JSON and validating it against a schema
- Honestly, also that GPT-4 Mini has surprisingly good opinions about beer
- Langgraph makes it pretty easy to understand the agent as thinking shifts to a graph model and state machine which makes it very clear
