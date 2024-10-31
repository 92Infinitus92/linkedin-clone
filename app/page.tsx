import UserInformation from "@/components/UserInformation";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid">
      <section>
        <UserInformation />
      </section>
      <section></section>
      <section></section>
    </div>
  );
}
