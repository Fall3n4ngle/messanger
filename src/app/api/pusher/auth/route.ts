import { pusherServer } from "@/lib/pusher/server";
import { getUserAuth } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { session } = await getUserAuth();

  if (!session) {
    return NextResponse.json(
      { message: "Failed to authorize pusher client" },
      {
        status: 401,
      }
    );
  }

  const { socket_id, channel_name } = await request.json();

  const data = {
    user_id: session.user.id,
  };

  const authResponse = pusherServer.authorizeChannel(
    socket_id,
    channel_name,
    data
  );

  return NextResponse.json(authResponse);
}
