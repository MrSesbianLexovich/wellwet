import { App } from "@/server/api/";
import { treaty } from "@elysiajs/eden";

export const { api } = treaty<App>("localhost:3000", {
  fetch: { credentials: "include" },
});
