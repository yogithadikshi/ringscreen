import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, User, Check } from 'lucide-react';
import { luxuryAudio } from '../utils/audio';

export default function LoginRegisterSection({ isDark = false, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const headingColor = isDark ? 'text-[#FAF6F0]' : 'text-[#3E1821]';
  const subtextColor = isDark ? 'text-[#FAF6F0]/85' : 'text-[#3E1821]/80';
  const cardBg = isDark
    ? 'bg-black/35 border-white/20 shadow-2xl backdrop-blur-2xl text-[#FAF6F0]'
    : 'bg-white/80 border-[#3E1821]/15 shadow-2xl backdrop-blur-2xl text-[#3E1821]';

  const handleSubmit = (e) => {
    e.preventDefault();
    luxuryAudio.playShimmer();

    const user = {
      name: activeTab === 'register' ? fullName || 'Elena Rostova' : email.split('@')[0] || 'VIP Member',
      email: email || 'vip@dikshijewellery.com',
    };

    setSuccessMsg(activeTab === 'register' ? 'VIP Membership Activated Successfully' : 'Signed In to Your Vault Successfully');

    if (onLoginSuccess) {
      onLoginSuccess(user);
    }

    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  return (
    <section 
      id="auth-section"
      className="relative min-h-screen min-h-[100dvh] w-full flex items-center justify-center py-10 sm:py-16 lg:py-20 3xl:py-28 px-3 xs:px-5 sm:px-8 lg:px-14 xl:px-20 2xl:px-28 4xl:px-36 pt-[max(4.5rem,env(safe-area-inset-top,0px))] pb-[max(3rem,env(safe-area-inset-bottom,0px))] transition-colors duration-700 pointer-events-auto overflow-hidden"
    >
      <div className="max-w-7xl 2xl:max-w-[1600px] 3xl:max-w-[1920px] 4xl:max-w-[2400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-12 items-center">
        
        {/* On Mobile & Tablet Portrait: Reserved upper viewport space for the 3D Ring */}
        <div className="w-full h-[40vh] xs:h-[44vh] sm:h-[44vh] max-h-[400px] lg:hidden landscape:hidden flex-shrink-0 pointer-events-none" />

        {/* On Desktop & Ultrawide: Left Column spacer for 3D Ring on FULL LEFT */}
        <div className="hidden lg:block lg:col-span-6 xl:col-span-6 2xl:col-span-6 pointer-events-none min-h-[400px] 2xl:min-h-[500px] 3xl:min-h-[600px]" />

        {/* Right Column: Section Header & Login / Register Box on the RIGHT SIDE */}
        <div className="w-full lg:col-span-6 xl:col-span-6 2xl:col-span-6 flex flex-col items-center lg:items-end space-y-3.5 sm:space-y-6 relative z-10 max-w-md sm:max-w-lg lg:max-w-[440px] xl:max-w-[480px] 2xl:max-w-[520px] 3xl:max-w-[560px] mx-auto lg:mr-0 lg:ml-auto">
          
          {/* Section Header */}
          <div className="text-center lg:text-left space-y-2 sm:space-y-2.5 w-full">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full border border-current/15 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[9.5px] xs:text-[10px] sm:text-[11px] 3xl:text-xs uppercase tracking-[0.28em] font-semibold opacity-80">
                Clientèle Access
              </span>
            </div>

            <h2 className={`font-serif-luxury text-xl xs:text-2xl sm:text-4xl lg:text-5xl 3xl:text-6xl tracking-tight uppercase ${headingColor}`}>
              MAISON VAULT
            </h2>

            <p className={`font-sans-luxury text-xs xs:text-[13px] sm:text-sm 2xl:text-base 3xl:text-lg leading-relaxed max-w-sm sm:max-w-md 2xl:max-w-lg ${subtextColor}`}>
              Sign in or create your private VIP account to access exclusive jewellery showcases, custom atelier orders, and private concierge services.
            </p>
          </div>

          {/* Embedded Login / Register Box */}
          <div className={`w-full p-4 xs:p-6 sm:p-7 lg:p-8 xl:p-9 3xl:p-10 rounded-3xl border transition-all duration-500 ${cardBg}`}>
            
            {/* Tab Switcher */}
            <div className="flex items-center p-1 rounded-full border border-current/20 mb-5 sm:mb-8 backdrop-blur-md">
              <button
                type="button"
                onClick={() => {
                  luxuryAudio.playClick();
                  setActiveTab('login');
                  setSuccessMsg('');
                }}
                className={`w-1/2 py-2 sm:py-2.5 rounded-full text-[10px] xs:text-[11px] sm:text-xs 3xl:text-sm uppercase tracking-[0.18em] font-semibold transition-all duration-300 min-h-[38px] ${
                  activeTab === 'login'
                    ? isDark
                      ? 'bg-[#FAF6F0] text-[#8B1E2E] shadow-md'
                      : 'bg-[#3E1821] text-[#FAF6F0] shadow-md'
                    : isDark
                      ? 'text-[#FAF6F0]/70 hover:text-[#FAF6F0]'
                      : 'text-[#3E1821]/70 hover:text-[#3E1821]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  luxuryAudio.playClick();
                  setActiveTab('register');
                  setSuccessMsg('');
                }}
                className={`w-1/2 py-2 sm:py-2.5 rounded-full text-[10px] xs:text-[11px] sm:text-xs 3xl:text-sm uppercase tracking-[0.18em] font-semibold transition-all duration-300 min-h-[38px] ${
                  activeTab === 'register'
                    ? isDark
                      ? 'bg-[#FAF6F0] text-[#8B1E2E] shadow-md'
                    : 'bg-[#3E1821] text-[#FAF6F0] shadow-md'
                    : isDark
                      ? 'text-[#FAF6F0]/70 hover:text-[#FAF6F0]'
                      : 'text-[#3E1821]/70 hover:text-[#3E1821]'
                }`}
              >
                Register
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-5">
              {activeTab === 'register' && (
                <div className="space-y-1.5">
                  <label className="text-[9.5px] xs:text-[10px] sm:text-[11px] 3xl:text-xs uppercase tracking-[0.18em] font-semibold opacity-75 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-60" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full pl-9 sm:pl-10 pr-3.5 sm:pr-4 py-2.5 sm:py-3 rounded-2xl border border-current/20 bg-white/20 dark:bg-black/30 backdrop-blur-md text-[16px] sm:text-xs 2xl:text-sm 3xl:text-base focus:outline-none focus:border-amber-500 placeholder:opacity-50"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[9.5px] xs:text-[10px] sm:text-[11px] 3xl:text-xs uppercase tracking-[0.18em] font-semibold opacity-75 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-60" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@luxuryvault.com"
                    className="w-full pl-9 sm:pl-10 pr-3.5 sm:pr-4 py-2.5 sm:py-3 rounded-2xl border border-current/20 bg-white/20 dark:bg-black/30 backdrop-blur-md text-[16px] sm:text-xs 2xl:text-sm 3xl:text-base focus:outline-none focus:border-amber-500 placeholder:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[9.5px] xs:text-[10px] sm:text-[11px] 3xl:text-xs uppercase tracking-[0.18em] font-semibold opacity-75">
                    Password
                  </label>
                  {activeTab === 'login' && (
                    <button
                      type="button"
                      onClick={() => luxuryAudio.playClick()}
                      className="text-[9.5px] xs:text-[10px] uppercase tracking-wider opacity-60 hover:opacity-100 hover:underline py-1"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-60" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-9 sm:pl-10 pr-3.5 sm:pr-4 py-2.5 sm:py-3 rounded-2xl border border-current/20 bg-white/20 dark:bg-black/30 backdrop-blur-md text-[16px] sm:text-xs 2xl:text-sm 3xl:text-base focus:outline-none focus:border-amber-500 placeholder:opacity-50"
                  />
                </div>
              </div>

              {/* Remember Me checkbox */}
              <div className="flex items-center pt-1">
                <label className="flex items-center gap-2 text-xs cursor-pointer select-none opacity-80 min-h-[32px]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-0 w-4 h-4"
                  />
                  <span className="text-[10.5px] xs:text-[11px] sm:text-xs">Remember me</span>
                </label>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                className={`w-full py-3 xs:py-3.5 sm:py-4 mt-2 rounded-full text-xs 3xl:text-sm uppercase tracking-[0.22em] font-semibold transition-all duration-300 shadow-xl active:scale-95 min-h-[44px] ${
                  successMsg
                    ? 'bg-emerald-600 text-white'
                    : isDark
                      ? 'bg-[#FAF6F0] text-[#8B1E2E] hover:bg-white hover:shadow-2xl shadow-lg'
                      : 'bg-[#3E1821] text-[#FAF6F0] hover:bg-[#250d14] hover:shadow-2xl shadow-lg'
                }`}
              >
                {successMsg ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> {successMsg}
                  </span>
                ) : activeTab === 'login' ? (
                  'Sign In to Vault'
                ) : (
                  'Register VIP Membership'
                )}
              </button>
            </form>

          </div>

        </div>

      </div>
    </section>
  );
}
