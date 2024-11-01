"use client";

import { IPostDocument } from "@/mongodb/models/post";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import ReactTimeago from "react-timeago";

function Post({ post }: { post: IPostDocument }) {
  const { user } = useUser();

  const isAuthor = user?.id === post.user.userId;
  return (
    <div className="bg-white rounded-md border">
      <div className="p-4 space-x-2 flex">
        <div>
          <Avatar>
            <AvatarImage src={post.user.userImage} />
            <AvatarFallback>
              {post.user.firstName.charAt(0)}
              {post.user.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex flex-1 justify-between">
          <div>
            <div className="font-semibold">
              {post.user.firstName} {post.user.lastName}{" "}
              {isAuthor && (
                <Badge className="ml-2" variant={"secondary"}>
                  Author
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-400">
              @{post.user.firstName}
              {post.user.firstName}-{post.user.userId.toString().slice(-4)}
            </p>
            <p className="text-xs text-gray-400">
              <ReactTimeago date={post.createdAt} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Post;
