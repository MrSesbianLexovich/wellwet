import Elysia from "elysia";
import { DEFAULT_TTL, InvalidateCached, ServeCached } from "../lib/redis";
import { db } from "../lib/db";
import { categories } from "../lib/db/schema/schema";
import { categorySchema } from "../lib/schemas";
import { eq } from "drizzle-orm";

export const categoryRouter = new Elysia({
  prefix: "/categories",
})
  .get("/", async () => {
    return ServeCached(["categories"], DEFAULT_TTL, async () => {
      return await db.query.categories.findMany();
    });
  })
  .post(
    "/",
    async ({ body }) => {
      await db.insert(categories).values(body);
    },
    { body: categorySchema },
  )
  .put(
    "/:id",
    async ({ params, body }) => {
      await db.update(categories).set(body).where(eq(categories.id, params.id));
    },
    { body: categorySchema },
  )
  .delete("/:id", async ({ params }) => {
    await db.delete(categories).where(eq(categories.id, params.id));
  });
