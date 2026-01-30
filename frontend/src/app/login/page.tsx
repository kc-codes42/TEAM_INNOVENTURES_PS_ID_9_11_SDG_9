'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import SatelliteBackground from '@/components/SatelliteBackground';

export default function AuthGateway() {
    const router = useRouter();
    const [authMethod, setAuthMethod] = useState('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleEmailAuth = async () => {
        setError('');
        setIsLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/visualizer');
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
            setIsLoading(false);
        }
    };

    const handleOAuthProvider = async (providerName: string) => {
        setError('');
        setIsLoading(true);

        try {
            const provider = providerName === 'google'
                ? new GoogleAuthProvider()
                : new GithubAuthProvider();

            await signInWithPopup(auth, provider);
            router.push('/visualizer');
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && authMethod === 'email' && email && password) {
            handleEmailAuth();
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden">
            <SatelliteBackground />
            {/* Header Bar */}
            <header className="border-b border-slate-700/50 bg-slate-950/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="w-8 h-8 bg-teal-500/20 border border-teal-500/50 rounded flex items-center justify-center">
                                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <span className="text-slate-300 font-semibold text-sm tracking-wide">Rural Broadband Resilience</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                        <span>Secure Gateway</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">

                    {/* Page Title */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3 tracking-tight">
                            System Access
                        </h1>
                        <p className="text-slate-400 text-sm">
                            Authenticate to enter infrastructure visualizer
                        </p>
                    </div>

                    {/* Auth Container */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">

                        {/* Error Display */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg flex items-start gap-3">
                                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <div className="text-red-300 text-sm font-medium">Authentication Failed</div>
                                    <div className="text-red-400/80 text-xs mt-1">{error}</div>
                                </div>
                            </div>
                        )}

                        {/* Auth Method Selector */}
                        <div className="flex gap-2 mb-8 p-1 bg-slate-800/50 rounded-lg border border-white/10">
                            <button
                                onClick={() => setAuthMethod('email')}
                                className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${authMethod === 'email'
                                        ? 'bg-slate-700 text-slate-100 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-300'
                                    }`}
                            >
                                Email
                            </button>
                            <button
                                onClick={() => setAuthMethod('oauth')}
                                className={`flex-1 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${authMethod === 'oauth'
                                        ? 'bg-slate-700 text-slate-100 shadow-sm'
                                    : 'text-slate-400 hover:text-slate-300'
                                    }`}
                            >
                                SSO
                            </button>
                        </div>

                        {/* Email/Password Fields */}
                        {authMethod === 'email' && (
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        onKeyPress={handleKeyPress}
                                        className={`w-full px-4 py-3 bg-slate-900/60 border rounded-lg text-slate-100 placeholder-slate-500 text-sm transition-all duration-200 focus:outline-none ${focusedField === 'email'
                                            ? 'border-teal-500 ring-2 ring-teal-500/20'
                                            : 'border-slate-700 hover:border-slate-600'
                                            }`}
                                        placeholder="engineer@company.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        onKeyPress={handleKeyPress}
                                        className={`w-full px-4 py-3 bg-slate-900/60 border rounded-lg text-slate-100 placeholder-slate-500 text-sm transition-all duration-200 focus:outline-none ${focusedField === 'password'
                                            ? 'border-teal-500 ring-2 ring-teal-500/20'
                                            : 'border-slate-700 hover:border-slate-600'
                                            }`}
                                        placeholder="••••••••••••"
                                    />
                                </div>

                                <button
                                    onClick={handleEmailAuth}
                                    disabled={isLoading || !email || !password}
                                    className="w-full mt-8 px-6 py-3.5 bg-[#14b8a6] hover:bg-teal-400 disabled:bg-teal-500/50 text-slate-950 font-semibold text-sm rounded-lg transition-all duration-200 shadow-lg shadow-teal-500/30 hover:shadow-teal-400/30 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-slate-100" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            <span>Authenticating</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Authenticate</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* OAuth Providers */}
                        {authMethod === 'oauth' && (
                            <div className="space-y-3">
                                <button
                                    onClick={() => handleOAuthProvider('google')}
                                    disabled={isLoading}
                                    className="w-full px-6 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 font-medium text-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span>Continue with Google</span>
                                </button>

                                <button
                                    onClick={() => handleOAuthProvider('github')}
                                    disabled={isLoading}
                                    className="w-full px-6 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 font-medium text-sm rounded-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg className="w-5 h-5 text-slate-200" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    <span>Continue with GitHub</span>
                                </button>

                                {isLoading && (
                                    <div className="flex items-center justify-center gap-2 text-slate-400 text-sm pt-4">
                                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>Processing</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Don't have account */}
                    <div className="mt-6 text-center">
                        <p className="text-slate-400 text-sm">
                            Don't have an account?{' '}
                            <Link href="/signup" className="text-teal-300 hover:text-teal-200 font-medium transition-colors">
                                Create one
                            </Link>
                        </p>
                    </div>
                    {/* Security Note */}
                    <div className="mt-6 flex items-start gap-2 text-xs text-slate-500 px-1">
                        <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Encrypted connection. Credentials are transmitted securely.</span>
                    </div>
                </div>
            </main>

            {/* Bottom Accent */}
            <div className="h-px bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />
        </div>
    );
};
