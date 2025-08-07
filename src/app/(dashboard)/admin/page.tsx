import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const page = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);

  return <div> Welcome to Admin page </div>;
};

export default page;  