// deno-lint-ignore-file no-explicit-any
import { Database } from "@db/sqlite";
import * as oak from "@oak/oak";
import * as path from "@std/path";
import { Port } from "../lib/utils/index.ts";
import listInsights from "./operations/list-insights.ts";
import lookupInsight from "./operations/lookup-insight.ts";
import createInsight from "./operations/create-insight.ts";
import deleteInsight from "./operations/delete-insight.ts";
import { createTable } from "$tables/insights.ts";

//console.log("Loading configuration");

const env = {
  port: Port.parse(Deno.env.get("SERVER_PORT")),
};

const dbFilePath = path.resolve("tmp", "db.sqlite3");

//console.log(`Opening SQLite database at ${dbFilePath}`);

await Deno.mkdir(path.dirname(dbFilePath), { recursive: true });
const db = new Database(dbFilePath);
db.run(createTable);

//console.log("Initialising server");

const router = new oak.Router();

router.get("/_health", (ctx) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});

router.get("/insights", (ctx) => {
  const result = listInsights({ db });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.get("/insights/:id", (ctx) => {
  const params = ctx.params as Record<string, any>;
  const result = lookupInsight({ db, id: params.id });
  ctx.response.body = result;
  ctx.response.status = 200;
});

router.post("/insights", async (ctx) => {
  try {
    const insight = await ctx.request.body.json();
    console.log("Creating insight", insight);

    createInsight({ db, insight });

    ctx.response.status = 200;
    ctx.response.body = { message: "Insight created" };
  } catch (error) {
    console.error("create insights", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal Server Error" };
  }
});

router.delete("/insights/:id", (ctx) => {
  try {
    const insightId = Number(ctx.params.id);
    if (isNaN(insightId)) {
      ctx.response.status = 400;
      ctx.response.body = { error: "Invalid insight ID" };
      return;
    }
    deleteInsight({ db, id: insightId });
    ctx.response.status = 200;
    ctx.response.body = { message: "Insight deleted" };
  } catch (error) {
    console.error("delete insights", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal Server Error" };
    return;
  }
});

const app = new oak.Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(env);
console.log(`Started server on port ${env.port}`);
