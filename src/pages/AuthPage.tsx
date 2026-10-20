import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, HelpCircle, Luggage, MailCheck, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Logo } from '@/components/ui/Logo';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { ColorSelect } from '@/components/ColorSelect';
import { BodyTypePicker } from '@/components/ProfilePickers';
import { LondonCarousel } from '@/components/LondonCarousel';
import type { BodyType, Gender, Profile, SizeStandard } from '@/types';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function friendlyError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login')) return 'Incorrect email or password.';
  if (m.includes('already registered') || m.includes('already in use'))
    return 'This email is already in use. Try logging in.';
  if (m.includes('password')) return 'Password should be at least 6 characters.';
  if (m.includes('email')) return 'The email address is badly formatted.';
  return message.replace(/^.*?:/, '').trim() || 'Something went wrong. Try again.';
}

interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: Gender;
  favoriteColor: string;
  bodyType: BodyType;
  sizeStandard: SizeStandard;
  shirt: string;
  trousers: string;
  shoes: string;
}

const INITIAL: SignupData = {
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  birthDate: '',
  gender: 'Male',
  favoriteColor: '#ff6600',
  bodyType: 'regular',
  sizeStandard: 'EU',
  shirt: 'M',
  trousers: '48',
  shoes: '42',
};

const STEP_LABELS = ['Account', 'About you', 'Fit & style'];

