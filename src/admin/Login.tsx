import { useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogoMark } from "@/components/site/Logo";
import { ArrowRight, Loader2, Lock } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) {
      await qc.invalidateQueries();
      navigate("/admin", { replace: true });
    } else {
      setError("Incorrect password. Try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoMark className="h-12 w-12" />
          <h1 className="mt-4 font-display text-xl font-extrabold uppercase tracking-wide text-white">
            MDB Admin
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.28em] text-white/40">Content Manager</p>
        </div>
        <form onSubmit={submit} className="border border-white/10 bg-white/[0.04] p-7">
          <label htmlFor="admin-pw" className="field-label !text-white/50">
            Admin Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              id="admin-pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              className="w-full border border-white/15 bg-ink py-3.5 pl-10 pr-4 text-white placeholder:text-white/30 focus:border-mahoney focus:outline-none"
              placeholder="Enter password"
            />
          </div>
          {error && <p className="mt-3 text-xs font-medium text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={busy || !password}
            className="btn-primary mt-6 w-full justify-center disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign In <ArrowRight className="arrow h-4 w-4" /></>}
          </button>
        </form>
        <p className="mt-4 text-center text-[11px] text-white/30">
          Default password: mahoney1985 — change it via the ADMIN_PASSWORD environment variable.
        </p>
      </div>
    </div>
  );
}
