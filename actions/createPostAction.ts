"use server";

import { AddPostRequest } from "@/app/api/posts/route";
import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface CreatePostParams {
  text: string;
  image?: Uint8Array | null; // Accept binary data
}

export default async function createPostAction({
  text,
  image,
}: CreatePostParams) {
  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }

  const userDB: IUser = {
    userId: user.id,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    userImage: user.imageUrl,
  };

  try {
    const postData = {
      user: userDB,
      text,
      imageUrl: image ? Buffer.from(image) : undefined, // Store as Buffer
    };

    await Post.create(postData);
  } catch (error) {
    throw new Error("Error creating post");
  }

  revalidatePath("/");
}
