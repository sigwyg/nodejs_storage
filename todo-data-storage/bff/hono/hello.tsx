/** @jsx jsx */
import { Hono } from "https://deno.land/x/hono@v3.12.8/mod.ts";
import { hc } from "https://deno.land/x/hono@v3.12.11/client/index.ts";
import { jsx } from "https://deno.land/x/hono/middleware.ts";

const app = new Hono();

/**
 * @param {object} data
  {
    id: "4af297bb-8a98-462e-b6ac-1e5f95cf59c1",
    title: "hoge",
    completed: false
  },
 */
const ListItem = ({ id, title, completed }) => {
  return (
    <li>
      <input type="checkbox" checked={completed ? "checked" : ''} />
      <span>{title}</span>
    </li>
  );
}

app.get("/", async (c) => {
  const res = await fetch("http://localhost:3002/api/todos");
  const data = await res.json();

  let item = '';
  for (const d of data) {
    item += <ListItem {...d} />;
  }

  return c.html(item);
});

Deno.serve(app.fetch);
