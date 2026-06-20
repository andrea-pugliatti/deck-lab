import { Link } from "react-router";
import { User, Mail, Lock } from "lucide-react";

export default function Register() {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl font-bold text-white mb-1">Create Account</h2>
        <p className="text-xs text-slate-400">
          Register your profile to start constructing decks.
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Username
          </label>
          <div className="group relative flex items-center bg-dark-surface-elevated border border-border-dim rounded px-3 py-2 w-full transition-all duration-300 hover:border-border-glow focus-within:border-cyan-accent">
            <User className="w-4 h-4 text-slate-500 mr-2 group-focus-within:text-cyan-accent" />
            <input
              type="text"
              placeholder="e.g. SetoKaiba"
              required
              className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-600 w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <div className="group relative flex items-center bg-dark-surface-elevated border border-border-dim rounded px-3 py-2 w-full transition-all duration-300 hover:border-border-glow focus-within:border-cyan-accent">
            <Mail className="w-4 h-4 text-slate-500 mr-2 group-focus-within:text-cyan-accent" />
            <input
              type="email"
              placeholder="e.g. kaiba@corp.com"
              required
              className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-600 w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Password
          </label>
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

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Confirm Password
          </label>
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

        <button
          type="submit"
          className="w-full bg-gold-accent hover:bg-gold-hover text-dark-bg py-2.5 rounded font-sans font-semibold text-sm cursor-pointer shadow-md transition-all duration-300 transform hover:-translate-y-0.5 mt-4"
        >
          Create Account
        </button>
      </form>

      <div className="text-center mt-6 pt-4 border-t border-border-dim/50">
        <p className="text-xs text-slate-500">
          Already have a profile?{" "}
          <Link
            to="/login"
            className="text-cyan-accent hover:underline hover:text-cyan-hover font-semibold transition-all duration-200"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
