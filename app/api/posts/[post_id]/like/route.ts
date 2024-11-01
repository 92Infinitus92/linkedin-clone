import { connectDB } from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  await connectDB();

  try {
    const post = await Post.findById(params.post_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const likes = await post.likes;

    return NextResponse.json({ likes }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error getting post" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  auth.protect();
  await connectDB();
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const post = await Post.findById(params.post_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await post.likePost(user.id);
  } catch (error) {
    return NextResponse.json({ error: "Error liking post" }, { status: 500 });
  }
}
