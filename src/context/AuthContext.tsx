"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  User,
  onAuthStateChanged,
  reload,
} from "firebase/auth";

import { auth } from "@/firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
});

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /*
     * Firebase Auth automatically restores the persisted
     * authentication session after a browser refresh.
     *
     * We must wait for this callback before treating the
     * user as signed out.
     */
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      },
    );

    const refreshOnVisibility = () => {
      if (document.visibilityState !== "visible" || !auth.currentUser) return;
      void reload(auth.currentUser).then(() => setUser(auth.currentUser)).catch((error) => {
        console.warn("Auth visibility refresh skipped:", error);
      });
    };
    document.addEventListener("visibilitychange", refreshOnVisibility);
    window.addEventListener("focus", refreshOnVisibility);

    return () => {
      unsubscribe();
      document.removeEventListener("visibilitychange", refreshOnVisibility);
      window.removeEventListener("focus", refreshOnVisibility);
    };
  }, []);

  const refreshUser = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return;
    }

    try {
      await reload(currentUser);

      /*
       * reload() can update the Firebase User object.
       * Read it again after reload instead of relying on the
       * previous reference.
       */
      setUser(auth.currentUser);
    } catch (error) {
      console.error(
        "Failed to refresh Firebase user:",
        error,
      );

      /*
       * Do NOT log the user out here.
       *
       * A temporary refresh/network failure does not mean
       * that the authentication session is invalid.
       */
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// "use client";

// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from "react";

// import { User, onAuthStateChanged, reload, } from "firebase/auth";

// import { auth } from "@/firebase/auth";

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;

//   refreshUser: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   loading: true,
//   refreshUser: async () => {},
// });

// export function AuthProvider({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   const [user, setUser] = useState<User | null>(null);

//   const [loading, setLoading] = useState(true);

//   const refreshUser = async () => {
//     if (!auth.currentUser) return;

//     await reload(auth.currentUser);

//     setUser(auth.currentUser);
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(
//       auth,
//       (firebaseUser) => {
//         setUser(firebaseUser);
//         setLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         refreshUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }