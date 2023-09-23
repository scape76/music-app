import { db } from "~/lib/db";

interface Post {
  //   imageUrl: string;
  description: string;
}

export function createPost(post: Post) {
  return db.post.create({
    data: {
      description: post.description,
    },
  });
}

export function getAllPosts() {
  return db.post.findMany();
}
