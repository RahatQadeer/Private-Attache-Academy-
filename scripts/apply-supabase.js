const fs = require("fs");
const path = require("path");

const envPath = path.join(process.cwd(), ".env.local");
for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eq = trimmed.indexOf("=");
  if (eq === -1) continue;
  process.env[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
}

const REF = "drseokexudvqelnseihy";
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN;
const API = `https://api.supabase.com/v1/projects/${REF}`;
const SITE = "https://private-attache-dun.vercel.app";

async function api(method, pathname, body) {
  const res = await fetch(`${API}${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let parsed = text;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = text.slice(0, 4000);
  }
  return { ok: res.ok, status: res.status, body: parsed };
}

async function runSql(query) {
  return api("POST", "/database/query", { query });
}

function summarize(result) {
  const body = result.body;
  if (typeof body === "string") return body.slice(0, 800);
  return JSON.stringify(body).slice(0, 800);
}

async function main() {
  const ping = await runSql("select 1 as ok");
  if (!ping.ok) {
    console.error("Cannot query database:", summarize(ping));
    process.exit(1);
  }

  const authPatch = await api("PATCH", "/config/auth", {
    site_url: SITE,
    uri_allow_list: [
      SITE,
      `${SITE}/**`,
      `${SITE}/auth/callback`,
      `${SITE}/reset-password`,
      `${SITE}/login`,
      `${SITE}/signup`,
      `${SITE}/invite/**`,
    ].join(","),
  });
  console.log("auth patch", authPatch.status, summarize(authPatch));

  const dir = path.join(process.cwd(), "supabase", "migrations");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

  for (const file of files) {
    const sql = fs.readFileSync(path.join(dir, file), "utf8");
    const result = await runSql(sql);
    console.log(`\n${file} -> ${result.status}`);
    if (!result.ok) {
      console.log(summarize(result));
      process.exitCode = 1;
      return;
    }
    console.log("ok");
  }

  const tables = await runSql(`
    select table_name
    from information_schema.tables
    where table_schema = 'public' and table_type = 'BASE TABLE'
    order by table_name
  `);
  const names = Array.isArray(tables.body) ? tables.body.map((row) => row.table_name) : [];
  console.log("\ntable count", names.length);
  console.log(names.join("\n"));
}

main();
