'use client';

import { FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { gsap } from '@/lib/gsap';
import { useGSAP } from '@gsap/react';
import { Mail, Lock, LogIn, Sparkles, ArrowLeft, Shield, LogOut, Home } from 'lucide-react';
import Link from 'next/link';

const GUEST_USER = {
  name: 'Tamu Flowers',
  email: 'guest@flowersindonesia.id',
  role: 'guest',
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingUser, setExistingUser] = useState<{ name: string; email: string; role?: string } | null>(null);

  const containerId = 'login-container';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setExistingUser(JSON.parse(storedUser));
      }
    } catch {
      setExistingUser(null);
    }
  }, []);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      gsap.from(`.${containerId} .login-card`, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
      });
    });
    return () => ctx.revert();
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));

      if (!email || !password) {
        throw new Error('Mohon masukkan email dan kata sandi.');
      }

      const mockUser = {
        name: email.split('@')[0] || 'Pengguna',
        email,
        role: 'member',
      };

      localStorage.setItem('user', JSON.stringify(mockUser));
      setExistingUser(mockUser);
      window.dispatchEvent(new Event('userUpdated'));
      router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      localStorage.setItem('user', JSON.stringify(GUEST_USER));
      setExistingUser(GUEST_USER);
      window.dispatchEvent(new Event('userUpdated'));
      router.replace('/');
    } catch {
      setError('Gagal masuk sebagai tamu. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('user');
    setExistingUser(null);
    window.dispatchEvent(new Event('userUpdated'));
  };

  const handleContinue = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-emerald-100/70 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors mb-8 login-card"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke beranda
        </Link>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center" id={containerId}>
          {/* Left Panel */}
          <div className="login-card">
            <div className="relative rounded-3xl overflow-hidden bg-white shadow-xl border border-white/80">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-white to-white" />
              <div className="relative p-8 sm:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 text-white shadow-lg">
                    <Sparkles className="w-6 h-6" />
                  </span>
                  <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900 leading-tight">
                      Selamat datang kembali
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                      Kelola pesanan bunga Anda dengan dashboard FLOWERSINDONESIA.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-emerald-100/70 p-6 mb-8">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Masuk sebagai tamu
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Tidak perlu membuat akun. Klik tombol berikut untuk masuk cepat dan jelajahi koleksi premium kami.
                  </p>
                  <button
                    onClick={handleGuestLogin}
                    disabled={isLoading}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-md disabled:opacity-70"
                  >
                    <LogIn className="w-4 h-4" />
                    Masuk sebagai Tamu
                  </button>
                </div>

                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/60 shadow-md">
                  <Image
                    src="https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=1200&q=80"
                    alt="Flower arrangement desk"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-emerald-900/20 mix-blend-multiply" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="login-card">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
              {existingUser && (
                <div className="mb-8 rounded-2xl border border-emerald-100 bg-emerald-50/80 p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                      Anda sudah masuk
                    </p>
                    <h3 className="text-lg font-display font-bold text-gray-900">
                      Halo, {existingUser.name || 'Pengguna'}!
                    </h3>
                    <p className="text-sm text-gray-600">
                      Lanjutkan menggunakan akun ini atau keluar untuk masuk dengan akun lain.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleContinue}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                    >
                      <Home className="w-4 h-4" />
                      Lanjutkan
                    </button>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300"
                    >
                      <LogOut className="w-4 h-4" />
                      Keluar
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold uppercase tracking-wide">
                  <Shield className="w-4 h-4" />
                  Akun Member
                </div>
                <h2 className="text-3xl font-display font-bold text-gray-900">
                  Masuk ke akun Anda
                </h2>
                <p className="text-sm text-gray-600">
                  Akses riwayat pesanan, wishlist, dan rekomendasi personal.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="nama@flowersindonesia.id"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Kata sandi
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Masukkan kata sandi"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition"
                      required
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 mt-2"
                    >
                      Lupa kata sandi?
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-100 bg-red-50 text-red-600 px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg disabled:opacity-70"
                >
                  {isLoading ? (
                    <>
                      <span className="h-5 w-5 rounded-full border-2 border-white/60 border-t-white animate-spin" />
                      Sedang memproses...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      Masuk
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Dengan masuk, Anda menyetujui <span className="text-emerald-600 font-semibold">Kebijakan Privasi</span> dan <span className="text-emerald-600 font-semibold">Syarat & Ketentuan</span> kami.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

