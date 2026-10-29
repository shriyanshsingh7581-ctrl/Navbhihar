import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, MapPin, Phone } from 'lucide-react';
import { SEOHead } from '../components/SEOHead';
import { BrandLogo } from '../components/EditorialImage';
import { useNews } from '../context/NewsContext';

const INFO_CONTENT: Record<
  string,
  { title: string; subtitle: string; paragraphs: string[] }
> = {
  about: {
    title: 'About NavBihar India News (हमारे बारे में)',
    subtitle: 'NBI (NavBihar India News) — बिहार और देश की निष्पक्ष, तेज़ और विश्वसनीय डिजिटल आवाज',
    paragraphs: [
      'NavBihar India News (NBI) एक आधुनिक, मोबाइल-फर्स्ट भारतीय डिजिटल न्यूज़ संगठन है, जिसका मुख्यालय अररिया (बिहार) में स्थित है। हमारा उद्देश्य सीमांचल, कोसी, मिथिलांचल और पटना सहित बिहार के सभी 38 जिलों तथा देश के कोने-कोने से जुड़ी जनसरोकार की खबरों को पूरी प्रामाणिकता के साथ पाठकों तक पहुंचाना है।',
      'हमारा संपादकीय फोकस केवल सुर्खियां बटोरना नहीं, बल्कि शिक्षा, युवा रोजगार, बुनियादी ढांचे, शासन-प्रशासन और आम नागरिक के अधिकारों से जुड़े विषयों का गहराई से विश्लेषण करना है।',
      'आप हमारे आधिकारिक Facebook, YouTube (@NBIndianews), Instagram (@nbindianews) और WhatsApp चैनल से जुड़कर हर ताज़ा अपडेट अपने मोबाइल पर प्राप्त कर सकते हैं।',
    ],
  },
  contact: {
    title: 'Contact Us (संपर्क करें)',
    subtitle: 'समाचार, विज्ञापन, प्रेस विज्ञप्ति या सुझाव के लिए NBI डेस्क से जुड़ें',
    paragraphs: [
      'मुख्य कार्यालय पता (Address): Araria, Bihar (अररिया, बिहार)',
      'संपर्क एवं व्हाट्सएप नंबर (Contact No): +91 9162432466',
      'Facebook Page: https://www.facebook.com/NavBiharIndiaNews/',
      'YouTube Channel: https://www.youtube.com/@NBIndianews',
      'Instagram: https://www.instagram.com/nbindianews/?hl=en',
      'WhatsApp Channel: https://whatsapp.com/channel/0029Vb9o89DBA1erbNTNPo16',
    ],
  },
  'editorial-policy': {
    title: 'Editorial Policy (संपादकीय नीति)',
    subtitle: 'सत्यता, निष्पक्षता और जवाबदेही के सिद्धांत',
    paragraphs: [
      'NavBihar India News (NBI) में प्रकाशित प्रत्येक खबर को प्रकाशन से पूर्व दो-स्तरीय फैक्ट-चेक प्रक्रिया से गुजारा जाता है। हम किसी भी अपुष्ट अफवाह या भ्रामक दावे को बिना आधिकारिक पुष्टि के प्रकाशित नहीं करते।',
      'यदि किसी खबर में कोई तथ्यात्मक त्रुटि संज्ञान में आती है, तो हमारी संपादकीय टीम उसे तुरंत संशोधित कर स्पष्ट अपडेट नोट जोड़ती है।',
    ],
  },
  'privacy-policy': {
    title: 'Privacy Policy (गोपनीयता नीति)',
    subtitle: 'पाठकों की निजता और डेटा सुरक्षा के प्रति हमारी प्रतिबद्धता',
    paragraphs: [
      'NavBihar India News अपने पाठकों की गोपनीयता का पूर्ण सम्मान करता है। हम आपकी अनुमति के बिना कोई भी व्यक्तिगत संवेदनशील जानकारी किसी तीसरे पक्ष के साथ साझा नहीं करते।',
      'बेहतर यूजर अनुभव और साइट परफॉर्मेंस के लिए केवल आवश्यक तकनीकी कुकीज़ और एनालिटिक्स का उपयोग किया जाता है।',
    ],
  },
  terms: {
    title: 'Terms and Conditions (नियम एवं शर्तें)',
    subtitle: 'वेबसाइट उपयोग की शर्तें और कॉपीराइट नियम',
    paragraphs: [
      'इस वेबसाइट पर उपलब्ध सभी समाचार, लोगो (NavBihar India News / NBI), ग्राफिक्स और वीडियो सामग्री कॉपीराइट कानूनों के तहत सुरक्षित हैं।',
      'बिना पूर्व लिखित अनुमति के हमारी सामग्री का व्यावसायिक पुनर्प्रकाशन वर्जित है।',
    ],
  },
  disclaimer: {
    title: 'Disclaimer (अस्वीकरण)',
    subtitle: 'सूचना एवं संपादकीय अस्वीकरण',
    paragraphs: [
      'NavBihar India News पर प्रकाशित समाचार और आलेख आधिकारिक स्रोतों, संवाददाताओं और जनसूचना पर आधारित होते हैं। किसी भी सरकारी भर्ती या परीक्षा के लिए संबंधित आयोग की आधिकारिक वेबसाइट का भी मिलान अवश्य करें।',
    ],
  },
  advertisement: {
    title: 'Advertisement With Us (विज्ञापन दें)',
    subtitle: 'बिहार और देश के लाखों डिजिटल पाठकों तक अपने ब्रांड को पहुंचाएं',
    paragraphs: [
      'NavBihar India News (NBI) के मोबाइल-फर्स्ट प्लेटफॉर्म, YouTube (@NBIndianews) और Facebook पेज पर विज्ञापन एवं स्पॉन्सरशिप के लिए हमारे नंबर 9162432466 (Araria, Bihar) पर संपर्क करें।',
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
        title={`${page.title} — NavBihar India News (NBI)`}
        description={page.subtitle}
        canonicalPath={`/info/${slug}`}
      />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-3 pb-5 mb-6 border-b border-slate-200">
            <BrandLogo size="lg" />
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

          {/* Direct Social & Contact Cards */}
          <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-slate-800"
            >
              <span>Facebook · NavBiharIndiaNews</span>
              <ExternalLink className="w-4 h-4 text-slate-500" />
            </a>
            <a
              href={settings.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-slate-800"
            >
              <span>YouTube · @NBIndianews</span>
              <ExternalLink className="w-4 h-4 text-slate-500" />
            </a>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-between text-slate-800"
            >
              <span>Instagram · @nbindianews</span>
              <ExternalLink className="w-4 h-4 text-slate-500" />
            </a>
            <a
              href={settings.whatsappChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-between text-emerald-900"
            >
              <span>WhatsApp Channel</span>
              <ExternalLink className="w-4 h-4 text-emerald-700" />
            </a>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <MapPin className="w-4 h-4 text-[#C8102E]" />
                Address: Araria, Bihar
              </span>
              <a
                href={`tel:${settings.contactPhone || '9162432466'}`}
                className="inline-flex items-center gap-1.5 font-bold text-[#C8102E]"
              >
                <Phone className="w-4 h-4" />
                Contact No: {settings.contactPhone || '9162432466'}
              </a>
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
