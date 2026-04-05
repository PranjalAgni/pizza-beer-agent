console.log("🍕🍕🍕🍕🍕🍕 agenttttt");
import "dotenv/config";
import { buildGraph } from "./graph";

async function main() {
  const graph = buildGraph();
  const result = await graph.invoke({
    mood: "date night",
    budget: 700,
    vegetarianOnly: false,
    spicyPreference: true,
  });

  console.log("\n=== Recommendation ===");
  console.log("Pizza:", result.chosenPizza);
  console.log("Beer:", result.chosenBeer);
  console.log("Why:", result.pairingReason);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
