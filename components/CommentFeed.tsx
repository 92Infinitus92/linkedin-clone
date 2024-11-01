"use client";

import { IComment } from "@/mongodb/models/comment";
import { IPostDocument } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";

function CommentFeed({ post }: { post: IPostDocument }) {
  const { user } = useUser();
  const isAuthor = user?.id === post.user.userId;
  return (
    <>
      {post.comments?.map((comment: IComment) => (
        <div key={comment._id.toString()} className="flex space-x-2">
          <div className="flex-1">
            <p className="text-sm text-gray-500">
              <span className="font-semibold">{comment.user.firstName}</span>{" "}
              {comment.text}
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
export default CommentFeed;
