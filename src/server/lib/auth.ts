import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "./db";
import * as schema from "./db/schema/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",

    schema: schema,
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
        required: true,
        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
});
