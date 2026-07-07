import { useState, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRegister } from "../../hooks/use-auth";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function RegisterForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";

  const registerUser = useRegister();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await registerUser.mutateAsync({ email, password, displayName });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-sm">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-text-main">Create an Account</h1>
        <p className="text-sm text-text-muted mt-1">Get started with FanVue Growth Platform</p>
      </div>

      {error && (
        <div className="p-3 rounded-md bg-status-danger/10 border border-status-danger/20 text-status-danger text-sm">
          {error}
        </div>
      )}

      {/* Name */}
      <div className="space-y-2">
        <label htmlFor="displayName" className="text-sm font-medium text-text-main">
          Full Name
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="John Doe"
          required
          className="w-full px-3 py-2.5 bg-glass-base border border-glass-border rounded-md 
                     text-text-main placeholder:text-text-disabled 
                     focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan
                     transition-all duration-200"
        />
      </div>

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
        <label htmlFor="password" className="text-sm font-medium text-text-main">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            minLength={8}
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
        disabled={registerUser.isPending}
        className="w-full py-2.5 bg-primary-cyan hover:bg-primary-cyan/90 text-white font-medium 
                   rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2 shadow-glow"
      >
        {registerUser.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Creating Account...
          </>
        ) : (
          "Create Account"
        )}
      </button>

      {/* Login link */}
      <p className="text-center text-sm text-text-muted">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="text-primary-cyan hover:text-primary-cyan/80 underline underline-offset-2 transition-colors"
        >
          Sign In
        </button>
      </p>
    </form>
  );
}
