import { Post } from "@prisma/client";
import { db } from "~/lib/db";

export function createPost(post: {
  name: string;
  fileKey: string;
  userId: string;
  imageKey?: string;
}) {
  return db.post.create({
    data: {
      name: post.name,
      fileKey: post.fileKey,
      imageKey: post.imageKey,
      User: {
        connect: {
          id: post.userId,
        },
      },
    },
  });
}

export function getAllPosts() {
  return db.post.findMany();
}

export function getRecentlyAddedMusic() {
  return db.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });
}

export function getFavorite(userId: string, postId: string) {
  return db.favorite.findUnique({
    where: {
      userId_postId: {
        userId,
        postId,
      },
    },
  });
}
