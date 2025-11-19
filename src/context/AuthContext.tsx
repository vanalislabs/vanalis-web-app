import { createContext, PropsWithChildren, useContext, useEffect, useRef } from "react";
import { QueryObserverResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/stores/userStore";
import { fetchAuthUser, fetchLogin, fetchTextToSign } from "@/services/api/authApi";
import { useCurrentAccount, useCurrentWallet, useDisconnectWallet, useSignPersonalMessage } from "@mysten/dapp-kit";
import { SignJWT } from "jose";
import { toast } from "sonner";
import { AuthUser } from "@/types/user";

interface AuthContextProps {
  refetchAuthUser: () => Promise<QueryObserverResult<AuthUser, Error>>;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const currentAccount = useCurrentAccount();
  const { mutate: signPersonalMessage } = useSignPersonalMessage();
  const { user, setUser, refreshToken, accessToken, setAccessToken, setRefreshToken, logout } = useUserStore();
  const { mutate: disconnectWallet } = useDisconnectWallet();
  const { connectionStatus } = useCurrentWallet();
  const queryClient = useQueryClient();
  const prevConnectionStatusRef = useRef<string | undefined>(connectionStatus);

  // Reset auth state when connection status changes from connected to disconnected
  useEffect(() => {
    const prevStatus = prevConnectionStatusRef.current;
    const currentStatus = connectionStatus;

    if (prevStatus === "connected" && currentStatus === "disconnected") {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      // Clear the query cache for authUser
      queryClient.removeQueries({ queryKey: ["authUser"] });
    }

    // Update the ref with current status
    prevConnectionStatusRef.current = currentStatus;
  }, [connectionStatus, setAccessToken, setRefreshToken, setUser, queryClient]);

  const { data: userProfile, refetch: refetchAuthUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await fetchAuthUser();
      return response.data;
    },
    enabled: Boolean(accessToken && refreshToken && !user?.address),
    retry: 1,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  useEffect(() => {
    if (userProfile) {
      setUser(userProfile);
    }
  }, [userProfile, setUser]);

  useEffect(() => {
    if (currentAccount && (!user?.address || (user?.address != currentAccount?.address))) {
      doLogin();
    }
  }, [currentAccount?.address, user?.address]);

  const doLogin = async () => {
    if (!currentAccount) return;

    let messageToSign = '';
    try {
      const response = await fetchTextToSign();
      if (response.data) {
        messageToSign = response.data;
      }
    } catch (error) {
      toast.error('Failed to fetch text to sign');
      console.error(error);
      return;
    }

    const message = new TextEncoder().encode(messageToSign);
    const result = await new Promise<{ signature?: string, bytes?: string }>((resolve) => {
      signPersonalMessage({
        message,
      }, {
        onSuccess: (signature) => {
          resolve(signature);
        },
        onError: (error) => {
          logout();
          disconnectWallet();
        },
      });
    });
    if (result?.signature) {
      const signature = result.signature;

      const payload = {
        address: currentAccount.address,
        signature,
      }

      const jwt = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(new TextEncoder().encode(import.meta.env.VITE_JWT_SECRET));

      try {
        const response = await fetchLogin({
          jwtSignature: jwt,
        });
        if (response.data) {
          setAccessToken(response.data.accessToken);
          setRefreshToken(response.data.refreshToken);
          // Invalidate and refetch user profile after successful login
          queryClient.invalidateQueries({ queryKey: ["authUser"] });
        }
      } catch (error) {
        console.error(error);
        logout();
        disconnectWallet();
      }
    }
  }

  return (
    <AuthContext.Provider value={{
      refetchAuthUser,
      isLoggedIn: Boolean(currentAccount?.address && user?.address && connectionStatus === "connected"),
    }}>
      {children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};