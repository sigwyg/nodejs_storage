import { useSignal } from "@preact/signals";
import { Handlers, PageProps } from "$fresh/server.ts";

const NAMES = ["Alice", "Bob", "Charlie", "Dave", "Eve", "Frank"];

type ToDo = {
  id: string;
  title: string;
  completed: boolean;
};

export const handler: Handlers<ToDo[] | null> = {
  async GET(req, _ctx) {
    console.log(req);
    const todos = (await req.json()) as ToDo[];
    return new Response(JSON.stringify(todos));
  },
};

export default function Home({ data }: PageProps<Data>) {
  const { results, query } = data;
  const count = useSignal(3);
  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <h1>Todo Data Storage</h1>
      <form>
        <input
          type="text"
          name="title"
          placeholder="What needs to be done?"
          value={query}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}
