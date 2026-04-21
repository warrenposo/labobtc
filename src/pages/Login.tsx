import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Lock, Mail, Bitcoin, Zap, Shield, TrendingUp, CheckCircle2 } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const redirectedRef = useRef(false);
  const { signIn, user, profile, isAdmin, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (user && !redirectedRef.current) {
      redirectedRef.current = true;
      const timer = setTimeout(() => {
        navigate(profile ? (isAdmin ? '/admin' : '/dashboard') : '/dashboard', { replace: true });
        setIsSubmitting(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user, profile, isAdmin, authLoading, navigate]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: '' }));
    if (authError) setAuthError(null);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Enter a valid email';
    if (!formData.password) errors.password = 'Password is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setAuthError(null);
    try {
      const result = await signIn(formData.email.trim().toLowerCase(), formData.password);
      if (!result) throw new Error('Sign in failed - no response received');
    } catch (error: any) {
      let msg = 'Failed to sign in. Please check your credentials and try again.';
      if (error.message?.includes('Invalid login credentials')) msg = 'Invalid email or password. Please try again.';
      else if (error.message?.includes('Email not confirmed')) msg = 'Please verify your email address before signing in.';
      else if (error.message) msg = error.message;
      setAuthError(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#060d1a]">

      {/* ── LEFT PANEL ─────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[46%] relative flex-col justify-between p-12 overflow-hidden bg-[#04080f]">

        {/* Dot matrix */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />

        {/* Gold orb */}
        <div className="absolute top-[-80px] left-[-80px] w-[420px] h-[420px] rounded-full bg-yellow-500/6 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-60px] right-[-60px] w-[300px] h-[300px] rounded-full bg-emerald-500/5 blur-[80px] pointer-events-none" />

        {/* Vertical accent line */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/8 to-transparent" />

        {/* Brand */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Bitcoin className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black tracking-tight">
              <span className="text-white">BtcN</span>
              <span className="text-gradient-gold">MiningBase</span>
            </span>
          </Link>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-black text-white leading-tight mb-4">
              Your mining operation<br />
              <span className="text-gradient-gold">never sleeps.</span>
            </h2>
            <p className="text-white/45 text-base leading-relaxed max-w-xs">
              Sign in to monitor your rigs, check today's earnings, and manage payouts — all in one place.
            </p>
          </div>

          <ul className="space-y-4">
            {[
              { icon: Zap,        text: "Real-time hashrate & worker diagnostics" },
              { icon: TrendingUp, text: "Daily automatic BTC payouts" },
              { icon: Shield,     text: "Bank-grade security on every account" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-yellow-500/15 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-yellow-400" />
                </span>
                <span className="text-white/55 text-sm">{text}</span>
              </li>
            ))}
          </ul>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "50K+",   label: "Active Miners" },
              { value: "99.9%",  label: "Uptime" },
              { value: "$2.4M+", label: "Paid Out" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-3 text-center">
                <div className="text-base font-black text-gradient-gold">{s.value}</div>
                <div className="text-white/30 text-[10px] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="relative z-10 text-white/20 text-xs">
          © 2020–2026 BtcNMiningBase · PCI Compliant · ISO 27001
        </div>
      </div>

      {/* ── RIGHT PANEL — form ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">

        {/* Subtle top glow */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />

        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Bitcoin className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-black">
              <span className="text-white">BtcN</span>
              <span className="text-gradient-gold">MiningBase</span>
            </span>
          </Link>
        </div>

        <div className="w-full max-w-[400px]">

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-1.5">Welcome back</h1>
            <p className="text-white/40 text-sm">Sign in to your mining dashboard</p>
          </div>

          {/* Auth error */}
          {authError && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex items-start gap-2.5">
              <span className="mt-0.5 flex-shrink-0">⚠</span>
              {authError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-white/70 text-sm font-medium">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isSubmitting}
                  className={`pl-10 h-11 bg-white/[0.05] border text-white placeholder:text-white/25 rounded-xl focus-visible:ring-1
                    ${formErrors.email ? 'border-red-500/50 focus-visible:ring-red-500/50' : 'border-white/10 focus-visible:ring-yellow-500/50 hover:border-white/20'}`}
                />
              </div>
              {formErrors.email && <p className="text-xs text-red-400">{formErrors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-white/70 text-sm font-medium">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-yellow-400/80 hover:text-yellow-400 transition-colors"
                  onClick={(e) => isSubmitting && e.preventDefault()}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  disabled={isSubmitting}
                  className={`pl-10 pr-11 h-11 bg-white/[0.05] border text-white placeholder:text-white/25 rounded-xl focus-visible:ring-1
                    ${formErrors.password ? 'border-red-500/50 focus-visible:ring-red-500/50' : 'border-white/10 focus-visible:ring-yellow-500/50 hover:border-white/20'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  disabled={isSubmitting}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors p-0.5"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {formErrors.password && <p className="text-xs text-red-400">{formErrors.password}</p>}
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="remember"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => handleInputChange('rememberMe', Boolean(checked))}
                disabled={isSubmitting}
                className="border-white/20 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
              />
              <Label htmlFor="remember" className="text-sm text-white/50 cursor-pointer">Keep me signed in</Label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl font-bold text-sm text-black flex items-center justify-center gap-2 transition-all duration-200
                bg-gradient-to-r from-yellow-500 to-orange-400 hover:from-yellow-400 hover:to-orange-300 hover:scale-[1.01]
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-yellow-500/15"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing In…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-white/20 text-xs">or</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-white/40">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
              onClick={(e) => isSubmitting && e.preventDefault()}
            >
              Create one free →
            </Link>
          </p>

          {/* Trust line */}
          <div className="mt-8 flex items-center justify-center gap-4 text-white/20 text-xs">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 256-bit SSL</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> PCI Compliant</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> ISO 27001</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;
