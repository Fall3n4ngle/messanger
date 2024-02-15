import PusherClient from "pusher-js";
import { env } from "@/lib/env.mjs";

export const pusherClient = new PusherClient(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
  authEndpoint: "/api/pusher/auth",
  authTransport: "ajax",
  auth: {
    headers: {
      "Content-Type": "application/json",
    },
  },
});
