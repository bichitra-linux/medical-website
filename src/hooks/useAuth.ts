import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/router";

export function useAuth() {
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  
  // Handle sign out and redirect
  const handleSignOut = async () => {
    await signOut();
    router.push("/admin/login");
  };
  
  // Get user role (can be expanded by using Clerk's Public Metadata)
  const getUserRole = () => {
    if (!isSignedIn || !user) return null;
    
    // In a real app, you might get this from Clerk's public metadata
    // This is a placeholder that returns "admin" for all authenticated users
    return "admin";
  };
  
  return {
    user,
    isSignedIn,
    isLoaded,
    isAdmin: getUserRole() === "admin",
    signOut: handleSignOut
  };
}