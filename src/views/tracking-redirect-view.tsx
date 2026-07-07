import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../lib/api-client";
import { Loader2 } from "lucide-react";

export function TrackingRedirectView() {
  const { code } = useParams<{ code: string }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function recordClick() {
      try {
        // Log the click and get destination URL
        const response = await apiClient.api.get(`/traffic/links/${code}/click`);
        const { redirectUrl } = response.data.data;
        
        // In a real app we'd redirect to redirectUrl, e.g. window.location.href = redirectUrl;
        // For local testing, we'll just show a success state to the user.
        setTimeout(() => {
          window.location.href = redirectUrl || "https://fanvue.com";
        }, 1500);
      } catch (err) {
        console.error("Failed to record click", err);
        setError("Invalid or expired tracking link.");
      }
    }

    if (code) {
      recordClick();
    }
  }, [code]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0c10]">
        <div className="glass-card p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 rounded-full bg-status-error/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-status-error text-2xl font-bold">!</span>
          </div>
          <h1 className="text-xl font-bold text-text-main mb-2">Oops, this page is missing</h1>
          <p className="text-text-muted">{error}</p>
          <a href="/" className="mt-6 block text-primary-cyan hover:underline">
            Go to homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0c10]">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-cyan mx-auto mb-4" />
        <h1 className="text-xl font-bold text-text-main mb-2">Redirecting...</h1>
        <p className="text-text-muted">Taking you to FanVue.</p>
      </div>
    </div>
  );
}
