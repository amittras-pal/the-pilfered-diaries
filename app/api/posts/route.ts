import { NextRequest, NextResponse } from "next/server";
import { getPosts } from "../../services/firebase";

// TODO: declare types.
export async function GET(request: NextRequest) {
  const params = new URLSearchParams(request.nextUrl.searchParams);
  const limit = parseInt(params.get("limit") ?? "");
  const type = params.get("type") ?? "all";

  // TODO: utilize this
  const keepContent = params.get("keepContent");

  const response = await getPosts(limit, type);
  const data = response.docs.map((doc) => {
    const post = doc.data();

    return post;
  });

  return NextResponse.json(data, { status: 200 });
}
