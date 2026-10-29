import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { BrandLogo } from './EditorialImage';
import { useNews } from '../context/NewsContext';

export function Footer() {
  const { categories, settings } = useNews();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pb-20 md:pb-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-slate-800">
          {/* Column 1: Brand Identity, Logo, Address & Contact */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <BrandLogo size="lg" />
              <div>
                <div className="text-xl font-extrabold text-white tracking-tight">
                  NavBihar <span className="text-[#EF4444]">India News</span>
                </div>
                <div className="text-xs font-semibold text-slate-400 tracking-wide">
                  NBI · निष्पक्ष और निर्भीक पत्रकारिता
                </div>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              NavBihar India News (NBI) बिहार और देश का प्रीमियम डिजिटल न्यूज़ प्लेटफॉर्म है। अररिया, सीमांचल और पूरे बिहार की राजनीति, शिक्षा, रोजगार, अपराध, खेल और जन सरोकार की हर खबर सबसे पहले और पूरी विश्वसनीयता के साथ।
            </p>
            <div className="space-y-2 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span>
                  <strong>Address:</strong> Araria, Bihar (अररिया, बिहार)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <a
                  href={`tel:${settings.contactPhone || '9162432466'}`}
                  className="hover:text-white transition-colors"
                >
                  <strong>Contact No:</strong> +91 {settings.contactPhone || '9162432466'}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <span>{settings.contactEmail}</span>
              </div>
            </div>
          </div>

          {/* Column 2: News Categories */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              प्रमुख समाचार सेक्शन
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {categories.slice(0, 10).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-slate-400 hover:text-white transition-colors py-1 inline-block"
                  >
                    {cat.name} समाचार
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Institutional & Editorial Policies */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              संस्थान और नीतियां
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/info/about"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  About NavBihar India News (हमारे बारे में)
                </Link>
              </li>
              <li>
                <Link
                  to="/info/contact"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Contact Us (संपर्क करें - Araria, Bihar)
                </Link>
              </li>
              <li>
                <Link
                  to="/info/editorial-policy"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Editorial Policy (संपादकीय नीति)
                </Link>
              </li>
              <li>
                <Link
                  to="/info/privacy-policy"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Privacy Policy (गोपनीयता नीति)
                </Link>
              </li>
              <li>
                <Link
                  to="/info/terms"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Terms and Conditions (नियम व शर्तें)
                </Link>
              </li>
              <li>
                <Link
                  to="/info/disclaimer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Disclaimer (अस्वीकरण)
                </Link>
              </li>
              <li>
                <Link
                  to="/info/advertisement"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Advertisement (विज्ञापन दें)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Official Social Media Channels & Admin Login */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              आधिकारिक सोशल मीडिया चैनल
            </h3>
            <div className="space-y-2 text-sm">
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
              >
                <span>Facebook · NavBiharIndiaNews</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
              >
                <span>YouTube · @NBIndianews</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-colors"
              >
                <span>Instagram · @nbindianews</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>
              <a
                href={settings.whatsappChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-emerald-400 font-semibold transition-colors"
              >
                <span>WhatsApp Channel से जुड़ें</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
              </a>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80">
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#C8102E] hover:bg-[#a50d25] text-xs font-bold text-white transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Panel (ID / Password Login)</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="font-medium text-slate-300">
            © NavBihar India News (NBI) · Araria, Bihar · Contact: 9162432466. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/info/about" className="hover:text-white transition-colors">
              About Us
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/info/contact" className="hover:text-white transition-colors">
              Contact Us
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/info/privacy-policy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/info/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/admin" className="hover:text-white transition-colors font-semibold text-red-400">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
