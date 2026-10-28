import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { BrandLogo } from '../components/EditorialImage';
import { useNews } from '../context/NewsContext';

const INFO_CONTENT: Record<
  string,
  { title: string; subtitle: string; paragraphs: string[] }
> = {
  about: {
    title: 'About NaviBihar India (हमारे बारे में)',
    subtitle: 'NBI News — बिहार और देश की निष्पक्ष, तेज़ और विश्वसनीय डिजिटल आवाज',
    paragraphs: [
      'NaviBihar India (NBI News) एक आधुनिक, मोबाइल-फर्स्ट भारतीय डिजिटल न्यूज़ संगठन है, जिसका उद्देश्य बिहार के सभी 38 जिलों और देश के कोने-कोने से जुड़ी जनसरोकार की खबरों को पूरी प्रामाणिकता के साथ पाठकों तक पहुंचाना है।',
      'हमारा संपादकीय फोकस केवल सुर्खियां बटोरना नहीं, बल्कि शिक्षा, युवा रोजगार, बुनियादी ढांचे, शासन-प्रशासन और आम नागरिक के अधिकारों से जुड़े विषयों का गहराई से विश्लेषण करना है।',
      'पटना स्थित हमारे मुख्य संपादकीय डेस्क और सभी जिलों में सक्रिय संवाददाताओं के नेटवर्क के माध्यम से हम 24×7 तथ्यपरक पत्रकारिता के लिए प्रतिबद्ध हैं।',
    ],
  },
  contact: {
    title: 'Contact Us (संपर्क करें)',
    subtitle: 'समाचार, सुझाव, प्रेस विज्ञप्ति या फीडबैक के लिए हमसे जुड़ें',
    paragraphs: [
      'मुख्य संपादकीय कार्यालय: NaviBihar India (NBI News), बेली रोड, पटना, बिहार – 800001',
      'ईमेल (Editorial Desk): editor@navibiharindia.com',
      'विज्ञापन एवं पार्टनरशिप (Advertisement Desk): ads@navibiharindia.com',
      'हेल्पलाइन / न्यूज़ टिप फोन: +91 612-2200108 (सुबह 9:00 बजे से रात 9:00 बजे तक)',
    ],
  },
  'editorial-policy': {
    title: 'Editorial Policy (संपादकीय नीति)',
    subtitle: 'सत्यता, निष्पक्षता और जवाबदेही के सिद्धांत',
    paragraphs: [
      'NaviBihar India (NBI News) में प्रकाशित प्रत्येक खबर को प्रकाशन से पूर्व दो-स्तरीय फैक्ट-चेक प्रक्रिया से गुजारा जाता है। हम किसी भी अपुष्ट अफवाह या भ्रामक दावे को बिना आधिकारिक पुष्टि के प्रकाशित नहीं करते।',
      'यदि किसी खबर में कोई तथ्यात्मक त्रुटि संज्ञान में आती है, तो हमारी संपादकीय टीम उसे तुरंत संशोधित कर स्पष्ट अपडेट नोट जोड़ती है।',
    ],
  },
  'privacy-policy': {
    title: 'Privacy Policy (गोपनीयता नीति)',
    subtitle: 'पाठकों की निजता और डेटा सुरक्षा के प्रति हमारी प्रतिबद्धता',
    paragraphs: [
      'NaviBihar India अपने पाठकों की गोपनीयता का पूर्ण सम्मान करता है। हम आपकी अनुमति के बिना कोई भी व्यक्तिगत संवेदनशील जानकारी किसी तीसरे पक्ष के साथ साझा नहीं करते।',
      'बेहतर यूजर अनुभव और साइट परफॉर्मेंस के लिए केवल आवश्यक तकनीकी कुकीज़ और एनालिटिक्स का उपयोग किया जाता है।',
    ],
  },
  terms: {
    title: 'Terms and Conditions (नियम एवं शर्तें)',
    subtitle: 'वेबसाइट उपयोग की शर्तें और कॉपीराइट नियम',
    paragraphs: [
      'इस वेबसाइट पर उपलब्ध सभी समाचार, लोगो (NaviBihar India / NBI News), ग्राफिक्स और वीडियो सामग्री कॉपीराइट कानूनों के तहत सुरक्षित हैं।',
      'बिना पूर्व लिखित अनुमति के हमारी सामग्री का व्यावसायिक पुनर्प्रकाशन वर्जित है।',
    ],
  },
  disclaimer: {
    title: 'Disclaimer (अस्वीकरण)',
    subtitle: 'सूचना एवं संपादकीय अस्वीकरण',
    paragraphs: [
      'NaviBihar India पर प्रकाशित समाचार और आलेख आधिकारिक स्रोतों, संवाददाताओं और जनसूचना पर आधारित होते हैं। किसी भी सरकारी भर्ती या परीक्षा के लिए संबंधित आयोग की आधिकारिक वेबसाइट का भी मिलान अवश्य करें।',
    ],
  },
  advertisement: {
    title: 'Advertisement With Us (विज्ञापन दें)',
    subtitle: 'बिहार और देश के लाखों डिजिटल पाठकों तक अपने ब्रांड को पहुंचाएं',
    paragraphs: [
      'NaviBihar India (NBI News) के मोबाइल-फर्स्ट प्लेटफॉर्म पर बैनर विज्ञापन, प्रायोजित लेख, शिक्षा-कैंपस फीचर और वीडियो स्पॉन्सरशिप के लिए हमारे मार्केटिंग डेस्क से संपर्क करें: ads@navibiharindia.com',
    ],
  },
};

export function InfoPage() {
  const { slug = 'about' } = useParams<{ slug: string }>();
  const { settings } = useNews();
  const page = INFO_CONTENT[slug] || INFO_CONTENT.about;

  return (
    <>
      <SEOHead
        title={`${page.title} — NaviBihar India (NBI News)`}
        description={page.subtitle}
        canonicalPath={`/info/${slug}`}
      />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-200">
            <BrandLogo size="md" />
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950">
                {page.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {page.subtitle}
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
            {page.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              आधिकारिक ईमेल: <strong>{settings.contactEmail}</strong> · फोन:{' '}
              <strong>{settings.contactPhone}</strong>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 font-bold text-[#C8102E] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>होम पेज पर लौटें</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
