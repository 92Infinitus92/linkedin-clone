import { IPostDocument } from "@/mongodb/models/post";
import Post from "./Post";

function PostFeed({ posts }: { posts: IPostDocument[] }) {
  return (
    <div className="space-y-2 pb-20">
      {posts.map((post) => (
        <Post
          key={`${post.text
            .slice(0, 10)
            .replace(/\s/g, "")}+${post._id.toString()}`}
          post={post}
        />
      ))}
    </div>
  );
}
export default PostFeed;
