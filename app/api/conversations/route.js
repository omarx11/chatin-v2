import { createClient } from "@supabase/supabase-js";

export async function POST(req, res) {
  const { data } = await req.json();

  // connect to database
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    {
      db: { schema: "public" },
    },
  );

  try {
    if (data.sort === "creation") {
      const { data } = await supabase
        .from("chatin")
        .select()
        .order("created_at", { ascending: false });

      return new Response(JSON.stringify(data));
    } else if (data.sort === "updated") {
      const { data } = await supabase
        .from("chatin")
        .select()
        .order("updated_at", { ascending: false })
        .not("updated_at", "is", null);

      return new Response(JSON.stringify(data));
    } else if (data.sort === "oldest") {
      const { data } = await supabase
        .from("chatin")
        .select()
        .order("created_at", { ascending: true });

      return new Response(JSON.stringify(data));
    } else {
      // get data from "chatin" table.
      const { data, error } = await supabase
        .from("chatin")
        .select()
        // .limit(10)
        .order("created_at", { ascending: false });

      // display the data
      return new Response(JSON.stringify(data));
    }
  } catch (error) {
    console.log("error", error);
    return new Response("error");
  }
}
