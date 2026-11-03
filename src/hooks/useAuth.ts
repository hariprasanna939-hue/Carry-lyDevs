import { useCarryAuth } from "../auth/AuthContext";
import { CarryUser } from "../types/user";

export function useAuth() {
  const carryAuth = useCarryAuth();

  return {
    firebaseUser: carryAuth.firebaseUser,
    user: carryAuth.profile,
    profile: carryAuth.profile,
    isAuthenticated: !!carryAuth.firebaseUser,
    loading: carryAuth.loading,
    logout: carryAuth.logout,
    switchPortal: carryAuth.switchPortal,
    refreshProfile: carryAuth.refreshProfile,
    applyForDriver: carryAuth.applyForDriver,
  };
}
