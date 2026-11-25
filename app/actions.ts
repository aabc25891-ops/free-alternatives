"use server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";

export async function castVote(formData: FormData) {
  const alternativeId = Number(formData.get("alternativeId"));
  const vote = formData.get("vote");
  const slug = String(formData.get("slug"));
  if (!alternativeId || (vote !== "free" && vote !== "paywall")) return;

  const jar = await cookies();
  let voterId = jar.get("voter_id")?.value;
  if (!voterId) {
    voterId = crypto.randomUUID();
    jar.set("voter_id", voterId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  await sql`
    INSERT INTO votes (alternative_id, voter_id, vote)
    VALUES (${alternativeId}, ${voterId}, ${vote})
    ON CONFLICT (alternative_id, voter_id) DO UPDATE SET vote = EXCLUDED.vote`;

  revalidatePath(`/alternatives/${slug}`);
}