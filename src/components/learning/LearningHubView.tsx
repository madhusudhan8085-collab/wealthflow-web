/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Video,
  ExternalLink,
  Play,
  Languages,
  CheckCircle,
  Sparkles,
  Award,
  GraduationCap,
  Layers,
  X,
} from 'lucide-react';
import { sound } from '../../utils/sound';

export type SupportedLanguage = 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'mr' | 'gu' | 'bn';

interface VarsityModule {
  id: string;
  title: string;
  chaptersCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  url: string;
  category: 'Investing' | 'Personal Finance' | 'Analysis' | 'Risk';
}

interface VideoLesson {
  id: string;
  title: string;
  duration: string;
  youtubeId: string;
  category: string;
  description: string;
  keyTakeaway: string;
}

export const LearningHubView: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage>('en');
  const [activeVideo, setActiveVideo] = useState<VideoLesson | null>(null);

  const languages: Array<{ code: SupportedLanguage; label: string; native: string }> = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  ];

  const varsityModules: VarsityModule[] = [
    {
      id: 'personal-finance',
      title: 'Personal Finance & Mutual Funds',
      chaptersCount: 30,
      difficulty: 'Beginner',
      category: 'Personal Finance',
      description:
        'Comprehensive curriculum on personal balance sheets, emergency funds, SIP mathematics, active vs passive mutual funds, and debt instruments.',
      url: 'https://zerodha.com/varsity/module/personal-finance/',
    },
    {
      id: 'stock-markets',
      title: 'Introduction to Stock Markets',
      chaptersCount: 15,
      difficulty: 'Beginner',
      category: 'Investing',
      description:
        'Fundamental foundations of capital markets, market regulators (SEBI, RBI), indices (Nifty, Sensex), corporate actions, and trading lifecycles.',
      url: 'https://zerodha.com/varsity/module/introduction-to-stock-markets/',
    },
    {
      id: 'fundamental-analysis',
      title: 'Fundamental Analysis of Equities',
      chaptersCount: 16,
      difficulty: 'Intermediate',
      category: 'Analysis',
      description:
        'Decoding annual reports, P&L, balance sheets, DCF valuations, and return on equity (ROE/ROCE) to identify resilient compounding businesses.',
      url: 'https://zerodha.com/varsity/module/fundamental-analysis/',
    },
    {
      id: 'risk-management',
      title: 'Risk Management & Asset Allocation',
      chaptersCount: 12,
      difficulty: 'Advanced',
      category: 'Risk',
      description:
        'Portfolio risk control, standard deviation, beta, Sharpe ratio, asset correlation, and rebalancing methodologies for long-term survival.',
      url: 'https://zerodha.com/varsity/module/risk-management/',
    },
  ];

  const videoLessons: VideoLesson[] = [
    {
      id: 'compounding-power',
      title: 'The Exponential Power of Compounding & Early SIPs',
      duration: '14 mins',
      youtubeId: 'p7HKvqRI_Bo', // Representative high quality educational video ID
      category: 'SIP & Compounding',
      description:
        'Why starting a ₹10,000 SIP at age 25 creates 3× more wealth by retirement than starting ₹25,000 at age 35. Detailed mathematical breakdown.',
      keyTakeaway: 'Time in the market dwarfs timing the market. The final 25% of your horizon generates >50% of total wealth.',
    },
    {
      id: 'step-up-sip',
      title: 'Step-Up SIP: How a 10% Annual Increase Doubles Your Corpus',
      duration: '11 mins',
      youtubeId: 'qgwJ2KSnN9M',
      category: 'Strategy',
      description:
        'Step-Up SIP matches your investment growth with salary increments, neutralizing lifestyle inflation and drastically reducing time to financial freedom.',
      keyTakeaway: 'Stepping up your SIP by just 10% each year can yield up to 80-100% higher terminal corpus compared to flat contributions.',
    },
    {
      id: 'swp-explained',
      title: 'SWP Explained: Creating a Tax-Efficient Monthly Retirement Pension',
      duration: '16 mins',
      youtubeId: 'S2p9zN8y9pQ',
      category: 'Retirement & SWP',
      description:
        'How Systematic Withdrawal Plans outperform traditional fixed deposits (FD) and annuities through capital gains taxation and perpetual capital preservation.',
      keyTakeaway: 'In SWP, only the capital gains fraction of your withdrawal is taxed, ensuring superior post-tax cashflow for retirees.',
    },
    {
      id: 'asset-allocation',
      title: 'Asset Allocation: Balancing Equity, Debt, and Gold Across Life Stages',
      duration: '18 mins',
      youtubeId: '3U4o7u7F6-I',
      category: 'Portfolio Construction',
      description:
        'Implementing the classic 100-minus-age rule and dynamic asset allocation to survive bear markets without panicking.',
      keyTakeaway: 'Asset allocation accounts for over 90% of long-term portfolio return variability and prevents catastrophic drawdowns.',
    },
  ];

  const localizedNotes: Record<SupportedLanguage, { headline: string; subtitle: string }> = {
    en: {
      headline: 'WealthFlow Financial Academy & Knowledge Hub',
      subtitle: 'Free, unbiased, and high-fidelity financial education powered by verified institutional curricula and masterclasses.',
    },
    hi: {
      headline: 'वेल्थफ्लो वित्तीय अकादमी एवं ज्ञान केंद्र',
      subtitle: 'सत्यापित पाठ्यक्रमों और विशेषज्ञों द्वारा तैयार की गई निष्पक्ष एवं उच्च-गुणवत्ता वाली वित्तीय शिक्षा।',
    },
    kn: {
      headline: 'ವೆಲ್ತ್‌ಫ್ಲೋ ಹಣಕಾಸು ಅಕಾಡೆಮಿ ಮತ್ತು ಜ್ಞಾನ ಕೇಂದ್ರ',
      subtitle: 'ಉಚಿತ ಮತ್ತು ನಿಷ್ಪಕ್ಷಪಾತ ಹಣಕಾಸು ಶಿಕ್ಷಣ. ಹೂಡಿಕೆ ಮತ್ತು ಸಂಪತ್ತು ನಿರ್ವಹಣೆಯ ಸಮಗ್ರ ಮಾರ್ಗದರ್ಶಿ.',
    },
    ta: {
      headline: 'வெல்த்ஃப்ளோ நிதி அகாடமி மற்றும் அறிவு மையம்',
      subtitle: 'முதலீடு மற்றும் நிதி திட்டமிடல் குறித்த நம்பகமான, இலவச கல்வி வழிகாட்டி.',
    },
    te: {
      headline: 'వెల్త్‌ఫ్లో ఆర్థిక అకాడమీ మరియు నాలెడ్జ్ హబ్',
      subtitle: 'పెట్టుబడులు, SIP మరియు పదవీ విరమణ ప్రణాళికపై నిష్పాక్షికమైన నాణ్యమైన విద్యా వనరులు.',
    },
    mr: {
      headline: 'वेल्थफ्लो वित्तीय अकादमी आणि ज्ञान केंद्र',
      subtitle: 'गुंतवणूक, एसआयपी आणि आर्थिक नियोजनासाठी मोफत आणि विश्वासार्ह अभ्यासक्रम.',
    },
    gu: {
      headline: 'વેલ્થફ્લો ફાઇનાન્સિયલ એકેડેમી અને જ્ઞાન કેન્દ્ર',
      subtitle: 'રોકાણ અને સંપત્તિ નિર્માણ માટે નિષ્પક્ષ અને સચોટ નાણાકીય શિક્ષણ.',
    },
    bn: {
      headline: 'ওয়েলথফ্লো ফিনান্সিয়াল একাডেমি ও জ্ঞান কেন্দ্র',
      subtitle: 'বিনিয়োগ ও সম্পদ বৃদ্ধির জন্য নিরপেক্ষ ও নির্ভরযোগ্য আর্থিক শিক্ষার কেন্দ্র।',
    },
  };

  const currentText = localizedNotes[selectedLang] || localizedNotes.en;

  return (
    <div id="learning-hub-view" className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-700/60">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Financial Literacy & Wealth Mastery
            </span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">{currentText.headline}</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">{currentText.subtitle}</p>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/10">
            <Languages className="w-4 h-4 text-indigo-300 ml-1.5" />
            <select
              id="learning-language-select"
              value={selectedLang}
              onChange={(e) => {
                sound.playClick();
                setSelectedLang(e.target.value as SupportedLanguage);
              }}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none pr-2 cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                  {l.native} ({l.label})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-4 p-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
                  {activeVideo.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">{activeVideo.title}</h3>
              </div>
              <button
                id="close-video-modal-btn"
                type="button"
                onClick={() => setActiveVideo(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded 16:9 Iframe */}
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-800">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <p className="leading-relaxed">{activeVideo.description}</p>
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-emerald-300 font-medium">
                <strong>Key Takeaway:</strong> {activeVideo.keyTakeaway}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <a
                href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Watch on YouTube</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Zerodha Varsity Curriculum */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Zerodha Varsity Comprehensive Modules
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                India&apos;s most respected open-access financial market curriculum
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
            Open Access
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {varsityModules.map((module) => (
            <div
              key={module.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {module.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500 dark:text-slate-400">
                      {module.chaptersCount} Chapters
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                      {module.difficulty}
                    </span>
                  </div>
                </div>

                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {module.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {module.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Official Certification Ready</span>
                <a
                  href={module.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
                >
                  <span>Open on Varsity</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Video Masterclasses */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Curated Financial Masterclasses & Video Tutorials
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visual lessons breaking down core math concepts, compounding dynamics, and SWP longevity
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-800">
            Interactive Video
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {videoLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Thumbnail Placeholder with Play Overlay */}
              <div
                onClick={() => {
                  sound.playSuccess();
                  setActiveVideo(lesson);
                }}
                className="relative aspect-video bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center cursor-pointer group-hover:opacity-95 transition-all overflow-hidden"
              >
                <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 ml-0.5 fill-white" />
                </div>
                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                  {lesson.duration}
                </span>
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-600/90 text-[10px] font-bold text-white uppercase tracking-wider">
                  {lesson.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    {lesson.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {lesson.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    sound.playSuccess();
                    setActiveVideo(lesson);
                  }}
                  className="w-full text-center text-xs font-semibold py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Masterclass</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