export default function AuthPage() {
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState(0);
  const [data, setData] = useState<SignupData>(INITIAL);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmSent, setConfirmSent] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const set = (patch: Partial<SignupData>) => {
    setData((prev) => ({ ...prev, ...patch }));
    setError('');
  };

  const switchMode = (m: 'login' | 'signup') => {
    setMode(m);
    setStep(0);
    setError('');
  };

  // ---- Login ----
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!EMAIL_RE.test(data.email.trim())) return setError('Please enter a valid email address.');
    if (data.password.length < 6) return setError('Password should be at least 6 characters.');
    setBusy(true);
    try {
      await signIn(data.email.trim(), data.password);
      // Safety net in case the auth-change effect hasn't fired yet.
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(friendlyError(err instanceof Error ? err.message : String(err)));
      setBusy(false);
    }
  };

  // ---- Signup wizard ----
  const validateStep = (): string | null => {
    if (step === 0) {
      if (!EMAIL_RE.test(data.email.trim())) return 'Please enter a valid email address.';
      if (data.password.length < 6) return 'Password should be at least 6 characters.';
    }
    if (step === 1) {
      if (!data.firstName.trim() || !data.lastName.trim()) return 'Please enter your name.';
    }
    return null;
  };

  const next = () => {
    const err = validateStep();
    if (err) return setError(err);
    setError('');
    setStep((s) => s + 1);
  };

  const back = () => {
    setError('');
    setStep((s) => s - 1);
  };

  const submitSignup = async () => {
    setBusy(true);
    setError('');
    const name = `${data.firstName} ${data.lastName}`.trim();
    const profile: Profile = {
      name,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.trim(),
      birthDate: data.birthDate,
      gender: data.gender,
      favoriteColor: data.favoriteColor,
      bodyType: data.bodyType,
      sizeStandard: data.sizeStandard,
      shirt: data.shirt,
      trousers: data.trousers,
      shoes: data.shoes,
      language: 'English',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        name || 'Traveler',
      )}&backgroundColor=${data.favoriteColor.replace('#', '')}`,
      createdAt: new Date().toISOString(),
    };
    try {
      const { needsConfirmation } = await signUp(data.email.trim(), data.password, profile);
      if (needsConfirmation) {
        setConfirmSent(true);
        setBusy(false);
      }
      // Otherwise the auth-change effect redirects to the dashboard.
    } catch (err) {
      setError(friendlyError(err instanceof Error ? err.message : String(err)));
      setBusy(false);
    }
  };

  return (
    <div className="min-h-dvh bg-surface lg:grid lg:grid-cols-2">
      {/* Brand panel (desktop) */}
      <div className="hidden lg:flex relative overflow-hidden flex-col justify-between p-10 text-white">
        <LondonCarousel />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/80" />
        <div className="relative z-10 flex items-center gap-2 text-2xl font-black">
          <Luggage className="text-brand" size={28} />
          <span>
            Luggage<span className="text-brand">Less</span>
          </span>
        </div>
        <div className="relative z-10 max-w-md">
          <p className="eyebrow text-brand mb-4">London · Zero luggage</p>
          <h2 className="display-hero text-6xl mb-4">
            Travel
            <br />
            light.
          </h2>
          <p className="text-white/80 text-lg font-medium">
            Your personal wardrobe, freshly pressed and waiting at your room.
          </p>
        </div>
        <div className="relative z-10 flex items-center gap-2 text-white/60 text-sm font-medium">
          <Sparkles size={16} className="text-brand" /> Trusted by frequent travellers
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center p-6 lg:p-12 min-h-dvh lg:min-h-0">
        <div className="w-full max-w-md mx-auto">
          <Logo size={30} className="text-2xl justify-center lg:hidden mb-8" />

          {confirmSent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-soft text-brand flex items-center justify-center mx-auto mb-5">
                <MailCheck size={30} />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-content mb-2">
                Check your email
              </h1>
              <p className="text-content-soft font-medium mb-6">
                We sent a confirmation link to{' '}
                <span className="font-black text-content">{data.email.trim()}</span>. Click it to
                activate your account, then log in.
              </p>
              <Button
                onClick={() => {
                  setConfirmSent(false);
                  setMode('login');
                  setStep(0);
                }}
                className="w-full py-4 text-lg"
              >
                Back to log in
              </Button>
            </div>
          ) : (
          <>
          <div className="flex gap-1 p-1 bg-surface-3 rounded-xl mb-8">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${
                  mode === m
                    ? 'bg-surface-2 shadow-soft text-content'
                    : 'text-content-soft hover:text-content'
                }`}
              >
                {m === 'login' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-500 p-3 rounded-xl text-sm font-bold mb-4 border border-red-500/20">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin}>
              <h1 className="display-tight text-4xl text-content mb-1">Welcome back</h1>
              <p className="text-content-soft font-medium mb-6">Access your trips and wardrobe.</p>
              <Input
                label="Email"
                type="email"
                value={data.email}
                onChange={(e) => set({ email: e.target.value })}
                placeholder="traveler@example.com"
                autoComplete="email"
              />
              <Input
                label="Password"
                type="password"
                value={data.password}
                onChange={(e) => set({ password: e.target.value })}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <Button type="submit" disabled={busy} className="w-full py-4 text-lg mt-2">
                {busy ? 'Please wait…' : 'Sign in'}
              </Button>
            </form>
          ) : (
            <SignupWizard
              step={step}
              data={data}
              set={set}
              busy={busy}
              onNext={next}
              onBack={back}
              onSubmit={submitSignup}
            />
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate('/how-it-works')}
              className="text-sm font-bold text-content-soft hover:text-brand transition-colors inline-flex items-center gap-1.5"
            >
              <HelpCircle size={15} /> How it works
            </button>
          </div>
          </>
          )}
        </div>
      </div>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {STEP_LABELS.map((label, i) => (
        <div key={label} className="flex items-center gap-2 flex-1">
          <div
            className={`flex items-center gap-2 ${i <= step ? 'text-brand' : 'text-content-faint'}`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                i <= step ? 'bg-brand text-white' : 'bg-surface-3'
              }`}
            >
              {i + 1}
            </span>
            <span className="text-xs font-bold hidden sm:block">{label}</span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <span className={`h-0.5 flex-1 rounded ${i < step ? 'bg-brand' : 'bg-surface-3'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

interface WizardProps {
  step: number;
  data: SignupData;
  set: (patch: Partial<SignupData>) => void;
  busy: boolean;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
}

function SignupWizard({ step, data, set, busy, onNext, onBack, onSubmit }: WizardProps) {
  return (
    <div>
      <Stepper step={step} />

      {step === 0 && (
        <div>
          <h1 className="display-tight text-3xl text-content mb-1">Create account</h1>
          <p className="text-content-soft font-medium mb-6">Start travelling without luggage.</p>
          <Input
            label="Email"
            type="email"
            value={data.email}
            onChange={(e) => set({ email: e.target.value })}
            placeholder="traveler@example.com"
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            value={data.password}
            onChange={(e) => set({ password: e.target.value })}
            placeholder="At least 6 characters"
            autoComplete="new-password"
          />
        </div>
      )}

      {step === 1 && (
        <div>
          <h1 className="display-tight text-3xl text-content mb-1">About you</h1>
          <p className="text-content-soft font-medium mb-6">So we can tailor your experience.</p>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First name"
              value={data.firstName}
              onChange={(e) => set({ firstName: e.target.value })}
              placeholder="John"
            />
            <Input
              label="Last name"
              value={data.lastName}
              onChange={(e) => set({ lastName: e.target.value })}
              placeholder="Doe"
            />
          </div>
          <Input
            label="Date of birth"
            type="date"
            value={data.birthDate}
            onChange={(e) => set({ birthDate: e.target.value })}
            className="[color-scheme:light] dark:[color-scheme:dark]"
          />
          <ColorSelect
            label="Favourite colour"
            value={data.favoriteColor}
            onChange={(c) => set({ favoriteColor: c })}
          />
        </div>
      )}

      {step === 2 && (
        <div>
          <h1 className="display-tight text-3xl text-content mb-1">Fit &amp; style</h1>
          <p className="text-content-soft font-medium mb-6">Helps us pick the perfect size.</p>

          <label className="block text-[11px] font-black text-content-faint uppercase tracking-wider mb-2">
            Gender
          </label>
          <SegmentedControl
            options={['Male', 'Female', 'Other'] as Gender[]}
            value={data.gender}
            onChange={(g) => set({ gender: g })}
            className="mb-5"
          />

          <label className="block text-[11px] font-black text-content-faint uppercase tracking-wider mb-2">
            Body type
          </label>
          <div className="mb-5">
            <BodyTypePicker
              value={data.bodyType}
              gender={data.gender}
              onChange={(t) => set({ bodyType: t })}
            />
          </div>

          <label className="block text-[11px] font-black text-content-faint uppercase tracking-wider mb-2">
            Shoe standard
          </label>
          <SegmentedControl
            options={['EU', 'US', 'UK', 'CN'] as SizeStandard[]}
            value={data.sizeStandard}
            onChange={(s) => set({ sizeStandard: s })}
            className="mb-5"
          />

          <div className="grid grid-cols-3 gap-3">
            <Input label="Shirt" value={data.shirt} onChange={(e) => set({ shirt: e.target.value })} />
            <Input label="Trousers" value={data.trousers} onChange={(e) => set({ trousers: e.target.value })} />
            <Input label="Shoes" value={data.shoes} onChange={(e) => set({ shoes: e.target.value })} />
          </div>
        </div>
      )}

      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <Button variant="outline" onClick={onBack} className="px-5">
            <ArrowLeft size={18} />
          </Button>
        )}
        {step < 2 ? (
          <Button onClick={onNext} className="flex-1 py-4 text-lg">
            Continue <ArrowRight size={18} />
          </Button>
        ) : (
          <Button onClick={onSubmit} disabled={busy} className="flex-1 py-4 text-lg">
            {busy ? 'Creating…' : 'Create account'}
          </Button>
        )}
      </div>
    </div>
  );
}
