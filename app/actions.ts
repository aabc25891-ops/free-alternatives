"use server";
import { cookies, headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createHash } from "crypto";
import { sql } from "@/lib/db";

// Max NEW votes one internet connection can make per hour
const MAX_NEW_VOTES_PER_HOUR = 30;

export async function castVote(formData: FormData) {
  const alternativeId = Number(formData.get("alternativeId"));
  const vote = formData.get("vote");
  const slug = String(formData.get("slug"));
  if (!alternativeId || (vote !== "free" && vote !== "paywall")) return;

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const ipHash = createHash("sha256")
    .update(ip + (process.env.VOTE_SALT ?? ""))
    .digest("hex");

  const recent = await sql`
    SELECT COUNT(*)::int AS n FROM votes
    WHERE ip_hash = ${ipHash} AND created_at > now() - interval '1 hour'`;
  if (recent[0].n >= MAX_NEW_VOTES_PER_HOUR) return;

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
    INSERT INTO votes (alternative_id, voter_id, vote, ip_hash)
    VALUES (${alternativeId}, ${voterId}, ${vote}, ${ipHash})
    ON CONFLICT (alternative_id, voter_id) DO UPDATE SET vote = EXCLUDED.vote`;

  revalidatePath(`/alternatives/${slug}`);
}