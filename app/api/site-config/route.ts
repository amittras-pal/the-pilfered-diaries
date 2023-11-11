import { NextRequest, NextResponse } from "next/server";
import firestore from "../../firebase/admin";

export async function GET(request: NextRequest) {
  const response = await await firestore.doc("siteContent/site-config").get();
  const data = response.data();

  return NextResponse.json(data, { status: 200 });
}
