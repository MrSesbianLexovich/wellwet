import Elysia, { type Context, status } from "elysia";
import { auth } from "../lib/auth";
import { questionsRouter } from "./consultationService";
import { productsRouter } from "./productService";
import { adminRouter, userRouter } from "./userService";
import { fileRouter } from "./fileService";
import { accordionRouter } from "./accordionService";
import { categoryRouter } from "./categoryService";
import { openapi } from "@elysiajs/openapi";
import { z } from "zod";
import { cors } from "@elysiajs/cors";

const betterAuthView = (context: Context) => {
  const BETTER_AUTH_ACCEPT_METHODS = ["POST", "GET"];

  if (BETTER_AUTH_ACCEPT_METHODS.includes(context.request.method)) {
    return auth.handler(context.request);
  } else {
    return status(405);
  }
};

export const app = new Elysia({
  prefix: "/api",
})
  .use(openapi({
    mapJsonSchema: {
        zod: z.toJSONSchema,
      },
  }))
  .all("/auth/*", betterAuthView)
  .use(questionsRouter)
  .use(productsRouter)
  .use(userRouter)
  .use(fileRouter)
  .use(accordionRouter)
  .use(categoryRouter)
  .use(adminRouter)

export type App = typeof app;
