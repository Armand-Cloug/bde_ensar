import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SignOutButton from "@/components/SignOutButton";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
        <h1 className="text-4xl font-bold mb-4">Welcome to Account page {session?.user?.email}</h1>
        <p className="text-lg text-gray-700"><SignOutButton /></p>
      </main>
  );
}
