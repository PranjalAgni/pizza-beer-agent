import { tool } from "@langchain/core/tools";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readJsonFile<T>(relativePath: string) {
  const fullPath = path.join(__dirname, relativePath);
  const raw = await fs.readFile(fullPath, "utf-8");
  return JSON.parse(raw) as T;
}

export const getPizzasTool = tool(
  async ({ vegetarianOnly, maxPrice }) => {
    const pizzas = await readJsonFile<any[]>("./menu/pizzas.json");
    console.log(JSON.stringify(pizzas, null, 2));
    return pizzas.filter((pizza) => {
      if (vegetarianOnly && !pizza.veg) return false;
      if (typeof maxPrice === "number" && pizza.price > maxPrice) return false;
      return true;
    });
  },
  {
    name: "get_pizzas",
    description:
      "Get available pizzas filtered by dietary preference and price",
    schema: z.object({
      vegetarianOnly: z.boolean().optional(),
      maxPrice: z.number().optional(),
    }),
  },
);

export const getBeersTool = tool(
  async ({ maxPrice }) => {
    const beers = await readJsonFile<any[]>("./menu/beers.json");

    return beers.filter((beer) => {
      if (typeof maxPrice === "number" && beer.price > maxPrice) return false;
      return true;
    });
  },
  {
    name: "get_beers",
    description: "Get available beers filtered by price",
    schema: z.object({
      maxPrice: z.number().optional(),
    }),
  },
);
