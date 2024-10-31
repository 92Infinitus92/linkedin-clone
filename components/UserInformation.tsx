import { currentUser } from "@clerk/nextjs/server";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

async function UserInformation() {
  const user = await currentUser();
  return (
    <div className="flesx flex-col justify-center items-center bg-white mr-6 rounded-lg border py-4">
      <Avatar>
        {user?.id ? (
          <AvatarImage src={user?.imageUrl} />
        ) : (
          <AvatarImage src={"https://github.com/shadcn.png"} />
        )}
        <AvatarFallback>
          {user?.firstName?.charAt(0)}
          {user?.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <SignedIn>
        <div className="text-center">
          <p className="font-semibold">
            {user?.firstName}
            {user?.lastName}
          </p>
          <p className="text-xs">
            @{user?.firstName}
            {user?.lastName}-{user?.id.slice(-4)}
          </p>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="text-center space-y-2">
          <p className="font-semibold">Not signed in</p>

          <Button
            asChild
            className="bg-[#0B63C4] hover:bg-white hover:text-black text-white"
          >
            <SignInButton>Sign In</SignInButton>
          </Button>
        </div>
      </SignedOut>

      <hr className="w-full border-gray-200 my-5" />

      <div className="flex justify-between w-full px-4 text-sm">
        <p className="font-semibold text-gray-400">Posts</p>
        <p className="text-blue-400">0</p>
      </div>

      <div className="flex justify-between w-full px-4 text-sm">
        <p className="font-semibold text-gray-400">Comments</p>
        <p className="text-blue-400">0</p>
      </div>
    </div>
  );
}
export default UserInformation;
