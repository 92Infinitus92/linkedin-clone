"use client";

import { useUser } from "@clerk/nextjs";
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import createCommentAction from "@/actions/createCommentAction";

function CommentForm({ postId }: { postId: string }) {
  const { user } = useUser();
  const ref = useRef<HTMLFormElement>(null);
  const createCommentActionWthPostId = createCommentAction.bind(null, postId);

  const handleCommentAction = async (formData: FormData): Promise<void> => {
    const formDataCopy = formData;
    ref.current?.reset();

    try {
      await createCommentActionWthPostId(formDataCopy);
    } catch (error) {
      console.error("Error in handleCommentAction:", error);
    }
  };

  return (
    <form
      ref={ref}
      action={(formData) => {
        const promise = handleCommentAction(formData);
      }}
      className="flex items-center space-x-2"
    >
      <Avatar>
        <AvatarImage src={user?.imageUrl} />
        <AvatarFallback>
          {user?.firstName?.charAt(0)}
          {user?.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 bg-white border rounded-full px-3 py-2">
        <input
          type="text"
          name="commentInput"
          className="flex-1 outline-none text-sm bg-transparent"
          placeholder="Add a comment"
        />
        <button type="submit" className="hidden">
          Comment
        </button>
      </div>
    </form>
  );
}
export default CommentForm;
