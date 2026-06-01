"use client";
import { useState } from "react";

interface NotificationSubscriptionProps {
  scheduleId: number;
  beneficiaryAddress: string;
}

export default function NotificationSubscription({
  scheduleId,
  beneficiaryAddress,
}: NotificationSubscriptionProps) {
  const [email, setEmail] = useState("");
  const [notificationType, setNotificationType] = useState("all");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          scheduleId,
          beneficiaryAddress,
          notificationType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: "error", text: data.error || "Failed to subscribe" });
        return;
      }

      setMessage({
        type: "success",
        text: "Subscription created! Check your email to verify.",
      });
      setEmail("");
      setNotificationType("all");
    } catch (error) {
      setMessage({
        type: "error",
        text: "Network error. Please try again.",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 border-emerald-500/20 bg-emerald-500/5 mb-8">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <span className="text-lg">🔔</span>
        Get Notified About Milestones
      </h3>
      <p className="text-sm text-zinc-400 mb-4">
        Subscribe to receive email notifications when important events happen with this schedule.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-zinc-400 mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            disabled={loading}
            required
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-xs text-zinc-400 mb-2">Notify Me When</label>
          <select
            value={notificationType}
            onChange={(e) => setNotificationType(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All events (cliff, claimable, revoked)</option>
            <option value="cliff_reached">Cliff is reached</option>
            <option value="claimable">Tokens become claimable</option>
            <option value="revoked">Schedule is revoked</option>
          </select>
        </div>

        {message && (
          <div
            className={`text-sm p-3 rounded border ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !email}
          className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-700 disabled:opacity-50 text-white rounded font-semibold transition-colors"
        >
          {loading ? "Subscribing..." : "Subscribe to Notifications"}
        </button>
      </form>

      <p className="text-xs text-zinc-500 mt-4">
        We'll send a verification email. You must verify your email before receiving notifications.
      </p>
    </div>
  );
}
