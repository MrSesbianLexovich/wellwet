import Elysia from "elysia";
import { auth } from "../lib/auth";
import { DEFAULT_TTL, ServeCached } from "../lib/redis";
import { db } from "../lib/db";

export const userRouter = new Elysia({
  prefix: "/users",
})
  .mount(auth.handler)
  .derive(
    {
      as: "global",
    },
    async ({ request: { headers } }) => {
      const session = await auth.api.getSession({ headers });
      return { session };
    },
  )
  .macro({
    auth: {
      async resolve({ status, session }) {
        if (!session) return status(401);

        return {
          session,
        };
      },
    },
  })
  .get("/me", async ({ session }) => {
    return session;
  })
  .get("/", async () => {
    return await db.query.user.findMany();
  });
