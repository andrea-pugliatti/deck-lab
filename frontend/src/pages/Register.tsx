import { AlertTriangle, Lock, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Label from "../components/ui/Label";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      await register(username, email, password);
      navigate("/decks");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl font-bold text-white mb-1">Create Account</h2>
        <p className="text-xs text-slate-400">Register your profile to start constructing decks.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-900/30 border border-red-500/50 text-red-200 p-3 rounded text-xs mb-4">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label className="mb-2 text-xs">Username</Label>
          <Input
            type="text"
            placeholder="e.g. SetoKaiba"
            required
            disabled={submitting}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            icon={<User className="w-4 h-4" />}
          />
        </div>

        <div>
          <Label className="mb-2 text-xs">Email Address</Label>
          <Input
            type="email"
            placeholder="e.g. kaiba@corp.com"
            required
            disabled={submitting}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
          />
        </div>

        <div>
          <Label className="mb-2 text-xs">Password</Label>
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

        <div>
          <Label className="mb-2 text-xs">Confirm Password</Label>
          <Input
            type="password"
            placeholder="••••••••"
            required
            disabled={submitting}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={submitting}
          className="w-full py-2.5 rounded font-sans font-semibold text-sm mt-4"
        >
          Create Account
        </Button>
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
