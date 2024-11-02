"use server";

import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function createCommentAction(
  postId: string,
  formData: FormData
) {
  const user = await currentUser();
  const commentInput = formData.get("commentInput") as string;

  if (!postId) throw new Error("Post ID not found");
  if (!user) throw new Error("User not found");
  if (!commentInput) throw new Error("Comment input not found");

  const userDB: IUser = {
    userId: user.id,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    userImage: user.imageUrl,
  };

  const body = {
    user: userDB,
    text: commentInput,
  };

  const post = await Post.findById(postId);
  if (!post) throw new Error("Post not found");

  try {
    await post.commentOnPost(body);
  } catch (error) {
    throw new Error("Error commenting on post");
  }
  revalidatePath("/");
}
