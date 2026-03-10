import Elysia from "elysia";
import { s3 } from "../lib/s3";

export const fileRouter = new Elysia({
  name: "fileservice",
  prefix: "/file",
}).get("/:id", async ({ params, status, set }) => {
  const meta = s3.file(params.id);
  if (!(await meta.exists())) {
    return status(404, "Файл не найден");
  }

  set.headers["content-type"] = (await meta.stat()).type;
  set.headers["content-disposition"] =
    `attachment; filename="${encodeURIComponent(params.id)}"`;

  return new Response(meta.stream());
});
