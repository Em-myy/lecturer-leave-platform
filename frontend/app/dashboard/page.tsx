import { signOut, useSession } from "@/lib/auth-client";
import Link from "next/link";

const Dashboard = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <h1>Checking Session...</h1>;
  }

  if (!session) {
    return (
      <div>
        <h1>Not logged in</h1>
        <Link href="/">Go and Sign Up or Sign In to your account</Link>
      </div>
    );
  }
  return (
    <div>
      <h1>{session.user.name}</h1>
      <h2>{session.user.email}</h2>
      <h3>{session.user.department}</h3>
      <h4>{session.user.role}</h4>

      <button type="button" onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  );
};

export default Dashboard;
