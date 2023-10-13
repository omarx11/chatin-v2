import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { cookies } from "next/headers";

export async function GET(req, res) {
  // connect to database
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    {
      db: { schema: "public" },
    },
  );

  try {
    // get data from "chatin" table.
    const { data, error } = await supabase
      .from("chatin")
      .select()
      .order("created_at", { ascending: true });

    // display the data
    return new Response(JSON.stringify(data));
  } catch (error) {
    console.log("error", error);
    return new Response("error");
  }
}

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

  const cookieStore = cookies();
  const tenYears = 10 * 365 * 24 * 60 * 60;

  // give the user uuid if he doesn't have one.
  if (!cookieStore.get("uuid"))
    cookieStore.set("uuid", uuidv4(), {
      maxAge: tenYears,
      priority: "high",
    });

  // if the user have uuid..
  if (cookieStore.get("uuid")) {
    const uuidCookie = cookieStore.get("uuid").value || "";

    const bodyInsert = {
      user_uuid: uuidCookie,
      chat: data.messages,
    };

    const bodyUpdate = {
      chat: data.messages,
      updated_at: new Date(),
    };

    try {
      // check if the user uuid exist
      const { data, error } = await supabase
        .from("chatin")
        .select()
        .eq("user_uuid", uuidCookie)
        .single();

      // the user is exist, update his column
      if (data) {
        const { error } = await supabase
          .from("chatin")
          .update(bodyUpdate)
          .eq("user_uuid", uuidCookie);
      } else {
        // the user not exist, insert new column
        const { error } = await supabase.from("chatin").insert(bodyInsert);
      }

      return new Response("data filled successfully");
    } catch (error) {
      console.log("error", error);
      return new Response("error inserting data");
    }
  }
}
