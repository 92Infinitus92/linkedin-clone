import { connectDB } from "@/mongodb/db";
import { Post } from "@/mongodb/models/post";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { post_id: string } } // Change here
) {
  await connectDB();
  const { post_id } = await context.params; // Destructure with `await`

  try {
    const post = await Post.findById(post_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const likes = post.likes;

    return NextResponse.json({ likes }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error getting post" }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: { post_id: string } } // Change here
) {
  auth.protect();
  await connectDB();
  const { post_id } = await context.params; // Destructure with `await`
  const user = await currentUser();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const post = await Post.findById(post_id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await post.likePost(user.id);

    return NextResponse.json(
      { message: "Post liked successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Error liking post" }, { status: 500 });
  }
}
