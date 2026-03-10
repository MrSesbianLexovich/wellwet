import Elysia from "elysia";
import { DEFAULT_TTL, InvalidateCached, ServeCached } from "../lib/redis";
import { db } from "../lib/db";
import { eq } from "drizzle-orm";
import { productsAccordion } from "../lib/db/schema/schema";
import { accordionSchema } from "../lib/schemas";

export const accordionRouter = new Elysia({
  prefix: "/accordion",
})

  .get("/", async () => {
    return await ServeCached(["accordion"], DEFAULT_TTL, async () => {
      return await db.query.productsAccordion.findMany();
    });
  })
  .get("/:id", async ({ params }) => {
    return await ServeCached(
      ["accordion", params.id],
      DEFAULT_TTL,
      async () => {
        return await db.query.productsAccordion.findMany({
          where: eq(productsAccordion.productId, params.id),
        });
      },
    );
  })
  .post(
    "/:id",
    async ({ params, body }) => {
      await db.insert(productsAccordion).values({
        ...body,
        productId: params.id,
        title: body.title,
        content: body.content,
      });
      await InvalidateCached(["accordion", params.id]);
    },
    { body: accordionSchema },
  )
  .put(
    "/:id",
    async ({ params, body }) => {
      await db
        .update(productsAccordion)
        .set(body)
        .where(eq(productsAccordion.id, params.id));
      await InvalidateCached(["accordion", params.id]);
    },
    { body: accordionSchema.partial() },
  );
