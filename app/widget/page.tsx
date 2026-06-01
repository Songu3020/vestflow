"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function WidgetPage() {
  const [scheduleId, setScheduleId] = useState("0");
  const [minimal, setMinimal] = useState(false);
  const [copied, setCopied] = useState(false);

  const embedCode = `<!-- Add to your HTML -->
<script src="https://vestflow.xyz/widget.js"><\/script>
<vestflow-widget schedule-id="${scheduleId}" ${minimal ? 'minimal="true"' : ""}><\/vestflow-widget>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/app" className="text-zinc-400 hover:text-zinc-300 transition-colors text-sm mb-4 inline-block">
            ← Back to dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2">Embeddable Widget</h1>
          <p className="text-zinc-400">
            Embed VestFlow vesting schedules on your website or application
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-6">
              <h2 className="font-semibold mb-4">Widget Configuration</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-zinc-400 block mb-2">
                    Schedule ID
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={scheduleId}
                    onChange={(e) => setScheduleId(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-sm focus:outline-none focus:border-violet-500"
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    The vesting schedule ID to display
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={minimal}
                      onChange={(e) => setMinimal(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-zinc-300">Minimal Mode</span>
                  </label>
                  <p className="text-xs text-zinc-500 mt-1">
                    Show compact version without details
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview & Code */}
          <div className="lg:col-span-2 space-y-8">
            {/* Preview */}
            <div className="card p-6">
              <h2 className="font-semibold mb-4">Preview</h2>
              <div className="bg-zinc-900 rounded p-4 border border-zinc-800">
                <div className="bg-white/5 p-4 rounded">
                  <iframe
                    srcDoc={`
                      <!DOCTYPE html>
                      <html>
                      <head>
                        <script src="/widget.js"><\/script>
                        <style>body { margin: 0; background: #18181b; }</style>
                      </head>
                      <body>
                        <vestflow-widget schedule-id="${scheduleId}" ${minimal ? 'minimal="true"' : ""}><\/vestflow-widget>
                      </body>
                      </html>
                    `}
                    style={{
                      width: "100%",
                      height: minimal ? "200px" : "400px",
                      border: "none",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Embed Code */}
            <div className="card p-6">
              <h2 className="font-semibold mb-4">Embed Code</h2>
              <div className="bg-zinc-900 rounded overflow-hidden border border-zinc-800 font-mono text-sm">
                <div className="p-4 overflow-x-auto">
                  <pre className="text-zinc-300 whitespace-pre-wrap break-words">{embedCode}</pre>
                </div>
              </div>
              <button
                onClick={copyToClipboard}
                className="mt-4 w-full px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded font-semibold transition-colors"
              >
                {copied ? "✓ Copied!" : "Copy Code"}
              </button>
            </div>

            {/* Documentation */}
            <div className="card p-6">
              <h2 className="font-semibold mb-4">Documentation</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2 text-sm">Installation</h3>
                  <p className="text-sm text-zinc-400 mb-3">
                    Add the widget script to your HTML page:
                  </p>
                  <div className="bg-zinc-900 rounded p-3 border border-zinc-800 font-mono text-sm overflow-x-auto">
                    <code>&lt;script src="https://vestflow.xyz/widget.js"&gt;&lt;/script&gt;</code>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-sm">Basic Usage</h3>
                  <p className="text-sm text-zinc-400 mb-3">
                    Display a vesting schedule with a given ID:
                  </p>
                  <div className="bg-zinc-900 rounded p-3 border border-zinc-800 font-mono text-sm overflow-x-auto">
                    <code>
                      &lt;vestflow-widget schedule-id="123"&gt;&lt;/vestflow-widget&gt;
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-sm">Attributes</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-zinc-300 mb-1">schedule-id (required)</p>
                      <p className="text-sm text-zinc-400">
                        The ID of the vesting schedule to display. Example: "0", "42", etc.
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-300 mb-1">minimal (optional)</p>
                      <p className="text-sm text-zinc-400">
                        If set to "true", shows a compact version of the widget. Default: "false"
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-sm">Styling</h3>
                  <p className="text-sm text-zinc-400 mb-3">
                    The widget uses a shadow DOM with scoped styles. You can override the widget container size:
                  </p>
                  <div className="bg-zinc-900 rounded p-3 border border-zinc-800 font-mono text-sm overflow-x-auto">
                    <pre className="text-zinc-300">{`vestflow-widget {
  width: 100%;
  max-width: 500px;
}`}</pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-sm">Features</h3>
                  <ul className="text-sm text-zinc-400 space-y-2">
                    <li>✓ Displays vesting schedule information</li>
                    <li>✓ Shows real-time vesting progress</li>
                    <li>✓ Responsive and mobile-friendly</li>
                    <li>✓ Dark mode by default (matches most modern UIs)</li>
                    <li>✓ Lightweight (&lt; 5KB gzipped)</li>
                    <li>✓ No external dependencies</li>
                    <li>✓ Works on any website</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 text-sm">Examples</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Full widget:</p>
                      <div className="bg-zinc-900 rounded p-3 border border-zinc-800 font-mono text-xs overflow-x-auto">
                        <code>&lt;vestflow-widget schedule-id="0"&gt;&lt;/vestflow-widget&gt;</code>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-1">Minimal widget:</p>
                      <div className="bg-zinc-900 rounded p-3 border border-zinc-800 font-mono text-xs overflow-x-auto">
                        <code>&lt;vestflow-widget schedule-id="0" minimal="true"&gt;&lt;/vestflow-widget&gt;</code>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded">
                  <p className="text-sm text-blue-300">
                    <strong>💡 Tip:</strong> Use the configuration panel on the left to generate a custom embed code for any schedule ID.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
