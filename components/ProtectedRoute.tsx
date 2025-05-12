// 'use client';

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/contexts/auth-context";

// type ProtectedRouteProps = {
//   allowedRoles: string[]; // e.g., ['Admin'], ['Customer'], ['Driver']
//   children: React.ReactNode;
// };

// export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
//   const { user } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!user) {
//       router.push("/login");
//     } else if (!allowedRoles.includes(user.type) && !(user.isAdmin )) {
//       // Redirect unauthorized user
//       router.push("/login");
//     }
//   }, [user, allowedRoles, router]);

//   // Optional: show nothing or a loader while user is being validated
//   if (!user || (!allowedRoles.includes(user.type) && !(user.isAdmin))) {
//     return null;
//   }

//   return <>{children}</>;
// }



'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

type ProtectedRouteProps = {
  allowedRoles: string[];
  children: React.ReactNode;
};

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
    
      if (!user) {
        router.push("/login");
      } else if (!allowedRoles.includes(user.type) && !user.isAdmin) {
        router.push("/login");
      }
    }
  }, [user, isLoading, allowedRoles, router]);

  if (isLoading) {
    return <div>Loading...</div>; // Or your custom loader
  }

  if (!user || (!allowedRoles.includes(user.type) && !user.isAdmin)) {
    return null; // The useEffect will handle the redirect
  }

  return <>{children}</>;
}