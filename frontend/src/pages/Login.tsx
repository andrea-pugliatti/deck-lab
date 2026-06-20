import { Link } from "react-router";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl font-bold text-white mb-1">Login</h2>
        <p className="text-xs text-slate-400">Enter your credentials to access the laboratory.</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="group relative flex items-center bg-dark-surface-elevated border border-border-dim rounded px-3 py-2 w-full transition-all duration-300 hover:border-border-glow focus-within:border-cyan-accent">
            <Mail className="w-4 h-4 text-slate-500 mr-2 group-focus-within:text-cyan-accent" />
            <input
              type="email"
              placeholder="e.g. duelist@decklab.com"
              required
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
              className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-600 w-full"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="w-4 h-4 rounded border-border-dim bg-dark-surface-elevated text-cyan-accent focus:ring-cyan-accent/20 cursor-pointer"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-xs text-slate-400 cursor-pointer select-none"
          >
            Remember this device
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-gold-accent hover:bg-gold-hover text-dark-bg py-2.5 rounded font-sans font-semibold text-sm cursor-pointer shadow-md transition-all duration-300 transform hover:-translate-y-0.5 mt-2"
        >
          Enter the Lab
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
