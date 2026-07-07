import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "../../hooks/use-auth";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const login = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login.mutateAsync({ email, password });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid email or password";
      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-sm">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-text-main">Welcome back</h1>
        <p className="text-sm text-text-muted mt-1">Sign in to FanVue Growth Platform</p>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-status-danger/10 border border-status-danger/20 text-status-danger text-sm">
          {error}
        </div>
      )}

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-text-main">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="w-full px-3 py-2.5 bg-glass-base border border-glass-border rounded-md 
                     text-text-main placeholder:text-text-disabled 
                     focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan
                     transition-all duration-200"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-text-main">
            Password
          </label>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-xs text-primary-cyan hover:text-primary-cyan/80 hover:underline transition-all"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={6}
            className="w-full px-3 py-2.5 pr-10 bg-glass-base border border-glass-border rounded-md 
                       text-text-main placeholder:text-text-disabled 
                       focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan
                       transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={login.isPending}
        className="w-full py-2.5 bg-primary-cyan hover:bg-primary-cyan/90 text-white font-medium 
                   rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2 shadow-glow"
      >
        {login.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </button>

      {/* Register link */}
      <p className="text-center text-sm text-text-muted">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="text-primary-cyan hover:text-primary-cyan/80 underline underline-offset-2 transition-colors"
        >
          Create one
        </button>
      </p>
    </form>
  );
}
