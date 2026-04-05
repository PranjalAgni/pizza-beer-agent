import { z } from "zod";
import { StateSchema } from "@langchain/langgraph";

export const pizzaSchema = z.object({
  name: z.string(),
  price: z.number(),
  veg: z.boolean(),
  spicy: z.boolean(),
  tags: z.array(z.string()),
});

export const beerSchema = z.object({
  name: z.string(),
  price: z.number(),
  style: z.string(),
  tags: z.array(z.string()),
});

export const pairingStateZod = z.object({
  mood: z.string().optional(),
  budget: z.number().optional(),
  vegetarianOnly: z.boolean().optional(),
  spicyPreference: z.boolean().optional(),

  pizzas: z.array(pizzaSchema).optional(),
  beers: z.array(beerSchema).optional(),

  chosenPizza: pizzaSchema.optional(),
  chosenBeer: beerSchema.optional(),
  pairingReason: z.string().optional(),

  needsMoreInfo: z.boolean().optional(),
});

export type Pizza = z.infer<typeof pizzaSchema>;
export type Beer = z.infer<typeof beerSchema>;
export type PairingState = z.infer<typeof pairingStateZod>;

export const PairingStateSchema = new StateSchema(pairingStateZod.shape);
