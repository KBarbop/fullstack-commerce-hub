import React from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import useAuth from "@/util/auth/useAuth";
import LoadingSpinner from "@/components/ui/loading-spinner/PageLoadingSpinner";

type AuthRedirectOptions = {
  redirectIfAuthenticated?: boolean;
  redirectTo?: string;
};

const AuthRedirect = (
  WrappedComponent: React.FC,
  { redirectIfAuthenticated = false, redirectTo = "/" }: AuthRedirectOptions
) => {
  const Component: React.FC = (props) => {
    const router = useRouter();
    const { user } = useSelector((state: RootState) => state.auth);
    const loading = useAuth();

    React.useEffect(() => {
      if (!loading) {
        if (redirectIfAuthenticated && user) {
          router.push(redirectTo);
        } else if (!redirectIfAuthenticated && !user) {
          router.push(redirectTo);
        }
      }
    }, [user, loading, router, redirectIfAuthenticated, redirectTo]);

    if (loading) {
      return <LoadingSpinner />;
    }

    return <WrappedComponent {...props} />;
  };

  return Component;
};

export default AuthRedirect;
