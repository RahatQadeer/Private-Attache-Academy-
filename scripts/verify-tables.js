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

async function main() {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${REF}/database/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query:
          "select table_name from information_schema.tables where table_schema = 'public' and table_type = 'BASE TABLE' order by table_name",
      }),
    },
  );
  const body = await res.json();
  const names = Array.isArray(body) ? body.map((row) => row.table_name) : body;
  console.log(Array.isArray(names) ? `${names.length} tables\n${names.join("\n")}` : names);
}

main();
