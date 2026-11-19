import React, { useState, useEffect, Component } from 'react';
import Navbar from './components/Navbar';
import WebgiRingViewer from './components/WebgiRingViewer';
import HeroSection from './components/HeroSection';
import DetailsSection from './components/DetailsSection';
import LoginRegisterSection from './components/LoginRegisterSection';
import Footer from './components/Footer';
import SidePagination from './components/SidePagination';
import KnowMoreModal from './components/KnowMoreModal';

// Dedicated boundary for 3D WebGL context safety
class WebGLViewerBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn('3D Ring Viewer recovery caught:', err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
          <div className="w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-3xl animate-pulse" />
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [isKnowMoreOpen, setIsKnowMoreOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Track scroll position for 3-dot pagination
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      const detailsEl = document.getElementById('details-section');
      const authEl = document.getElementById('auth-section');

      if (authEl && scrollY >= authEl.offsetTop - windowHeight * 0.45) {
        setActiveSection('auth-section');
      } else if (detailsEl && scrollY >= detailsEl.offsetTop - windowHeight * 0.45) {
        setActiveSection('details-section');
      } else {
        setActiveSection('hero');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`min-h-screen min-h-[100dvh] w-full relative transition-colors duration-700 overflow-x-hidden ${
        isDark ? 'text-[#FAF6F0] bg-[#8B1E2E]' : 'text-[#3E1821] bg-[#FBF4F5]'
      }`}
    >
      {/* 3D WebGL Photorealistic Background Jewellery Canvas - Exclusive Ring Showcase */}
      <WebGLViewerBoundary>
        <WebgiRingViewer isDark={isDark} />
      </WebGLViewerBoundary>

      {/* Clean Luxury Top Navbar */}
      <Navbar
        isDark={isDark}
        setIsDark={setIsDark}
        onOpenKnowMore={() => setIsKnowMoreOpen(true)}
        onScrollToAuth={() => scrollTo('auth-section')}
      />

      {/* Side 3-Dot Navigation */}
      <SidePagination
        activeSection={activeSection}
        isDark={isDark}
      />

      {/* Single Unified Screen Flow */}
      <main className="relative w-full z-10">
        {/* 1. Hero: DIKSHI JEWELLERY & 3D Interactive Ring Showcase */}
        <HeroSection
          isDark={isDark}
          onExploreClick={() => scrollTo('details-section')}
        />

        {/* 2. Some Details: The Artistry of DIKSHI Rings */}
        <DetailsSection
          isDark={isDark}
          onScrollToAuth={() => scrollTo('auth-section')}
        />

        {/* 3. Login / Register Box at the End of Screen */}
        <LoginRegisterSection
          isDark={isDark}
        />
      </main>

      {/* Footer */}
      <Footer isDark={isDark} />

      {/* Know More Modal Drawer */}
      <KnowMoreModal
        isOpen={isKnowMoreOpen}
        onClose={() => setIsKnowMoreOpen(false)}
        isDark={isDark}
      />
    </div>
  );
}
