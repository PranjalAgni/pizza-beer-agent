import { END, START, StateGraph, StateSchema } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { PairingState, PairingStateSchema } from "./state";
import { getBeersTool, getPizzasTool } from "./tools";

const llm = new ChatOpenAI({
  model: "gpt-4.1-mini",
  temperature: 0.5,
});

async function collectPreferences(
  state: PairingState,
): Promise<Partial<PairingState>> {
  const needsMoreInfo = !state.mood || !state.budget;
  return { needsMoreInfo };
}

async function fetchMenus(state: PairingState): Promise<Partial<PairingState>> {
  const pizzaBudget = state.budget ? Math.floor(state.budget * 0.7) : undefined;
  const beerBudget = state.budget ? Math.floor(state.budget * 0.3) : undefined;

  const pizzas = await getPizzasTool.invoke({
    vegetarianOnly: state.vegetarianOnly,
    maxPrice: pizzaBudget,
  });

  const beers = await getBeersTool.invoke({
    maxPrice: beerBudget,
  });

  return { pizzas, beers };
}

async function pairItems(state: PairingState): Promise<Partial<PairingState>> {
  const prompt = `
You are a food pairing assistant.

User mood: ${state.mood}
Budget: ${state.budget}
Vegetarian only: ${state.vegetarianOnly ?? false}
Spicy preference: ${state.spicyPreference ?? false}

Available pizzas:
${JSON.stringify(state.pizzas, null, 2)}

Available beers:
${JSON.stringify(state.beers, null, 2)}

Pick exactly one pizza and one beer that go well together.
Return JSON with this shape:
{
  "pizzaName": "...",
  "beerName": "...",
  "reason": "..."
}
`;

  const result = await llm.invoke(prompt);
  const text = String(result.content);
  console.log("================");
  console.log("[LLM Response] ", text);
  console.log("================");
  let parsed: { pizzaName: string; beerName: string; reason: string };

  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Model did not return valid JSON");
  }

  const chosenPizza = state.pizzas?.find((p) => p.name === parsed.pizzaName);
  const chosenBeer = state.beers?.find((b) => b.name === parsed.beerName);

  if (!chosenPizza || !chosenBeer) {
    throw new Error("Model selected an item not present in the menu");
  }

  return {
    chosenPizza,
    chosenBeer,
    pairingReason: parsed.reason,
  };
}

export function buildGraph() {
  return new StateGraph(PairingStateSchema)
    .addNode("collectPreferences", collectPreferences)
    .addNode("fetchMenus", fetchMenus)
    .addNode("pairItems", pairItems)
    .addEdge(START, "collectPreferences")
    .addEdge("collectPreferences", "fetchMenus")
    .addEdge("fetchMenus", "pairItems")
    .addEdge("pairItems", END)
    .compile();
}
