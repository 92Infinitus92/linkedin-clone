"use client";
import { IPostDocument } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MessageCircle, Repeat2, Send, ThumbsUpIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function PostOptions({ post }: { post: IPostDocument }) {
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const { user } = useUser();
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(
    Array.isArray(post.likes) ? post.likes : []
  );
  useEffect(() => {
    if (user?.id && post.likes?.includes(user.id)) setLiked(true);
  }, [post, user]);

  const likeOrUnlikePost = async () => {
    if (!user?.id) {
      throw new Error("User not found");
    }

    const originalLiked = liked;
    const originalLikes = likes;
    const newLikes = liked
      ? Array.isArray(likes)
        ? likes.filter((like) => like !== user.id)
        : []
      : [...(Array.isArray(likes) ? likes : []), user.id];

    const body = {
      userId: user.id,
    };

    setLikes(newLikes);
    setLiked(!liked);

    const response = await fetch(
      `/api/posts/${post._id}/${liked ? "unlike" : "like"}`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      setLikes(originalLikes);
      setLiked(originalLiked);
      throw new Error("Error liking post 2");
    }

    const fetchLikes = await fetch(`/api/posts/${post._id}/like`);

    if (!fetchLikes.ok) {
      setLikes(originalLikes);
      setLiked(originalLiked);
      throw new Error("Error fetching likes");
    }

    const newLikesData = await fetchLikes.json();
    setLikes(Array.isArray(newLikesData.likes) ? newLikesData.likes : []);
  };
  return (
    <div>
      <div className="flex justify-between p-4">
        <div>
          {likes && likes.length > 0 && (
            <p className="text-xs text-gray-500 cursor-pointer hover:underline">
              {likes.length} likes
            </p>
          )}
        </div>
        <div>
          {post.comments && post.comments.length > 0 && (
            <p
              onClick={() => setIsCommentOpen(!isCommentOpen)}
              className="text-xs text-gray-500 cursor-pointer hover:underline"
            >
              {post.comments.length} comments
            </p>
          )}
        </div>
      </div>
      <div className="flex p-2 justify-between px-2 border-1">
        <Button
          variant={"ghost"}
          className="postButton"
          onClick={likeOrUnlikePost}
        >
          <ThumbsUpIcon
            className={cn("mr-1", liked && "text-blue-500 fill-blue-500")}
          />
          Like
        </Button>
        <Button
          variant={"ghost"}
          className="postButton"
          onClick={() => setIsCommentOpen(!isCommentOpen)}
        >
          <MessageCircle
            className={cn(
              "mr-1",
              isCommentOpen && "text-gray-500 fill-gray-500"
            )}
          />
          Comment
        </Button>
        <Button variant={"ghost"} className="postButton">
          <Repeat2 className="mr-1" />
          Repost
        </Button>

        <Button variant={"ghost"} className="postButton">
          <Send className="mr-1" />
          Send
        </Button>
      </div>
      {isCommentOpen && (
        <div className="flex flex-col space-y-2 p-4">
          {post.comments?.map((comment) => (
            <div key={comment._id.toString()} className="flex space-x-2">
              <div className="flex-1">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold">
                    {comment.user.firstName}
                  </span>{" "}
                  {comment.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default PostOptions;
