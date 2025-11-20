import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ConnectButton, useCurrentAccount, useSignPersonalMessage } from "@mysten/dapp-kit";
import { SearchModal } from "@/components/SearchModal";
import { SignJWT } from "jose";

export function Navbar() {
  const notificationCount = 3; //todo: remove mock functionality
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const currentAccount = useCurrentAccount();
  const { mutate: signPersonalMessage } = useSignPersonalMessage();

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  // const handleSignMessage = async () => {
  //   if (!currentAccount) return;
  //   const message = new TextEncoder().encode('Sign this message to sign in');
  //   const result = await new Promise<{ signature?: string, bytes?: string }>((resolve) => {
  //     signPersonalMessage({
  //       message,
  //     }, {
  //       onSuccess: (signature) => {
  //         resolve(signature);
  //       },
  //       onError: (error) => {
  //         console.error(error);
  //       },
  //     });
  //   });
  //   if (result?.signature) {
  //     const signature = result.signature;

  //     const payload = {
  //       address: currentAccount.address,
  //       signature,
  //     }

  //     const jwt = await new SignJWT(payload)
  //       .setProtectedHeader({ alg: "HS256" })
  //       .setIssuedAt()
  //       .setExpirationTime("1h")
  //       .sign(new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET));

  //     console.log('jwt', jwt);
  //   }
  // };

  return (
    <header className="sticky top-0 z-[50] flex items-center justify-between gap-4 border-b border-border bg-background/70 backdrop-blur-sm px-4 py-3 pointer-events-auto relative">
      <div className="flex items-center gap-4">
        <SidebarTrigger data-testid="button-sidebar-toggle" />

        <div className="relative w-96 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
          <Input
            type="search"
            placeholder="Search projects, datasets, or users..."
            className="pl-10 cursor-pointer"
            data-testid="input-search"
            readOnly
            onClick={handleSearchClick}
            onFocus={handleSearchClick}
          />
          <SearchModal
            open={isSearchOpen}
            onOpenChange={setIsSearchOpen}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative flex justify-center items-center" data-testid="button-notifications">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <Badge className="!absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center !px-0 !py-0 text-[10px] !rounded-full">
              {notificationCount}
            </Badge>
          )}
        </Button>

        {/* {currentAccount && (
          <Button variant="ghost" className="px-2 flex justify-center items-center" onClick={handleSignMessage}>
            Sign Message
          </Button>
        )} */}
        <ConnectButton />
      </div>
    </header>
  );
}
