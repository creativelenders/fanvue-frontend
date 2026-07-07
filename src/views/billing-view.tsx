import { useState } from "react";
import { useWorkspace } from "../contexts/workspace-context";
import { usePermissions } from "../hooks/use-permissions";
import { usePlans, useSubscription, useUsage, useChangePlan, useInvoices } from "../hooks/use-billing";
import { PageHeader } from "../components/shared/page-header";
import { LoadingState } from "../components/shared/loading-state";
import { Check, Zap, BarChart3, Users, Headphones, Globe, Code, X, CreditCard, Loader2 } from "lucide-react";
import type { SubscriptionPlan } from "../types/billing";

export function BillingView() {
  const { currentWorkspace } = useWorkspace();
  const { planLimits, effectivePlan } = usePermissions();
  const workspaceId = currentWorkspace?.id || "";

  const { data: plans, isLoading: plansLoading } = usePlans();
  const { data: subscription, isLoading: subLoading } = useSubscription(workspaceId);
  const { data: usage } = useUsage(workspaceId);
  const { data: invoices } = useInvoices(workspaceId);
  const changePlan = useChangePlan();

  const [checkoutPlan, setCheckoutPlan] = useState<SubscriptionPlan | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Use the effective plan limit for the progress bar
  const effectiveLimit = planLimits.aiGenerations;
  const usagePercent = usage
    ? Math.round((usage.aiGenerationsUsed / effectiveLimit) * 100)
    : 0;

  if (plansLoading || subLoading) return <LoadingState />;

  const handleSimulatePayment = () => {
    if (!checkoutPlan) return;
    setIsProcessingPayment(true);
    
    // Simulate a network request to Stripe
    setTimeout(() => {
      changePlan.mutate(
        { workspaceId, planId: checkoutPlan.id },
        {
          onSuccess: () => {
            setIsProcessingPayment(false);
            setCheckoutPlan(null);
          },
          onError: () => {
            setIsProcessingPayment(false);
          }
        }
      );
    }, 1500);
  };

  return (
    <div className="relative">
      <PageHeader
        title="Billing & Plans"
        description="Manage your subscription, usage, and plan limits"
      />

      {/* Usage Meter */}
      {usage && (
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-medium text-text-main">AI Generations Usage</h3>
              <p className="text-xs text-text-muted">
                {usage.aiGenerationsUsed.toLocaleString()} / {effectiveLimit.toLocaleString()} used this period
              </p>
            </div>
            <span className={`text-sm font-medium ${
              usagePercent >= 90 ? "text-status-danger" :
              usagePercent >= 75 ? "text-status-warning" :
              "text-text-muted"
            }`}>
              {usagePercent}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-glass-border overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                usagePercent >= 90 ? "bg-status-danger" :
                usagePercent >= 75 ? "bg-status-warning" :
                "bg-primary-cyan"
              }`}
              style={{ width: `${Math.min(100, usagePercent)}%` }}
            />
          </div>
        </div>
      )}

      {/* Plan Cards */}
      <h2 className="text-lg font-semibold text-text-main mb-4">Available Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {plans?.map((plan) => {
          // Compare against effectivePlan instead of actual subscription so Admins see their override
          const isCurrentPlan = effectivePlan === plan.slug;
          const isPopular = plan.slug === "power_user" || plan.slug === "elite";

          return (
            <div
              key={plan.id}
              className={`glass-card p-6 relative flex flex-col ${
                isCurrentPlan ? "border-primary-cyan/50 ring-1 ring-primary-cyan/20" :
                isPopular ? "border-accent-gold/30" : ""
              }`}
            >
              {isPopular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-accent-gold text-black text-xs font-bold rounded-full">
                  POPULAR
                </span>
              )}
              {isCurrentPlan && (
                <span className="absolute -top-2.5 right-3 px-3 py-0.5 bg-primary-cyan text-white text-xs font-bold rounded-full">
                  CURRENT
                </span>
              )}

              <h3 className="text-lg font-bold text-text-main mb-1">{plan.name}</h3>
              <p className="text-3xl font-bold text-text-main mb-4">
                ${plan.price}
                <span className="text-sm font-normal text-text-muted">/mo</span>
              </p>

              <div className="space-y-2 mb-6 flex-1">
                <FeatureRow icon={<Zap className="w-3.5 h-3.5" />} text={`${plan.aiGenerationsLimit.toLocaleString()} AI gen/mo`} />
                <FeatureRow icon={<Globe className="w-3.5 h-3.5" />} text={`${plan.socialPlatforms} social platform${plan.socialPlatforms > 1 ? 's' : ''}`} />
                <FeatureRow icon={<Users className="w-3.5 h-3.5" />} text={`${plan.seats} seat${plan.seats > 1 ? 's' : ''}`} />
                {plan.hasAdvancedAnalytics && <FeatureRow icon={<BarChart3 className="w-3.5 h-3.5" />} text="Advanced analytics" />}
                {plan.hasApiAccess && <FeatureRow icon={<Code className="w-3.5 h-3.5" />} text="API access" />}
                {plan.hasPrioritySupport && <FeatureRow icon={<Headphones className="w-3.5 h-3.5" />} text="Priority support" />}
              </div>

              <button
                onClick={() => setCheckoutPlan(plan)}
                disabled={isCurrentPlan}
                className={`w-full py-2 rounded-md text-sm font-medium transition-all ${
                  isCurrentPlan
                    ? "bg-glass-base text-text-muted cursor-default"
                    : isPopular
                    ? "bg-accent-gold text-black hover:bg-accent-gold/90"
                    : "bg-glass-light text-text-main hover:bg-glass-border"
                }`}
              >
                {isCurrentPlan ? "Current Plan" : "Upgrade"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Invoices */}
      {invoices && invoices.length > 0 && (
        <div className="glass-card overflow-hidden">
          <h3 className="text-sm font-medium text-text-main px-4 py-3 border-b border-glass-border">
            Invoices
          </h3>
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left px-4 py-2 text-xs font-medium text-text-muted uppercase">Date</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-text-muted uppercase">Amount</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-text-muted uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-glass-light">
                  <td className="px-4 py-3 text-sm text-text-main">
                    {new Date(invoice.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-text-main font-mono">
                    ${parseFloat(invoice.amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      invoice.status === "paid" ? "bg-status-success/20 text-status-success" :
                      invoice.status === "pending" ? "bg-status-warning/20 text-status-warning" :
                      "bg-status-danger/20 text-status-danger"
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#0b0c10]/80 backdrop-blur-sm"
            onClick={() => !isProcessingPayment && setCheckoutPlan(null)}
          />
          
          <div className="glass-card relative w-full max-w-md p-0 animate-in fade-in zoom-in-95 duration-200 shadow-2xl border-primary-cyan/30 overflow-hidden">
            {/* Header */}
            <div className="bg-glass-base border-b border-glass-border p-6 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-text-main mb-1">Upgrade Subscription</h2>
                <p className="text-sm text-text-muted">You are upgrading to the <strong className="text-text-main">{checkoutPlan.name}</strong> plan.</p>
              </div>
              <button 
                onClick={() => !isProcessingPayment && setCheckoutPlan(null)}
                disabled={isProcessingPayment}
                className="text-text-muted hover:text-text-main transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 p-4 rounded-lg bg-[#0b0c10] border border-glass-border">
                <div>
                  <p className="font-medium text-text-main">{checkoutPlan.name} Plan</p>
                  <p className="text-xs text-text-muted">Billed monthly</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-text-main">${checkoutPlan.price}</p>
                  <p className="text-xs text-text-muted">Due today</p>
                </div>
              </div>

              {/* Mock Credit Card Form */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-text-muted block mb-1.5 uppercase tracking-wider">Card Number</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="0000 0000 0000 0000"
                      className="w-full px-3 py-2 pl-10 bg-glass-light border border-glass-border rounded-md text-text-main placeholder-text-disabled focus:outline-none focus:border-primary-cyan transition-all font-mono text-sm"
                      disabled={isProcessingPayment}
                    />
                    <CreditCard className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-text-muted block mb-1.5 uppercase tracking-wider">Expiration Date</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 bg-glass-light border border-glass-border rounded-md text-text-main placeholder-text-disabled focus:outline-none focus:border-primary-cyan transition-all font-mono text-sm"
                      disabled={isProcessingPayment}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-muted block mb-1.5 uppercase tracking-wider">CVC</label>
                    <input 
                      type="text" 
                      placeholder="123"
                      className="w-full px-3 py-2 bg-glass-light border border-glass-border rounded-md text-text-main placeholder-text-disabled focus:outline-none focus:border-primary-cyan transition-all font-mono text-sm"
                      disabled={isProcessingPayment}
                    />
                  </div>
                </div>
              </div>

              {/* Secure payment note */}
              <div className="flex items-center justify-center gap-2 mt-6 mb-2">
                <Check className="w-3.5 h-3.5 text-status-success" />
                <span className="text-xs text-text-muted">Payments are processed securely by Stripe</span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-glass-border bg-glass-base flex justify-end gap-3">
              <button 
                onClick={() => setCheckoutPlan(null)}
                disabled={isProcessingPayment}
                className="px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSimulatePayment}
                disabled={isProcessingPayment}
                className="px-4 py-2 text-sm font-medium bg-primary-cyan hover:bg-primary-cyan/90 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)] w-40 justify-center"
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay $${checkoutPlan.price}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-primary-cyan">{icon}</span>
      <span className="text-sm text-text-muted">{text}</span>
    </div>
  );
}
