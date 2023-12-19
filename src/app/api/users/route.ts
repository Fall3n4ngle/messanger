import { getUsers } from "@/lib/actions/user/queries";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") ?? "";

    const { userId } = auth();
    if (!userId) redirect("/sign-in");

    const data = await getUsers({ query, currentUserClerkId: userId });

    return NextResponse.json(data);
  } catch (error) {
    const message = (error as Error).message ?? "Error getting users";
    return NextResponse.json({ error: { message } }, { status: 500 });
  }
}
