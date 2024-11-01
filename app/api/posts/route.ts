import { connectDB } from "@/mongodb/db";
import { IPostBase, Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export interface AddPostRequest {
  user: IUser;
  text: string;
  imageUrl?: string | null;
}
export async function POST(request: Request) {
  auth.protect();

  try {
    const { user, text, imageUrl }: AddPostRequest = await request.json();

    const postData: IPostBase = {
      user,
      text,
      ...(imageUrl && { imageUrl }),
    };

    await connectDB();
    await Post.create(postData);
  } catch (error) {
    return NextResponse.json({ error: "Error creating post" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const posts = await Post.getAllPosts();

    return NextResponse.json({ posts }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error connecting to MongoDB" },
      { status: 500 }
    );
  }
}
