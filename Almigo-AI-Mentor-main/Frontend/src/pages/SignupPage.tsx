import { useState, type FormEvent } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function SignupPage() {
  useDocumentTitle("Create Account");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { signup, isLoading } = useAuthStore();
  const addToast = useToastStore((s) => s.addToast);

  function validate(): boolean {
    const errs: Record<string, string> = {};

    if (!name.trim()) errs.name = "Name is required";
    else if (name.trim().length < 2) errs.name = "Name must be at least 2 characters";

    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email";

    if (!password) errs.password = "Password is required";
    else if (password.length < 8) errs.password = "At least 8 characters";
    else if (!/[A-Z]/.test(password))
      errs.password = "Include at least one uppercase letter";
    else if (!/[0-9]/.test(password))
      errs.password = "Include at least one number";

    if (!confirmPassword) errs.confirmPassword = "Confirm your password";
    else if (password !== confirmPassword)
      errs.confirmPassword = "Passwords don't match";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      await signup({ name: name.trim(), email: email.trim(), password });
      addToast({ type: "success", message: "Account created! Welcome to Almigo." });
    } catch (err: unknown) {
      let message = "Signup failed. Please try again.";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.error || message;
      }
      addToast({ type: "error", message });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Create your account</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Start your AI-powered learning journey
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="signup-name" className="text-sm font-medium">
            Full Name
          </label>
          <Input
            id="signup-name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((p) => ({ ...p, name: "" }));
            }}
            autoComplete="name"
            aria-invalid={!!errors.name}
            className="h-11 rounded-xl bg-background/50"
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="signup-email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="signup-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: "" }));
            }}
            autoComplete="email"
            aria-invalid={!!errors.email}
            className="h-11 rounded-xl bg-background/50"
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <label htmlFor="signup-password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <Input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((p) => ({ ...p, password: "" }));
              }}
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              className="h-11 rounded-xl bg-background/50 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password}</p>
          )}
          {/* Password strength hints */}
          {password && !errors.password && (
            <div className="flex gap-1.5 pt-0.5">
              <div
                className={`h-1 flex-1 rounded-full transition-colors ${
                  password.length >= 8 ? "bg-emerald-500" : "bg-muted"
                }`}
              />
              <div
                className={`h-1 flex-1 rounded-full transition-colors ${
                  /[A-Z]/.test(password) ? "bg-emerald-500" : "bg-muted"
                }`}
              />
              <div
                className={`h-1 flex-1 rounded-full transition-colors ${
                  /[0-9]/.test(password) ? "bg-emerald-500" : "bg-muted"
                }`}
              />
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <label
            htmlFor="signup-confirm-password"
            className="text-sm font-medium"
          >
            Confirm Password
          </label>
          <Input
            id="signup-confirm-password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword)
                setErrors((p) => ({ ...p, confirmPassword: "" }));
            }}
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            className="h-11 rounded-xl bg-background/50"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 hover:from-teal-600 hover:to-cyan-500 text-white font-semibold shadow-lg shadow-teal-500/20 transition-all duration-200 mt-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              Create Account
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="mt-6 pt-6 border-t text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-teal-500 hover:text-teal-400 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
