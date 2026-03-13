import Elysia from "elysia";
import { DEFAULT_TTL, InvalidateCached, ServeCached } from "../lib/redis";
import { db } from "../lib/db";
import { products, productsAccordion } from "../lib/db/schema/schema";
import { productSchema } from "../lib/schemas";
import { eq } from "drizzle-orm";
import { s3 } from "../lib/s3";

export const productsRouter = new Elysia({
  prefix: "/products",
})
  .get("/", async () => {
    return await ServeCached(["products"], DEFAULT_TTL, async () => {
      return await db.query.products.findMany();
    });
  })
  .get("/:id", async ({ params }) => {
    return await ServeCached(["products", params.id], DEFAULT_TTL, async () => {
      return await db.query.products.findFirst({
        where: eq(products.id, params.id),
      });
    });
  })
  .post(
    "/",
    async ({ body }) => {
      const extention = body.image.name.split(".").at(-1);
      const fileId = `${Bun.randomUUIDv7()}.${extention}`;

      await s3.file(fileId).write(await body.image.arrayBuffer(), {
        type: body.image.type,
      });

      await db.insert(products).values({
        ...body,
        image: fileId,
        name: body.name,
        shortDescription: body.shortDescription,
        description: body.description,
        type: body.type,
      });
      await InvalidateCached(["products"]);
    },
    { body: productSchema },
  )
  .patch(
    "/:id",
    async ({ params, body }) => {
      // if (body.image) {
      const extention = body.image?.name.split(".").at(-1);
      const fileId = `${Bun.randomUUIDv7()}.${extention}`;

      await s3.file(fileId).write(await body.image.arrayBuffer(), {
        type: body.image?.type,
      });

      await db
        .update(products)
        .set({
          ...body,
          image: fileId,
          name: body.name,
          shortDescription: body.shortDescription,
          description: body.description,
          type: body.type,
        })
        .where(eq(products.id, params.id));
      // } else {
      //   await db
      //     .update(products)
      //     .set({
      //       name: body.name,
      //       shortDescription: body.shortDescription,
      //       description: body.description,
      //       type: body.type,
      //     })
      //     .where(eq(products.id, params.id));
      // }
      await InvalidateCached(["products"]);
    },
    { body: productSchema.partial() },
  )
  .delete("/:id", async ({ params }) => {
    await db.delete(products).where(eq(products.id, params.id));
    await db
      .delete(productsAccordion)
      .where(eq(productsAccordion.productId, params.id));
    InvalidateCached(["products"]);
  });
