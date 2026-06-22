import { AlertTriangle, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(usernameOrEmail, password);
      navigate("/decks");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl font-bold text-white mb-1">Login</h2>
        <p className="text-xs text-slate-400">Enter your credentials to access the laboratory.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-900/30 border border-red-500/50 text-red-200 p-3 rounded text-xs mb-4">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Username or Email
          </label>
          <div className="group relative flex items-center bg-dark-surface-elevated border border-border-dim rounded px-3 py-2 w-full transition-all duration-300 hover:border-border-glow focus-within:border-cyan-accent">
            <Mail className="w-4 h-4 text-slate-500 mr-2 group-focus-within:text-cyan-accent" />
            <input
              type="text"
              placeholder="e.g. SetoKaiba or kaiba@corp.com"
              required
              disabled={submitting}
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-600 w-full"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Password
            </label>
            <a
              href="#forgot-password"
              className="text-[10px] text-cyan-accent hover:underline hover:text-cyan-hover transition-all duration-200"
            >
              Forgot Password?
            </a>
          </div>
          <div className="group relative flex items-center bg-dark-surface-elevated border border-border-dim rounded px-3 py-2 w-full transition-all duration-300 hover:border-border-glow focus-within:border-cyan-accent">
            <Lock className="w-4 h-4 text-slate-500 mr-2 group-focus-within:text-cyan-accent" />
            <input
              type="password"
              placeholder="••••••••"
              required
              disabled={submitting}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-600 w-full"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gold-accent hover:bg-gold-hover text-dark-bg py-2.5 rounded font-sans font-semibold text-sm cursor-pointer shadow-md transition-all duration-300 transform hover:-translate-y-0.5 mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
        >
          {submitting ? "Entering..." : "Enter the Lab"}
        </button>
      </form>

      <div className="text-center mt-6 pt-4 border-t border-border-dim/50">
        <p className="text-xs text-slate-500">
          New to the Lab?{" "}
          <Link
            to="/register"
            className="text-cyan-accent hover:underline hover:text-cyan-hover font-semibold transition-all duration-200"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
