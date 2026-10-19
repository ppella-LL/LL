import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  ChevronRight,
  Globe,
  Info,
  LogOut,
  Monitor,
  Moon,
  Palette,
  Ruler,
  Sun,
  User as UserIcon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme, type ThemePref } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { ColorSelect } from '@/components/ColorSelect';
import { BodyTypePicker } from '@/components/ProfilePickers';
import { BodyFigure } from '@/components/BodyFigure';
import type { Gender, Language, Profile, SizeStandard } from '@/types';

type Tab = 'profile' | 'sizes' | 'settings';
const TABS: { id: Tab; label: string }[] = [
  { id: 'profile', label: 'Profile' },
  { id: 'sizes', label: 'Sizes' },
  { id: 'settings', label: 'Settings' },
];
const THEME_OPTIONS: { id: ThemePref; label: string; icon: typeof Sun }[] = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
];
const LANGUAGES: Language[] = ['English', 'Italiano', 'Français', 'Español'];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { profile, user, signOut, saveProfile } = useAuth();
  const { theme, setTheme } = useTheme();

  // A safe default so the form always renders, even if the profile is missing
  // (e.g. an account created before profiles were saved on signup).
  const makeDefault = (): Profile => ({
    name: '',
    email: user?.email ?? '',
    gender: 'Male',
    sizeStandard: 'EU',
    shirt: 'M',
    trousers: '48',
    shoes: '42',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback',
    createdAt: new Date().toISOString(),
    favoriteColor: '#ff6600',
    bodyType: 'regular',
    language: 'English',
  });

  const [tab, setTab] = useState<Tab>('profile');
  const [draft, setDraft] = useState<Profile>(profile ?? makeDefault());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sync local draft whenever the loaded profile changes (loads late / updates).
  useEffect(() => {
    if (profile) setDraft(profile);
  }, [profile]);

  const p = draft;

  const update = (patch: Partial<Profile>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
    setSaved(false);
  };

  const persist = async () => {
    if (!p) return;
    setSaving(true);
    try {
      const displayName =
        `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim() || p.name || 'Traveler';
      const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        displayName,
      )}&backgroundColor=${(p.favoriteColor || '#ff6600').replace('#', '')}`;
      await saveProfile({ ...p, name: displayName, avatar });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  const displayName =
    `${p?.firstName ?? ''} ${p?.lastName ?? ''}`.trim() || p?.name || 'Traveler';

  return (
    <div className="min-h-screen bg-surface">
      <main className="px-6 lg:px-10 pt-8 max-w-3xl mx-auto w-full animate-fade-in-up">
        {/* Header: avatar beside name */}
        <div className="flex items-center gap-5 mb-8">
          <div className="relative shrink-0">
            <img
              src={p?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'}
              alt="avatar"
              className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-surface-2 border border-line shadow-soft object-cover"
            />
            <span
              className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full border-2 border-surface shadow-soft"
              style={{ backgroundColor: p?.favoriteColor || '#ff6600' }}
              title="Favourite colour"
            />
          </div>
          <div className="min-w-0">
            <p className="eyebrow text-brand mb-1">Your account</p>
            <h1 className="display-tight text-3xl lg:text-4xl text-content truncate">
              {displayName}
            </h1>
            <p className="text-content-soft font-medium text-sm truncate mt-1">
              {p?.email || user?.email}
            </p>
          </div>
        </div>

        <SegmentedControl
          options={TABS.map((t) => t.label)}
          value={TABS.find((t) => t.id === tab)!.label}
          onChange={(label) => setTab(TABS.find((t) => t.label === label)!.id)}
          className="mb-6 max-w-md"
        />

        {tab === 'profile' && p && (
          <div className="space-y-5">
            <Card>
              <h3 className="font-black text-lg mb-5 flex items-center gap-2 text-content">
                <UserIcon size={18} className="text-brand" /> Personal info
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First name"
                  value={p.firstName ?? ''}
                  onChange={(e) => update({ firstName: e.target.value })}
                  placeholder="John"
                />
                <Input
                  label="Last name"
                  value={p.lastName ?? ''}
                  onChange={(e) => update({ lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
              <Input label="Email" value={p.email || user?.email || ''} disabled />
              <Input
                label="Date of birth"
                type="date"
                value={p.birthDate ?? ''}
                onChange={(e) => update({ birthDate: e.target.value })}
                className="[color-scheme:light] dark:[color-scheme:dark]"
              />
              <Input
                label="Home address"
                value={p.address ?? ''}
                onChange={(e) => update({ address: e.target.value })}
                placeholder="Added automatically when you ship clothes"
                className="mb-0"
              />
            </Card>

            <Card>
              <h3 className="font-black text-lg mb-1 flex items-center gap-2 text-content">
                <Palette size={18} className="text-brand" /> Favourite colour
              </h3>
              <p className="text-content-soft text-sm font-medium mb-4">
                We use it to tailor your avatar and style suggestions.
              </p>
              <ColorSelect value={p.favoriteColor} onChange={(c) => update({ favoriteColor: c })} />
            </Card>

            <SaveBar saving={saving} saved={saved} onSave={persist} />
          </div>
        )}

        {tab === 'sizes' && p && (
          <div className="space-y-5">
            <Card>
              <h3 className="font-black text-lg mb-5 flex items-center gap-2 text-content">
                <UserIcon size={18} className="text-brand" /> Body type
              </h3>
              <div className="flex items-center gap-5">
                <div className="w-16 h-24 text-brand shrink-0 flex items-end justify-center">
                  <BodyFigure type={p.bodyType ?? 'regular'} gender={p.gender} active />
                </div>
                <div className="flex-1">
                  <BodyTypePicker
                    value={p.bodyType}
                    gender={p.gender}
                    onChange={(t) => update({ bodyType: t })}
                  />
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-black text-lg mb-5 flex items-center gap-2 text-content">
                <Ruler size={18} className="text-brand" /> Fitting profile
              </h3>
              <label className="block text-[11px] font-black text-content-faint uppercase tracking-wider mb-2">
                Gender
              </label>
              <SegmentedControl
                options={['Male', 'Female', 'Other'] as Gender[]}
                value={p.gender}
                onChange={(g) => update({ gender: g })}
                className="mb-5"
              />
              <label className="block text-[11px] font-black text-content-faint uppercase tracking-wider mb-2">
                Shoe standard
              </label>
              <SegmentedControl
                options={['EU', 'US', 'UK', 'CN'] as SizeStandard[]}
                value={p.sizeStandard}
                onChange={(s) => update({ sizeStandard: s })}
                className="mb-5"
              />
              <div className="grid grid-cols-3 gap-3">
                <Input label="Shirt" value={p.shirt} onChange={(e) => update({ shirt: e.target.value })} />
                <Input label="Trousers" value={p.trousers} onChange={(e) => update({ trousers: e.target.value })} />
                <Input label="Shoes" value={p.shoes} onChange={(e) => update({ shoes: e.target.value })} />
              </div>
            </Card>

            <SaveBar saving={saving} saved={saved} onSave={persist} />
          </div>
        )}

        {tab === 'settings' && (
          <div className="space-y-5">
            <Card>
              <h3 className="font-black text-lg mb-1 text-content">Appearance</h3>
              <p className="text-content-soft text-sm font-medium mb-4">
                Choose how LuggageLess looks.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {THEME_OPTIONS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setTheme(id)}
                    className={`flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all ${
                      theme === id
                        ? 'border-brand bg-brand-soft text-brand'
                        : 'border-line bg-surface-3/50 text-content-soft hover:border-content-faint/50'
                    }`}
                  >
                    <Icon size={22} />
                    <span className="text-xs font-bold">{label}</span>
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-black text-lg mb-1 flex items-center gap-2 text-content">
                <Globe size={18} className="text-brand" /> Language
              </h3>
              <p className="text-content-soft text-sm font-medium mb-4">
                Choose your preferred language.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {LANGUAGES.map((lang) => {
                  const active = (p?.language ?? 'English') === lang;
                  return (
                    <button
                      key={lang}
                      onClick={() => update({ language: lang })}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl border font-bold text-sm transition-all ${
                        active
                          ? 'border-brand bg-brand-soft text-brand'
                          : 'border-line bg-surface-3/50 text-content-soft hover:border-content-faint/50'
                      }`}
                    >
                      {lang}
                      {active && <Check size={16} />}
                    </button>
                  );
                })}
              </div>
            </Card>

            <button
              onClick={() => navigate('/how-it-works')}
              className="w-full flex items-center gap-4 bg-surface-2 border border-line/70 rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all active:scale-[0.99] text-left"
            >
              <span className="w-11 h-11 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
                <Info size={20} />
              </span>
              <span className="flex-1">
                <span className="block font-black text-content">How it works</span>
                <span className="block text-sm text-content-soft font-medium">
                  Rent, or let us manage your clothes
                </span>
              </span>
              <ChevronRight size={20} className="text-content-faint" />
            </button>

            <Card>
              <h3 className="font-black text-lg mb-4 text-content">Account</h3>
              <Button variant="outline" className="w-full">
                Change password
              </Button>
            </Card>

            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full text-red-500 hover:text-red-600 hover:bg-red-500/10 bg-surface-2 border border-red-500/20"
            >
              <LogOut size={18} /> Sign out
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

function SaveBar({ saving, saved, onSave }: { saving: boolean; saved: boolean; onSave: () => void }) {
  return (
    <div className="flex items-center gap-3">
      <Button onClick={onSave} disabled={saving} className="flex-1">
        {saving ? 'Saving…' : 'Save changes'}
      </Button>
      {saved && (
        <span className="inline-flex items-center gap-1.5 text-green-600 font-bold text-sm">
          <Check size={16} /> Saved
        </span>
      )}
    </div>
  );
}
