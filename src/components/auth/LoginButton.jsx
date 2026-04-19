import { Button } from "../common/Button";

export function LoginButton() {
  return (
    <Button
      onClick={() => {
        window.location.href =
          import.meta.env.VITE_GOOGLE_LOGIN_URL ??
          "http://localhost:8080/oauth2/authorization/google";
      }}
      variant="ghost"
    >
      Login
    </Button>
  );
}
