import { useAuth } from "../../hooks/useAuth";
import { Button } from "../common/Button";

export function LoginButton({ children = "Login", redirectTo, variant = "ghost" }) {
  const { beginLogin } = useAuth();

  return (
    <Button onClick={() => beginLogin(redirectTo)} variant={variant}>
      {children}
    </Button>
  );
}
