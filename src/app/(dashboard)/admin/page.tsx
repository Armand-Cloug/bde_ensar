import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const page = async () => {
  const session = await getServerSession(authOptions);
  return (
    <main className="">
            <h1 className="text-4xl font-bold mb-4">Welcome to Admin page {session?.user?.email}</h1>
            <p className="text-lg text-gray-700">I'm ROOT</p>
            <p className="text-lg text-gray-700">Compte : {session?.user?.email}</p>
          </main>
  );
};

export default page;  