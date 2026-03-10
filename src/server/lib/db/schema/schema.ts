import * as pg from "drizzle-orm/pg-core";

export * from "./auth-schema";

export const products = pg.pgTable("products", {
  id: pg
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),
  name: pg.varchar({ length: 255 }).notNull(),
  shortDescription: pg.text().notNull(),
  description: pg.text().notNull(),
  type: pg.text().notNull(),
  image: pg.text().notNull(),
});

export const productsAccordion = pg.pgTable("productsAccordion", {
  id: pg
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),
  productId: pg.varchar({ length: 255 }).notNull(),
  title: pg.text(),
  content: pg.text(),
});

export const questions = pg.pgTable("questions", {
  id: pg
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),
  name: pg.text().notNull(),
  phoneOrEmail: pg.text(),

  type: pg.text(),
  question: pg.text().notNull(),
});

export const categories = pg.pgTable("categories", {
  id: pg
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => Bun.randomUUIDv7()),

  category: pg.text().notNull(),
});
