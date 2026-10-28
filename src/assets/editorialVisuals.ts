/**
 * Official NaviBihar India (NBI News) Logo & Custom Editorial News Illustrations
 * Ensures zero broken images, fast mobile loading, and topic-specific visuals.
 */

export const NBI_LOGO_URL = '/assets/aistudio/IMG-20261028-WA0002_67f47005.jpg';

function createEditorialSvg(config: {
  bgStart: string;
  bgEnd: string;
  accent: string;
  kicker: string;
  headline: string;
  subline: string;
  illustration: string;
}): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${config.bgStart}" />
        <stop offset="100%" stop-color="${config.bgEnd}" />
      </linearGradient>
      <linearGradient id="scrim" x1="0%" y1="10%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#000000" stop-opacity="0.05" />
        <stop offset="65%" stop-color="#090D16" stop-opacity="0.55" />
        <stop offset="100%" stop-color="#090D16" stop-opacity="0.92" />
      </linearGradient>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ffffff" stroke-width="1" stroke-opacity="0.06" />
      </pattern>
    </defs>
    <rect width="1200" height="675" fill="url(#bg)" />
    <rect width="1200" height="675" fill="url(#grid)" />
    ${config.illustration}
    <rect width="1200" height="675" fill="url(#scrim)" />
    <!-- Top Editorial Watermark Strip -->
    <g transform="translate(56, 44)">
      <rect x="0" y="0" width="140" height="34" rx="4" fill="${config.accent}" />
      <text x="70" y="23" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="15" font-weight="800" letter-spacing="1.5">NBI NEWS</text>
      <text x="158" y="23" fill="#E2E8F0" font-family="sans-serif" font-size="15" font-weight="600" letter-spacing="1">${config.kicker}</text>
    </g>
    <!-- Bottom Visual Summary Graphic -->
    <g transform="translate(56, 515)">
      <rect x="0" y="0" width="72" height="5" fill="${config.accent}" />
      <text x="0" y="46" fill="#FFFFFF" font-family="sans-serif" font-size="34" font-weight="800">${config.headline}</text>
      <text x="0" y="86" fill="#CBD5E1" font-family="sans-serif" font-size="21" font-weight="500">${config.subline}</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const EDITORIAL_IMAGES = {
  patnaMetro: createEditorialSvg({
    bgStart: '#0F172A',
    bgEnd: '#1E3A8A',
    accent: '#C8102E',
    kicker: 'BIHAR INFRASTRUCTURE · PATNA',
    headline: 'पटना मेट्रो और एक्सप्रेसवे प्रोजेक्ट रफ्तार पर',
    subline: 'बिहार के शहरों को जोड़ने वाला आधुनिक ट्रांसपोर्ट नेटवर्क',
    illustration: `
      <circle cx="950" cy="180" r="190" fill="#F59E0B" fill-opacity="0.16" />
      <!-- Bridge Pillars & Viaduct -->
      <path d="M0 370 L1200 310 L1200 355 L0 415 Z" fill="#334155" />
      <rect x="180" y="395" width="38" height="190" fill="#1E293B" />
      <rect x="520" y="375" width="38" height="210" fill="#1E293B" />
      <rect x="860" y="355" width="38" height="230" fill="#1E293B" />
      <!-- Sleek Metro Train -->
      <g transform="translate(220, 275) rotate(-2.8)">
        <rect x="0" y="0" width="740" height="72" rx="22" fill="#F8FAFC" />
        <rect x="0" y="48" width="740" height="12" fill="#C8102E" />
        <rect x="45" y="14" width="95" height="28" rx="5" fill="#0F172A" />
        <rect x="165" y="14" width="95" height="28" rx="5" fill="#0F172A" />
        <rect x="285" y="14" width="95" height="28" rx="5" fill="#0F172A" />
        <rect x="405" y="14" width="95" height="28" rx="5" fill="#0F172A" />
        <rect x="525" y="14" width="95" height="28" rx="5" fill="#0F172A" />
        <circle cx="715" cy="36" r="10" fill="#FBBF24" />
      </g>
    `,
  }),

  biharPolitics: createEditorialSvg({
    bgStart: '#18181B',
    bgEnd: '#450A0A',
    accent: '#C8102E',
    kicker: 'POLITICAL DESK · VIDHAN SABHA',
    headline: 'बिहार विधानसभा और सियासी हलचल पर विशेष रिपोर्ट',
    subline: 'पटना से दिल्ली तक गठबंधन और नीतिगत फैसलों का विश्लेषण',
    illustration: `
      <!-- Classical Parliament / Assembly Dome Silhouette -->
      <g transform="translate(340, 95)">
        <path d="M160 180 C160 70, 360 70, 360 180 Z" fill="#E2E8F0" fill-opacity="0.22" />
        <rect x="256" y="40" width="8" height="55" fill="#F59E0B" />
        <rect x="90" y="180" width="340" height="28" fill="#CBD5E1" fill-opacity="0.28" />
        <rect x="115" y="208" width="24" height="145" fill="#94A3B8" fill-opacity="0.25" />
        <rect x="175" y="208" width="24" height="145" fill="#94A3B8" fill-opacity="0.25" />
        <rect x="248" y="208" width="24" height="145" fill="#94A3B8" fill-opacity="0.25" />
        <rect x="320" y="208" width="24" height="145" fill="#94A3B8" fill-opacity="0.25" />
        <rect x="380" y="208" width="24" height="145" fill="#94A3B8" fill-opacity="0.25" />
        <rect x="60" y="353" width="400" height="32" fill="#E2E8F0" fill-opacity="0.3" />
      </g>
    `,
  }),

  bpscEducation: createEditorialSvg({
    bgStart: '#064E3B',
    bgEnd: '#0F172A',
    accent: '#D97706',
    kicker: 'EDUCATION & EXAMS · BIHAR',
    headline: 'शिक्षा विभाग और परीक्षा कैलेंडर पर बड़ा अपडेट',
    subline: 'छात्रों, विश्वविद्यालयों और शिक्षक भर्ती से जुड़ी आधिकारिक जानकारी',
    illustration: `
      <g transform="translate(650, 120)">
        <rect x="0" y="30" width="380" height="250" rx="16" fill="#FFFFFF" fill-opacity="0.12" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="2" />
        <line x1="40" y1="85" x2="260" y2="85" stroke="#FBBF24" stroke-width="10" stroke-linecap="round" />
        <line x1="40" y1="130" x2="320" y2="130" stroke="#E2E8F0" stroke-width="6" stroke-linecap="round" stroke-opacity="0.7" />
        <line x1="40" y1="165" x2="290" y2="165" stroke="#E2E8F0" stroke-width="6" stroke-linecap="round" stroke-opacity="0.7" />
        <line x1="40" y1="200" x2="220" y2="200" stroke="#E2E8F0" stroke-width="6" stroke-linecap="round" stroke-opacity="0.7" />
        <circle cx="310" cy="215" r="32" fill="#10B981" fill-opacity="0.85" />
        <path d="M296 215 L306 225 L326 205" fill="none" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" />
      </g>
    `,
  }),

  rozgarJobs: createEditorialSvg({
    bgStart: '#1E1B4B',
    bgEnd: '#0F172A',
    accent: '#C8102E',
    kicker: 'EMPLOYMENT & CAREER · ROZGAR',
    headline: 'युवाओं के लिए नई भर्ती और रोजगार के अवसर',
    subline: 'सरकारी विभागों और औद्योगिक इकाइयों में नियुक्ति प्रक्रिया तेज',
    illustration: `
      <g transform="translate(680, 110)">
        <rect x="20" y="60" width="340" height="220" rx="18" fill="#312E81" stroke="#818CF8" stroke-width="3" />
        <path d="M130 60 L130 30 C130 18, 250 18, 250 30 L250 60" fill="none" stroke="#818CF8" stroke-width="8" />
        <rect x="155" y="145" width="70" height="40" rx="6" fill="#F59E0B" />
        <line x1="20" y1="165" x2="155" y2="165" stroke="#818CF8" stroke-width="4" />
        <line x1="225" y1="165" x2="360" y2="165" stroke="#818CF8" stroke-width="4" />
      </g>
    `,
  }),

  crimeAlert: createEditorialSvg({
    bgStart: '#090D16',
    bgEnd: '#3B0712',
    accent: '#DC2626',
    kicker: 'CRIME & INVESTIGATION · SIT REPORT',
    headline: 'साइबर सुरक्षा और कानून-व्यवस्था पर पुलिस की सख्त कार्रवाई',
    subline: 'विशेष जांच दल (SIT) और जिलों में हाई-टेक निगरानी अभियान',
    illustration: `
      <g transform="translate(720, 110)">
        <circle cx="160" cy="150" r="120" fill="#DC2626" fill-opacity="0.18" />
        <circle cx="160" cy="150" r="80" fill="none" stroke="#EF4444" stroke-width="4" stroke-dasharray="18 10" />
        <path d="M160 65 L230 98 L230 160 C230 205, 160 238, 160 238 C160 238, 90 205, 90 160 L90 98 Z" fill="#1E293B" stroke="#F87171" stroke-width="4" />
        <rect x="154" y="115" width="12" height="48" rx="4" fill="#F87171" />
        <circle cx="160" cy="182" r="7" fill="#F87171" />
      </g>
    `,
  }),

  nationalIndia: createEditorialSvg({
    bgStart: '#0F172A',
    bgEnd: '#1E293B',
    accent: '#EA580C',
    kicker: 'NATIONAL DESK · NEW DELHI',
    headline: 'राष्ट्रीय बुनियादी ढांचा और आर्थिक विकास पर केंद्र का बड़ा कदम',
    subline: 'हाई-स्पीड रेल कॉरिडोर, डिजिटल इंडिया और राज्यों के लिए विशेष पैकेज',
    illustration: `
      <!-- Tricolor Inspired Ribbons & Skyline -->
      <path d="M550 80 Q850 180 1200 90" fill="none" stroke="#F97316" stroke-width="14" stroke-opacity="0.6" />
      <path d="M550 110 Q850 210 1200 120" fill="none" stroke="#FFFFFF" stroke-width="14" stroke-opacity="0.5" />
      <path d="M550 140 Q850 240 1200 150" fill="none" stroke="#16A34A" stroke-width="14" stroke-opacity="0.6" />
      <g transform="translate(720, 210)">
        <rect x="0" y="90" width="55" height="160" fill="#334155" />
        <rect x="70" y="40" width="65" height="210" fill="#475569" />
        <rect x="150" y="10" width="75" height="240" fill="#64748B" />
        <rect x="240" y="65" width="60" height="185" fill="#334155" />
      </g>
    `,
  }),

  sportsCricket: createEditorialSvg({
    bgStart: '#022C22',
    bgEnd: '#0F172A',
    accent: '#C8102E',
    kicker: 'SPORTS DESK · CRICKET & ATHLETICS',
    headline: 'भारतीय क्रिकेट टीम और युवा खिलाड़ियों का शानदार प्रदर्शन',
    subline: 'अंतरराष्ट्रीय सीरीज और घरेलू टूर्नामेंट में बिहार के खिलाड़ियों की चमक',
    illustration: `
      <g transform="translate(700, 100)">
        <circle cx="190" cy="160" r="135" fill="#10B981" fill-opacity="0.15" stroke="#34D399" stroke-width="2" />
        <!-- Cricket Ball & Stumps Graphic -->
        <rect x="145" y="95" width="10" height="135" rx="3" fill="#FBBF24" />
        <rect x="175" y="95" width="10" height="135" rx="3" fill="#FBBF24" />
        <rect x="205" y="95" width="10" height="135" rx="3" fill="#FBBF24" />
        <rect x="142" y="86" width="35" height="7" rx="2" fill="#FDE68A" />
        <rect x="182" y="86" width="35" height="7" rx="2" fill="#FDE68A" />
        <circle cx="265" cy="185" r="36" fill="#DC2626" stroke="#FCA5A5" stroke-width="3" />
        <path d="M240 162 Q265 185 290 208" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="5 4" />
      </g>
    `,
  }),

  techDigital: createEditorialSvg({
    bgStart: '#090D16',
    bgEnd: '#0C4A6E',
    accent: '#0284C7',
    kicker: 'TECHNOLOGY & AI · DIGITAL INDIA',
    headline: 'एआई (AI), 5G विस्तार और साइबर सुरक्षा के नए फीचर्स',
    subline: 'स्मार्टफोन यूजर्स, डिजिटल पेमेंट और स्टार्टअप सेक्टर के लिए जरूरी अपडेट',
    illustration: `
      <g transform="translate(690, 105)">
        <rect x="60" y="40" width="240" height="240" rx="28" fill="#0369A1" fill-opacity="0.3" stroke="#38BDF8" stroke-width="3" />
        <rect x="110" y="90" width="140" height="140" rx="16" fill="#0284C7" fill-opacity="0.45" stroke="#7DD3FC" stroke-width="2" />
        <text x="180" y="175" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-size="48" font-weight="800">AI</text>
        <line x1="10" y1="100" x2="60" y2="100" stroke="#38BDF8" stroke-width="4" />
        <line x1="10" y1="160" x2="60" y2="160" stroke="#38BDF8" stroke-width="4" />
        <line x1="10" y1="220" x2="60" y2="220" stroke="#38BDF8" stroke-width="4" />
        <line x1="300" y1="100" x2="350" y2="100" stroke="#38BDF8" stroke-width="4" />
        <line x1="300" y1="160" x2="350" y2="160" stroke="#38BDF8" stroke-width="4" />
        <line x1="300" y1="220" x2="350" y2="220" stroke="#38BDF8" stroke-width="4" />
      </g>
    `,
  }),

  businessEconomy: createEditorialSvg({
    bgStart: '#0F172A',
    bgEnd: '#1E293B',
    accent: '#16A34A',
    kicker: 'BUSINESS & ECONOMY · MARKET',
    headline: 'बिहार औद्योगिक निवेश, व्यापार और बाजार के ताज़ा रुझान',
    subline: 'फूड प्रोसेसिंग, आईटी पार्क, एमएसएमई (MSME) और शेयर बाजार अपडेट',
    illustration: `
      <g transform="translate(660, 130)">
        <rect x="30" y="160" width="45" height="90" rx="6" fill="#334155" />
        <rect x="100" y="120" width="45" height="130" rx="6" fill="#475569" />
        <rect x="170" y="85" width="45" height="165" rx="6" fill="#64748B" />
        <rect x="240" y="45" width="45" height="205" rx="6" fill="#10B981" />
        <rect x="310" y="10" width="45" height="240" rx="6" fill="#22C55E" />
        <path d="M45 140 L120 100 L190 65 L260 30 L330 0" fill="none" stroke="#FBBF24" stroke-width="6" stroke-linecap="round" />
      </g>
    `,
  }),

  entertainmentCinema: createEditorialSvg({
    bgStart: '#2E1065',
    bgEnd: '#4C0519',
    accent: '#E11D48',
    kicker: 'ENTERTAINMENT & CULTURE · CINEMA',
    headline: 'सिनेमा, ओटीटी और बिहार की लोक संस्कृति को नई पहचान',
    subline: 'फिल्म निर्माण नीति, क्षेत्रीय कलाकारों और बड़े पर्दे की प्रमुख खबरें',
    illustration: `
      <g transform="translate(700, 115)">
        <circle cx="170" cy="150" r="115" fill="#F43F5E" fill-opacity="0.18" stroke="#FB7185" stroke-width="3" />
        <polygon points="145,105 145,195 220,150" fill="#FFFFFF" />
        <circle cx="95" cy="80" r="16" fill="#FBBF24" fill-opacity="0.7" />
        <circle cx="260" cy="95" r="12" fill="#FBBF24" fill-opacity="0.7" />
      </g>
    `,
  }),

  viralSocial: createEditorialSvg({
    bgStart: '#431407',
    bgEnd: '#0F172A',
    accent: '#EA580C',
    kicker: 'VIRAL & GROUND REPORT · TRENDING',
    headline: 'सोशल मीडिया पर चर्चा में बिहार के युवाओं की अनोखी पहल',
    subline: 'ग्राउंड रिपोर्ट और प्रेरणादायक कहानियां जो बन रहीं सुर्खियां',
    illustration: `
      <g transform="translate(710, 115)">
        <rect x="40" y="30" width="260" height="190" rx="24" fill="#EA580C" fill-opacity="0.25" stroke="#FB923C" stroke-width="3" />
        <path d="M110 220 L95 265 L155 220 Z" fill="#FB923C" />
        <text x="170" y="142" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-size="42" font-weight="800">#TRENDING</text>
      </g>
    `,
  }),
};
