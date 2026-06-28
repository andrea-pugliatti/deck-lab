import { AlertTriangle, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";
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
      <div className="mb-6 text-center">
        <h2 className="font-display mb-1 text-2xl font-bold text-white">Login</h2>
        <p className="text-xs text-slate-400">Enter your credentials to access the laboratory.</p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded border border-red-500/50 bg-red-900/30 p-3 text-xs text-red-200">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label className="mb-2 text-xs">Username or Email</Label>
          <Input
            type="text"
            placeholder="e.g. SetoKaiba or kaiba@corp.com"
            required
            disabled={submitting}
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            icon={<Mail className="h-4 w-4" />}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label className="text-xs">Password</Label>
            <a
              href="#forgot-password"
              className="text-cyan-accent hover:text-cyan-hover text-[10px] transition-all duration-200 hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            required
            disabled={submitting}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="h-4 w-4" />}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={submitting}
          className="mt-4 w-full rounded py-2.5 font-sans text-sm font-semibold"
        >
          Enter the Lab
        </Button>
      </form>

      <div className="border-border-dim/50 mt-6 border-t pt-4 text-center">
        <p className="text-xs text-slate-500">
          New to the Lab?{" "}
          <Link
            to="/register"
            viewTransition
            className="text-cyan-accent hover:text-cyan-hover font-semibold transition-all duration-200 hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
