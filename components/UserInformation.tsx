import { currentUser } from "@clerk/nextjs/server";

async function UserInformation() {
  const user = await currentUser();
  return <div>UserInformation</div>;
}
export default UserInformation;
