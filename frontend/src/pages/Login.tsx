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
          <Label className="mb-2 text-xs">Username or Email</Label>
          <Input
            type="text"
            placeholder="e.g. SetoKaiba or kaiba@corp.com"
            required
            disabled={submitting}
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label className="text-xs">Password</Label>
            <a
              href="#forgot-password"
              className="text-[10px] text-cyan-accent hover:underline hover:text-cyan-hover transition-all duration-200"
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
            icon={<Lock className="w-4 h-4" />}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={submitting}
          className="w-full py-2.5 rounded font-sans font-semibold text-sm mt-4"
        >
          Enter the Lab
        </Button>
      </form>

      <div className="text-center mt-6 pt-4 border-t border-border-dim/50">
        <p className="text-xs text-slate-500">
          New to the Lab?{" "}
          <Link
            to="/register"
            viewTransition
            className="text-cyan-accent hover:underline hover:text-cyan-hover font-semibold transition-all duration-200"
          >
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}
