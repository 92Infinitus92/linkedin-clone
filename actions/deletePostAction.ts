"use server";

import { Post } from "@/mongodb/models/post";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function deletePostAction({ postId }: { postId: string }) {
  const user = await currentUser();

  if (!user) {
    throw new Error("User not found");
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  if (user.id !== post?.user.userId) {
    throw new Error("Unauthorized");
  }

  try {
    await post.removePost();
  } catch (error) {
    throw new Error("Error deleting post");
  }

  revalidatePath("/");
}
