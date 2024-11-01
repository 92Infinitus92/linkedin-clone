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
    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error getting post" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { post_id: string } }
) {
  auth.protect();
  await connectDB();

  const user = await currentUser();

  try {
    const post = await Post.findById(params.post_id);
    if (post?.user.userId !== user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ post }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error deleting post" }, { status: 500 });
  }
}
