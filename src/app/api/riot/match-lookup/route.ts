import { NextResponse } from "next/server";
import {
  getAccountByRiotId,
  getActiveGameBySummonerId,
} from "../../../../lib/riot-api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const tag = searchParams.get("tag");
  const region = searchParams.get("region") || "na1";

  if (!username || !tag)
    return NextResponse.json(
      { error: "Missing username or tag" },
      { status: 400 }
    );

  const account = await getAccountByRiotId(username, tag);
  if (!account)
    return NextResponse.json({ error: "Account not found" }, { status: 404 });

  const activeGame = await getActiveGameBySummonerId(account.puuid, region);
  return NextResponse.json(activeGame);
}
