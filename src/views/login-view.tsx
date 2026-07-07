import { useLocation } from "react-router-dom";
import { LoginForm } from "../components/auth/login-form";
import { RegisterForm } from "../components/auth/register-form";
import { ForgotPasswordForm } from "../components/auth/forgot-password-form";

export function LoginView() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="min-h-screen bg-app-bg flex items-center justify-center p-4">
      {path === "/register" ? (
        <RegisterForm />
      ) : path === "/forgot-password" ? (
        <ForgotPasswordForm />
      ) : (
        <LoginForm />
      )}
    </div>
  );
}
