import { Button } from "../common/Button";
import { useAuth } from "../../hooks/useAuth";

export function LoginButton() {
  const { beginLogin } = useAuth();

  return (
    <Button onClick={beginLogin} variant="ghost">
      Login
    </Button>
  );
}
