"use client";

import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ImageIcon } from "lucide-react";
import { useRef, useState } from "react";

function PostForm() {
  const ref = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { user } = useUser();

  return (
    <div className="">
      <form action="" ref={ref}>
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <input
            type="text"
            ref={fileRef}
            className="flex-1 outline-none rounded-full py-3 px-4 border"
            name="postInput"
            placeholder="What's on your mind?"
          />

          <input type="file" name="image" accept="image/*" hidden />

          <button type="submit" hidden>
            Post
          </button>

          {/* Preview */}

          <div>
            <Button>
              <ImageIcon className="mr-2" size={16} color="currentColor" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
export default PostForm;
