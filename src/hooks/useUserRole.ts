import { useAuth } from "./useAuth";

export function useUserRole() {
  const { user } = useAuth();
  return user?.role ?? "guest";  
}
