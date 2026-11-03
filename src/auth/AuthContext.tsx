import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { ActivePortal, CarryUser } from "../types/user";

interface AuthContextType {
  firebaseUser: User | null;
  profile: CarryUser | null;
  loading: boolean;
  register: (
    fullName: string,
    email: string,
    password: string,
    phone: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  switchPortal: (portal: ActivePortal) => Promise<void>;
  applyForDriver: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CarryUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setProfile(null);
      return;
    }
    const profileRef = doc(db, "users", currentUser.uid);
    const profileSnapshot = await getDoc(profileRef);
    if (!profileSnapshot.exists()) {
      throw new Error("Your user profile was not found.");
    }
    setProfile(profileSnapshot.data() as CarryUser);
  };

  useEffect(() => {
    // Safety timeout: prevents infinite loading if network or auth state stalls
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      clearTimeout(timer);
      setFirebaseUser(user);
      try {
        if (user) {
          const profileRef = doc(db, "users", user.uid);
          const snapshot = await getDoc(profileRef);
          if (snapshot.exists()) {
            setProfile(snapshot.data() as CarryUser);
          } else {
            // Safe recovery: create base customer profile if Firestore doc is missing
            const baseProfile: CarryUser = {
              uid: user.uid,
              name: user.displayName || "Customer",
              fullName: user.displayName || "Customer",
              email: user.email || "",
              phone: user.phoneNumber || "",
              roles: ["customer"],
              activePortal: "customer",
              photoURL: "",
              driverVerificationStatus: "not_applied",
              accountStatus: "active",
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            try {
              await setDoc(profileRef, baseProfile);
              setProfile(baseProfile);
            } catch {
              setProfile(null);
            }
          }
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Profile loading failed:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  const register = async (
    fullName: string,
    email: string,
    password: string,
    phone: string
  ) => {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email.trim().toLowerCase(),
      password
    );

    const newProfile: CarryUser = {
      uid: credential.user.uid,
      name: fullName.trim(),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      roles: ["customer"],
      activePortal: "customer",
      driverVerificationStatus: "not_applied",
      accountStatus: "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(doc(db, "users", credential.user.uid), newProfile);
      setProfile(newProfile);
    } catch (error) {
      // Do not leave a partially registered session active.
      await signOut(auth);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(
      auth,
      email.trim().toLowerCase(),
      password
    );
    // Auth state listener loads the Firestore profile.
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
    setFirebaseUser(null);
  };

  const switchPortal = async (portal: ActivePortal) => {
    if (!firebaseUser || !profile) {
      throw new Error("Please sign in again.");
    }
    if (profile.accountStatus !== "active") {
      throw new Error("Your account is not active.");
    }
    if (portal === "driver") {
      const isApproved =
        profile.roles.includes("driver") &&
        profile.driverVerificationStatus === "approved";
      if (!isApproved) {
        throw new Error("Driver portal requires approval.");
      }
    }

    await updateDoc(doc(db, "users", firebaseUser.uid), {
      activePortal: portal,
      updatedAt: serverTimestamp(),
    });

    setProfile({
      ...profile,
      activePortal: portal,
    });
  };

  const applyForDriver = async () => {
    if (!firebaseUser || !profile) {
      throw new Error("Please sign in first.");
    }
    if (profile.driverVerificationStatus === "approved") {
      return;
    }
    if (profile.driverVerificationStatus === "pending") {
      return;
    }

    await setDoc(doc(db, "driverProfiles", firebaseUser.uid), {
      userId: firebaseUser.uid,
      fullName: profile.fullName,
      email: profile.email || "",
      phone: profile.phone,
      verificationStatus: "pending",
      onlineStatus: false,
      serviceAreas: ["Gandhipuram (Central Hub)", "RS Puram", "Peelamedu & Hopes College"],
      serviceCity: "Coimbatore",
      rating: 5.0,
      totalTrips: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    await updateDoc(doc(db, "users", firebaseUser.uid), {
      driverVerificationStatus: "pending",
      updatedAt: serverTimestamp(),
    });

    await refreshProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        profile,
        loading,
        register,
        login,
        logout,
        sendPasswordReset,
        switchPortal,
        applyForDriver,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useCarryAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useCarryAuth must be used inside AuthProvider");
  }
  return context;
}
