"use client";

import Link from 'next/link';
import { Eye, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-zinc-800 to-black text-foreground">
      {/* Main Split Container */}
      <div className="flex w-full max-w-4xl bg-background border border-foreground/10 overflow-hidden shadow-2xl min-h-[500px]">
        
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-between">
          <div>
            {/* Header / Logo Area */}
            <div className="flex items-center gap-3 mb-10">
              <Link href="/" className="p-1.5 -ml-1.5 bg-secondary/50 hover:bg-secondary text-foreground/50 hover:text-foreground transition-colors shrink-0 flex items-center justify-center">
                <ArrowLeft size={16} strokeWidth={2.5} />
              </Link>
              <Link href="/" className="font-display text-xl font-black uppercase tracking-tighter">
                Storely
              </Link>
            </div>

            {/* Title & Sub */}
            <h1 className="font-display text-2xl font-black uppercase tracking-tight mb-1">
              Create an account
            </h1>
            <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-8">
              Join the future of retail.
            </p>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSignup}>
              {error && (
                <div className="p-3 text-xs font-bold text-red-500 bg-red-500/10 border border-red-500/20">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="runner@void.com" 
                  className="w-full border border-foreground/10 py-2.5 px-3 font-bold text-sm outline-none focus:border-foreground transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5">Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••" 
                    className="w-full border border-foreground/10 py-2.5 px-3 font-bold text-sm tracking-widest outline-none focus:border-foreground transition-colors pr-10"
                    required
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors">
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5">Confirm Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••" 
                    className="w-full border border-foreground/10 py-2.5 px-3 font-bold text-sm tracking-widest outline-none focus:border-foreground transition-colors pr-10"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#1b1b1b] text-white font-bold text-xs tracking-widest uppercase py-3.5 hover:bg-black transition-colors mt-6 disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-x-0 h-px bg-foreground/10"></div>
              <span className="relative bg-background px-3 text-[10px] font-bold tracking-widest uppercase text-foreground/30">OR</span>
            </div>

            <div className="text-center">
              <span className="text-[10px] font-bold text-foreground/60 mr-2">Already have an account?</span>
              <Link href="/login" className="text-[10px] font-bold text-foreground tracking-widest uppercase hover:opacity-50 transition-opacity">
                Log In →
              </Link>
            </div>
          </div>

          <div className="text-[9px] font-bold tracking-widest text-foreground/30 uppercase mt-8 flex gap-3">
            <a href="#" className="hover:text-foreground">Help</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
          </div>
        </div>

        {/* Right Side: Visual Container */}
        <div className="hidden md:flex w-1/2 p-2 pb-2 pr-2">
          <div className="w-full h-full bg-[#0a0a0a] relative overflow-hidden flex flex-col justify-between p-8 text-background">
            
            {/* Visual Graphic Element (in place of photo) */}
            <div className="absolute top-0 right-0 w-3/4 h-3/4 opacity-10 pointer-events-none">
              <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="2" className="transform rotate-12 origin-center" />
                <rect x="30" y="30" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="4" className="transform -rotate-12 origin-center" />
              </svg>
            </div>

            <div className="mt-auto relative z-10">
              <p className="font-display leading-tight text-xl xl:text-2xl font-black mb-4">
                "We set up our store in minutes. The performance and design are unmatched. Storely is the only choice."
              </p>
              
              <p className="font-bold text-[10px] tracking-widest uppercase text-background/60 mb-6">
                Founder, NEON DREAMS
              </p>

              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 border border-background bg-transparent"></div>
                <div className="w-1.5 h-1.5 border border-background bg-background"></div>
                <div className="w-1.5 h-1.5 border border-background bg-transparent"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
