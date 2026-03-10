import Elysia from "elysia";
import { db } from "../lib/db";
import { questions } from "../lib/db/schema/schema";
import { questionSchema } from "../lib/schemas";
import { DEFAULT_TTL, InvalidateCached, ServeCached } from "../lib/redis";

export const questionsRouter = new Elysia({
  prefix: "/questions",
})
  .get("/", async () => {
    return await ServeCached(["questions"], DEFAULT_TTL, async () => {
      return await db.query.questions.findMany();
    });
  })
  .post(
    "/",
    async ({ body }) => {
      await db.insert(questions).values(body);
      await InvalidateCached(["questions"]);
    },
    { body: questionSchema },
  );
