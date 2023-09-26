import { ActionFunctionArgs, json } from "@remix-run/node";
import { db } from "~/lib/db";
import { getFavorite } from "~/models/music.server";
import { getUserId } from "~/session.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const userId = await getUserId(request);

  const postId = params.postId;

  if (!userId) {
    return json({ status: 404 });
  }

  if (!postId) {
    return json({ status: 400, message: "No post id provided" });
  }

  const favourite = await getFavorite(userId, postId);
};
