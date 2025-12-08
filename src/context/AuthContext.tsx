import { createContext, PropsWithChildren, useContext, useEffect, useRef } from "react";
import { QueryObserverResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/stores/userStore";
import { fetchAuthUser, fetchLogin, fetchTextToSign } from "@/services/api/authApi";
import { useCurrentAccount, useCurrentWallet, useDisconnectWallet, useSignPersonalMessage } from "@mysten/dapp-kit";
import { SignJWT, decodeJwt } from "jose";
import { toast } from "sonner";
import { AuthUser } from "@/types/user";
import { refreshTokenIfPossible } from "@/lib/axios";

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

  useEffect(() => {
    let mounted = true;

    const checkAndRefresh = async () => {
      const { accessToken, refreshToken, logout } = useUserStore.getState();

      if(!refreshToken) return

      let shouldRefresh = false;

      if(!accessToken) {
        shouldRefresh = true;
      } else {
        try {
          const decoded = decodeJwt(accessToken);
          // If not expire, or if expire is in the past (or within 30s buffer), refresh
          const currentTime = Date.now() / 1000
          if(!decoded.exp || decoded.exp < currentTime + 30){
            shouldRefresh = true;
          }
        } catch (e) {
          // If Token is malformed, also refresh
          shouldRefresh = true;
        }
      }

      if(shouldRefresh){
        // We await here to ensure the refresh completes before other queries run 
        // if this was running in a guard, but inside useEffect it just prevents overlap
        const ok = await refreshTokenIfPossible();
        if(!ok && mounted) {
          logout()
        }
      }
    };

    checkAndRefresh();

    const onFocus = () => {
      checkAndRefresh();
    }

    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      mounted = false;
    };
  }, [])

  // Reset auth state when connection status changes from connected to disconnected
  useEffect(() => {
    const prevStatus = prevConnectionStatusRef.current;
    const currentStatus = connectionStatus;

    if (prevStatus === "connected" && currentStatus === "disconnected") {
      setAccessToken(null);
      setRefreshToken(null);
      setUser(null);
      // Clear all query cache
      queryClient.clear();
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
          // Invalidate and refetch all active queries after successful login
          queryClient.invalidateQueries();
          refetchAuthUser();
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