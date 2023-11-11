import { NextRequest, NextResponse } from "next/server";
import { getStories } from "../../services/firebase";
import { StoryRecord } from "../../types/entities";

// Gets a list of stories excluding "chapters" & "content" if more than 1 is requested.
// Gets a complete story object if only 1 is requested.
export async function GET(request: NextRequest) {
  const params = new URLSearchParams(request.nextUrl.searchParams);
  const limit = parseInt(params.get("limit") ?? "1");

  const response = await getStories(limit);
  const data = response.docs.map((doc) => {
    const story = doc.data() as StoryRecord;

    const obj = {
      ...story,
      slug: doc.id,
      chapterCount: story.chapters?.length,
      published: story.published.toDate().toISOString(),
      lastUpdated: story.lastUpdated.toDate().toISOString(),
    };

    if (limit > 1) {
      delete obj.chapters;
      delete obj.content;
    }

    return obj;
  });

  return NextResponse.json(data.length === 1 ? data.at(0) : data, {
    status: 200,
  });
}
