import { Button } from "../common/Button";
import { useAuth } from "../../hooks/useAuth";

export function LoginButton() {
  const { signInWithMockUser } = useAuth();

  return (
    <Button onClick={signInWithMockUser} variant="ghost">
      Login
    </Button>
  );
}
