"use client";

import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ImageIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";
import createPostAction from "@/actions/createPostAction";

function PostForm() {
  const ref = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { user } = useUser();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const file = e.target.files[0];
    const url = URL.createObjectURL(file);

    setPreview(url);
  };

  const handlePostAction = async (formData: FormData) => {
    const formDataCopy = formData;
    ref.current?.reset();

    const text = formDataCopy.get("postInput") as string;
    const image = formDataCopy.get("image") as File;

    if (!text.trim()) {
      console.error("Post content is empty");
      throw new Error("Post cannot be empty");
    }
    setPreview(null);

    let imageBinary: ArrayBuffer | null = null;

    if (image) {
      imageBinary = await image.arrayBuffer();
    }

    try {
      console.log("Submitting post action with:", { text, imageBinary });
      await createPostAction({
        text,
        image: imageBinary ? new Uint8Array(imageBinary) : null,
      });
      console.log("Post action completed successfully");
    } catch (error) {
      console.error("Error in handlePostAction:", error);
      throw new Error("Post failed");
    }
  };

  return (
    <div className="mb-2">
      <form
        action={(formData) => {
          handlePostAction(formData);
        }}
        ref={ref}
        className="p-3 bg-white rounded-lg border"
      >
        <div className="flex items-center space-x-2 flex-col">
          <div className="flex flex-row w-full">
            <Avatar>
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <input
              type="text"
              className="flex-1 outline-none rounded-full py-3 px-4 border"
              name="postInput"
              placeholder="What's on your mind?"
            />

            <input
              ref={fileRef}
              type="file"
              name="image"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />

            <button type="submit" hidden>
              Post
            </button>
          </div>

          {/* Preview */}
          {preview && (
            <div className="mt-2">
              <img
                src={preview}
                alt="preview"
                className="w-full object-cover"
              />
            </div>
          )}

          <div className="flex justify-end mt-2 space-x-2">
            <Button type="button" onClick={() => fileRef.current?.click()}>
              <ImageIcon className="mr-2" size={16} color="currentColor" />
              {preview ? "Change Image" : "Upload Image"}
            </Button>

            {preview && (
              <Button
                type="button"
                onClick={() => {
                  setPreview(null);
                }}
              >
                <XIcon className="mr-2" size={16} color="currentColor" />
                Remove
              </Button>
            )}
          </div>
        </div>
      </form>

      <hr className="mt-2 border-gray-300" />
    </div>
  );
}
export default PostForm;
