import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";

export default function AppLayout({ authenticated }: { authenticated: boolean }) {
  const account = useCurrentAccount();
  const [afterDelay, setAfterDelay] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAfterDelay(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  if (authenticated && !account && afterDelay) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex h-screen w-full">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}