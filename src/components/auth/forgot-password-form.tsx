import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useForgotPassword } from "../../hooks/use-auth";
import { Loader2, ArrowLeft } from "lucide-react";

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const forgotPassword = useForgotPassword();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await forgotPassword.mutateAsync(email);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to request password reset";
      setError(message);
    }
  };

  if (forgotPassword.isSuccess) {
    return (
      <div className="space-y-5 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold text-text-main">Check your email</h1>
        <p className="text-sm text-text-muted mt-1">
          We've sent a password reset link to <span className="text-text-main font-medium">{email}</span>.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="w-full py-2.5 mt-4 bg-primary-cyan hover:bg-primary-cyan/90 text-white font-medium 
                     rounded-md transition-all duration-200"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-sm">
      <div className="text-center mb-2 relative">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="absolute left-0 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-main transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-text-main">Forgot Password</h1>
        <p className="text-sm text-text-muted mt-1">Enter your email to reset your password</p>
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

      {/* Submit */}
      <button
        type="submit"
        disabled={forgotPassword.isPending}
        className="w-full py-2.5 bg-primary-cyan hover:bg-primary-cyan/90 text-white font-medium 
                   rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center gap-2 shadow-glow"
      >
        {forgotPassword.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Reset Link"
        )}
      </button>
    </form>
  );
}
