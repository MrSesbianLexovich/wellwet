import Elysia from "elysia";
import { auth } from "../lib/auth";
import { db } from "../lib/db";
import { eq } from "drizzle-orm";
import { user } from "../lib/db/schema/auth-schema";
import { role } from "better-auth/plugins";

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

export const adminRouter = new Elysia({
  prefix: "/adminCreate",
}).get("/", async () => {
  const adminEmail = String(process.env.MAIN_ADMIN_EMAIL).toLocaleLowerCase();
  const existingAdmin = await db.query.user.findFirst({
    where: eq(user.email, adminEmail),
  });

  if (existingAdmin) {
    console.log("Main admin exists, skipping creation");
    return "NOT_FOUND";
  }

  await auth.api.signUpEmail({
    body: {
      name: "Admin",
      email: String(process.env.MAIN_ADMIN_EMAIL),
      password: String(process.env.MAIN_ADMIN_PASSWORD),
    },
  });

  await db
    .update(user)
    .set({ role: "Admin" })
    .where(eq(user.email, adminEmail));

  console.log("Main admin created");
});
