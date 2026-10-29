import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus2,
  Newspaper,
  PlaySquare,
  FolderKanban,
  Settings,
  LogOut,
  Trash2,
  Edit3,
  Upload,
  CheckCircle2,
  AlertCircle,
  CloudUpload,
  ArrowLeft,
  KeyRound,
  UserPlus,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useNews } from '../context/NewsContext';
import { BrandLogo, EditorialImage } from '../components/EditorialImage';
import { EDITORIAL_IMAGES } from '../assets/editorialVisuals';
import { SEOHead } from '../components/SEOHead';
import { ArticleStatus, NewsArticle, NewsCategory, VideoNewsItem } from '../types/news';
import { sanitizeSlug } from '../lib/firebase';
import { formatHindiDate } from '../utils/formatters';

type AdminTab =
  | 'dashboard'
  | 'editor'
  | 'articles'
  | 'videos'
  | 'categories'
  | 'credentials'
  | 'settings';

export function AdminPage() {
  const {
    articles,
    categories,
    videos,
    settings,
    activeAdminDisplay,
    isAdmin,
    authReady,
    adminCredentials,
    loginWithGoogle,
    loginWithIdPassword,
    registerAdminIdPassword,
    removeAdminCredential,
    logoutUser,
    createArticle,
    updateArticle,
    deleteArticle,
    saveCategory,
    removeCategory,
    saveVideo,
    removeVideo,
    savePortalSettings,
    seedDemoContentToCloud,
    getCategoryName,
  } = useNews();

  // Login Screen States
  const [authMode, setAuthMode] = useState<'login' | 'create'>('login');
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminId, setNewAdminId] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Article Editor State
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [artTitle, setArtTitle] = useState('');
  const [artSlug, setArtSlug] = useState('');
  const [artCategory, setArtCategory] = useState('bihar');
  const [artSubCategory, setArtSubCategory] = useState('बिहार की ताज़ा खबरें');
  const [artCity, setArtCity] = useState('अररिया');
  const [artDescription, setArtDescription] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artImage, setArtImage] = useState(EDITORIAL_IMAGES.patnaMetro);
  const [artImageCaption, setArtImageCaption] = useState('');
  const [artAuthor, setArtAuthor] = useState('NBI ब्यूरो, अररिया');
  const [artStatus, setArtStatus] = useState<ArticleStatus>('published');
  const [artScheduledFor, setArtScheduledFor] = useState('');
  const [artIsFeatured, setArtIsFeatured] = useState(false);
  const [artIsBreaking, setArtIsBreaking] = useState(false);
  const [artIsTrending, setArtIsTrending] = useState(false);
  const [artTrendingRank, setArtTrendingRank] = useState<number>(1);

  // Video Form State
  const [vidTitle, setVidTitle] = useState('');
  const [vidCategory, setVidCategory] = useState('bihar');
  const [vidThumb, setVidThumb] = useState(EDITORIAL_IMAGES.patnaMetro);
  const [vidUrl, setVidUrl] = useState(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  );
  const [vidDuration, setVidDuration] = useState('03:30');
  const [vidIsVertical, setVidIsVertical] = useState(false);
  const [vidStatus, setVidStatus] = useState<'published' | 'draft'>('published');

  // Category Form State
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catOrder, setCatOrder] = useState(12);
  const [catActive, setCatActive] = useState(true);

  // Portal Settings Form State
  const [tickerText, setTickerText] = useState(settings.breakingNewsTicker);
  const [tickerActive, setTickerActive] = useState(settings.breakingNewsActive);
  const [bannerTitle, setBannerTitle] = useState(settings.bannerTitle);
  const [bannerLink, setBannerLink] = useState(settings.bannerLink);
  const [bannerActive, setBannerActive] = useState(settings.bannerActive);
  const [fbUrl, setFbUrl] = useState(settings.facebookUrl);
  const [igUrl, setIgUrl] = useState(settings.instagramUrl);
  const [ytUrl, setYtUrl] = useState(settings.youtubeUrl);
  const [twUrl, setTwUrl] = useState(settings.twitterUrl);
  const [waUrl, setWaUrl] = useState(settings.whatsappChannelUrl);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);

  const showToast = (type: 'success' | 'error', message: string) => {
    setStatusBanner({ type, message });
    setTimeout(() => setStatusBanner(null), 4000);
  };

  const handleIdPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      await loginWithIdPassword(loginId, loginPass);
    } catch (err) {
      setAuthError(
        err instanceof Error ? err.message : 'लॉग इन करने में समस्या आई।'
      );
    }
  };

  const handleCreateAdminId = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      await registerAdminIdPassword(
        newAdminId,
        newAdminPass,
        newAdminName || 'NBI Admin',
        'admin'
      );
      setNewAdminId('');
      setNewAdminPass('');
      setNewAdminName('');
      showToast('success', 'नया Admin ID और Password सफलतापूर्वक बन गया!');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'त्रुटि हुई।';
      setAuthError(msg);
      showToast('error', msg);
    }
  };

  const resetArticleEditor = () => {
    setEditingArticleId(null);
    setArtTitle('');
    setArtSlug('');
    setArtCategory('bihar');
    setArtSubCategory('बिहार की ताज़ा खबरें');
    setArtCity('अररिया');
    setArtDescription('');
    setArtContent('');
    setArtImage(EDITORIAL_IMAGES.patnaMetro);
    setArtImageCaption('');
    setArtAuthor('NBI ब्यूरो, अररिया');
    setArtStatus('published');
    setArtScheduledFor('');
    setArtIsFeatured(false);
    setArtIsBreaking(false);
    setArtIsTrending(false);
    setArtTrendingRank(1);
  };

  const startEditArticle = (art: NewsArticle) => {
    setEditingArticleId(art.id);
    setArtTitle(art.title);
    setArtSlug(art.slug);
    setArtCategory(art.category);
    setArtSubCategory(art.subCategory || '');
    setArtCity(art.city || '');
    setArtDescription(art.description);
    setArtContent(art.content);
    setArtImage(art.featuredImage);
    setArtImageCaption(art.imageCaption || '');
    setArtAuthor(art.author);
    setArtStatus(art.status);
    setArtScheduledFor(art.scheduledFor || '');
    setArtIsFeatured(art.isFeatured);
    setArtIsBreaking(art.isBreaking);
    setArtIsTrending(art.isTrending);
    setArtTrendingRank(art.trendingRank || 1);
    setActiveTab('editor');
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (cloudName && uploadPreset) {
      try {
        setSubmitting(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: 'POST', body: formData }
        );
        const data = await res.json();
        if (data.secure_url) {
          setArtImage(data.secure_url);
          showToast('success', 'Cloudinary पर इमेज सफलतापूर्वक अपलोड हो गई!');
          setSubmitting(false);
          return;
        }
      } catch {
        // Fallback to client-side Canvas resize below
      } finally {
        setSubmitting(false);
      }
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 480;
        canvas.height = 270;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.72);
          setArtImage(dataUrl);
          showToast('success', 'इमेज सफलतापूर्वक अपलोड और सेट हो गई!');
        }
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle.trim() || !artDescription.trim() || !artContent.trim()) {
      showToast('error', 'कृपया शीर्षक, संक्षिप्त विवरण और पूरी खबर भरें।');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        title: artTitle,
        slug: sanitizeSlug(artSlug || artTitle),
        category: artCategory,
        subCategory: artSubCategory || undefined,
        city: artCity || undefined,
        description: artDescription,
        content: artContent,
        featuredImage: artImage || EDITORIAL_IMAGES.patnaMetro,
        imageCaption: artImageCaption || undefined,
        author: artAuthor || 'NBI News ब्यूरो',
        publishedAt: new Date().toISOString(),
        scheduledFor: artStatus === 'scheduled' ? artScheduledFor : undefined,
        status: artStatus,
        isFeatured: artIsFeatured,
        isBreaking: artIsBreaking,
        isTrending: artIsTrending,
        trendingRank: artIsTrending ? Number(artTrendingRank) || 1 : undefined,
      };

      if (editingArticleId) {
        await updateArticle(editingArticleId, payload);
        showToast('success', 'खबर सफलतापूर्वक अपडेट हो गई!');
      } else {
        await createArticle(payload);
        showToast('success', 'नई खबर सफलतापूर्वक प्रकाशित / सेव हो गई!');
      }
      resetArticleEditor();
      setActiveTab('articles');
    } catch (err) {
      showToast(
        'error',
        err instanceof Error ? err.message : 'खबर सहेजने में त्रुटि हुई।'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vidTitle.trim() || !vidUrl.trim()) {
      showToast('error', 'कृपया वीडियो का शीर्षक और URL भरें।');
      return;
    }
    setSubmitting(true);
    try {
      await saveVideo({
        title: vidTitle,
        category: vidCategory,
        thumbnailUrl: vidThumb || EDITORIAL_IMAGES.patnaMetro,
        videoUrl: vidUrl,
        duration: vidDuration || '03:00',
        isVertical: vidIsVertical,
        publishedAt: new Date().toISOString(),
        status: vidStatus,
      });
      setVidTitle('');
      showToast('success', 'वीडियो न्यूज़ सफलतापूर्वक जोड़ा गया!');
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'त्रुटि हुई।');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim() || !catSlug.trim()) {
      showToast('error', 'कृपया कैटेगरी का हिंदी नाम और स्लग (Slug) भरें।');
      return;
    }
    setSubmitting(true);
    try {
      await saveCategory({
        name: catName,
        englishName: catSlug,
        slug: sanitizeSlug(catSlug),
        description: catDesc || `${catName} से जुड़ी ताज़ा खबरें।`,
        order: Number(catOrder) || 10,
        isActive: catActive,
      });
      setCatName('');
      setCatSlug('');
      setCatDesc('');
      showToast('success', 'कैटेगरी सफलतापूर्वक सहेजी गई!');
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'त्रुटि हुई।');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await savePortalSettings({
        breakingNewsTicker: tickerText,
        breakingNewsActive: tickerActive,
        bannerTitle,
        bannerLink,
        bannerActive,
        facebookUrl: fbUrl,
        instagramUrl: igUrl,
        youtubeUrl: ytUrl,
        twitterUrl: twUrl,
        whatsappChannelUrl: waUrl,
        contactEmail,
        contactPhone,
      });
      showToast('success', 'पोर्टल सेटिंग्स और सोशल लिंक्स अपडेट हो गए!');
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'त्रुटि हुई।');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSeedCloud = async () => {
    setSubmitting(true);
    try {
      const count = await seedDemoContentToCloud();
      showToast(
        'success',
        count > 0
          ? `${count} खबरें डेटाबेस में सफलतापूर्वक सिंक हो गईं!`
          : 'सभी खबरें पहले से डेटाबेस में मौजूद हैं।'
      );
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : 'सिंक में त्रुटि।');
    } finally {
      setSubmitting(false);
    }
  };

  const totalArticlesCount = articles.length;
  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftCount = articles.filter(
    (a) => a.status === 'draft' || a.status === 'scheduled'
  ).length;
  const totalCategoriesCount = categories.length;

  if (!authReady) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-slate-600">
        प्रमाणीकरण की जांच हो रही है...
      </div>
    );
  }

  // Protected Login & Create Admin ID Screen when not logged in
  if (!isAdmin) {
    return (
      <>
        <SEOHead
          title="Admin Login (ID & Password) — NavBihar India News (NBI)"
          description="NavBihar India News (NBI) संपादकीय और न्यूज़ मैनेजमेंट एडमिन लॉग इन पैनल।"
          canonicalPath="/admin"
        />
        <main className="max-w-md mx-auto px-4 py-10 sm:py-14">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col items-center text-center mb-6">
              <BrandLogo size="lg" className="mb-3" />
              <h1 className="text-2xl font-extrabold text-slate-950">
                NavBihar India News (NBI)
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                एडमिन कंट्रोल पैनल · Araria, Bihar (9162432466)
              </p>
            </div>

            {/* Mode Switcher: Login with ID/Password vs Create New Admin ID */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl mb-6 border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError(null);
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  authMode === 'login'
                    ? 'bg-slate-950 text-white shadow-2xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>ID / Password लॉग इन</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('create');
                  setAuthError(null);
                }}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  authMode === 'create'
                    ? 'bg-slate-950 text-white shadow-2xs'
                    : 'text-slate-700 hover:text-slate-950'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create Admin ID</span>
              </button>
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-3 text-xs font-semibold mb-4 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {authMode === 'login' ? (
              <form onSubmit={handleIdPasswordLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Admin ID / मोबाइल नंबर *
                  </label>
                  <input
                    type="text"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="उदा: nbiadmin या 9162432466"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:border-[#C8102E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Password (पासवर्ड) *
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      placeholder="अपना एडमिन पासवर्ड दर्ज करें"
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:border-[#C8102E] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                    >
                      {showPass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[46px] px-5 py-3 rounded-xl bg-[#C8102E] hover:bg-[#a50d25] text-white text-sm font-bold transition-colors"
                >
                  एडमिन पैनल में लॉग इन करें (Login)
                </button>

                {/* Helpful Default Credentials Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 space-y-2">
                  <div className="font-bold text-slate-900">
                    तैयार एडमिन लॉग इन विवरण (Default Admin Credentials):
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-500">Admin ID:</span>{' '}
                      <strong className="font-mono text-slate-900">nbiadmin</strong>
                      <br />
                      <span className="text-slate-500">Password:</span>{' '}
                      <strong className="font-mono text-slate-900">NbiNews@9162</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">या ID:</span>{' '}
                      <strong className="font-mono text-slate-900">9162432466</strong>
                      <br />
                      <span className="text-slate-500">Password:</span>{' '}
                      <strong className="font-mono text-slate-900">9162432466</strong>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginId('nbiadmin');
                      setLoginPass('NbiNews@9162');
                    }}
                    className="w-full py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                  >
                    1-Click Auto-Fill ID & Password
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateAdminId} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    आपका नाम / डेस्क नाम (Admin Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    placeholder="उदा: NBI Editor Araria"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    नया Admin ID चुनें (Create Admin ID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdminId}
                    onChange={(e) => setNewAdminId(e.target.value)}
                    placeholder="उदा: araria_admin या मोबाइल नंबर"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    नया Password बनाएं (Create Password) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAdminPass}
                    onChange={(e) => setNewAdminPass(e.target.value)}
                    placeholder="कम से कम 4 अक्षरों का पासवर्ड"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full min-h-[46px] px-5 py-3 rounded-xl bg-[#C8102E] hover:bg-[#a50d25] text-white text-sm font-bold transition-colors"
                >
                  Admin ID बनाएं और सीधे लॉग इन करें
                </button>
              </form>
            )}

            <div className="my-5 flex items-center gap-3">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                या (OR)
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <button
              type="button"
              onClick={loginWithGoogle}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <span>Sign in with Google (गूगल अकाउंट से लॉग इन)</span>
            </button>

            <div className="mt-6 pt-5 border-t border-slate-200 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>मुख्य वेबसाइट पर वापस जाएं</span>
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="एडमिन डैशबोर्ड (CMS) — NavBihar India News (NBI)"
        description="NavBihar India News (NBI) न्यूज़ मैनेजमेंट सिस्टम।"
        canonicalPath="/admin"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-16">
        {/* Top Admin Header Bar */}
        <div className="bg-slate-950 text-white rounded-2xl p-4 sm:p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="md" />
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold">
                NBI (NavBihar India News) · एडमिन डैशबोर्ड
              </h1>
              <p className="text-xs text-slate-400">
                लॉग-इन एडमिन: {activeAdminDisplay} · Araria, Bihar (9162432466)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => {
                resetArticleEditor();
                setActiveTab('editor');
              }}
              className="px-4 py-2 rounded-lg bg-[#C8102E] hover:bg-[#a50d25] text-white text-xs font-bold inline-flex items-center gap-1.5 min-h-[38px]"
            >
              <FilePlus2 className="w-4 h-4" />
              <span>+ नई खबर लिखें</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('credentials')}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 min-h-[38px]"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Create ID / Password</span>
            </button>
            <Link
              to="/"
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold min-h-[38px] inline-flex items-center"
            >
              लाइव वेबसाइट देखें
            </Link>
            <button
              type="button"
              onClick={logoutUser}
              className="px-3.5 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold inline-flex items-center gap-1.5 min-h-[38px]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>लॉग आउट</span>
            </button>
          </div>
        </div>

        {/* Status Toast Notification */}
        {statusBanner && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center gap-2.5 text-sm font-semibold ${
              statusBanner.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-red-50 border-red-200 text-red-900'
            }`}
          >
            {statusBanner.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{statusBanner.message}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-6 border-b border-slate-200">
          {[
            { id: 'dashboard', label: 'डैशबोर्ड (Overview)', icon: LayoutDashboard },
            {
              id: 'editor',
              label: editingArticleId ? 'खबर संपादित करें' : 'नई खबर लिखें',
              icon: FilePlus2,
            },
            { id: 'articles', label: `सभी खबरें (${totalArticlesCount})`, icon: Newspaper },
            { id: 'videos', label: `वीडियो न्यूज़ (${videos.length})`, icon: PlaySquare },
            { id: 'categories', label: `कैटेगरी (${totalCategoriesCount})`, icon: FolderKanban },
            { id: 'credentials', label: 'Admin ID / Password बनाएं', icon: KeyRound },
            { id: 'settings', label: 'सोशल लिंक्स व सेटिंग्स', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors min-h-[42px] ${
                  active
                    ? 'bg-slate-950 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="text-xs font-bold text-slate-500 uppercase">
                  Total Articles (कुल खबरें)
                </div>
                <div className="text-3xl font-extrabold text-slate-950 tabular-nums mt-1">
                  {totalArticlesCount}
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="text-xs font-bold text-emerald-700 uppercase">
                  Published (प्रकाशित)
                </div>
                <div className="text-3xl font-extrabold text-emerald-700 tabular-nums mt-1">
                  {publishedCount}
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="text-xs font-bold text-amber-700 uppercase">
                  Draft / Scheduled (ड्राफ्ट)
                </div>
                <div className="text-3xl font-extrabold text-amber-700 tabular-nums mt-1">
                  {draftCount}
                </div>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="text-xs font-bold text-[#C8102E] uppercase">
                  Total Categories (कैटेगरी)
                </div>
                <div className="text-3xl font-extrabold text-[#C8102E] tabular-nums mt-1">
                  {totalCategoriesCount}
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-950">
                  क्विक एक्शन (Quick Actions)
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  अंकित डेमो खबरों को डेटाबेस में सेव करें, नया Admin ID/Password बनाएं या नई खबर प्रकाशित करें।
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSeedCloud}
                  className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-2 min-h-[40px]"
                >
                  <CloudUpload className="w-4 h-4" />
                  <span>Sync Demo News</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('credentials')}
                  className="px-4 py-2.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-900 text-xs font-bold inline-flex items-center gap-1.5 min-h-[40px]"
                >
                  <KeyRound className="w-4 h-4 text-[#C8102E]" />
                  <span>Create Admin ID / Password</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetArticleEditor();
                    setActiveTab('editor');
                  }}
                  className="px-4 py-2.5 rounded-lg bg-[#C8102E] text-white text-xs font-bold inline-flex items-center gap-1.5 min-h-[40px]"
                >
                  <FilePlus2 className="w-4 h-4" />
                  <span>नई खबर जोड़ें</span>
                </button>
              </div>
            </div>

            {/* Recent Articles Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-base font-extrabold text-slate-950">
                  हालिया खबरें (Recent Articles)
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab('articles')}
                  className="text-xs font-bold text-[#C8102E] hover:underline"
                >
                  सभी देखें
                </button>
              </div>

              <div className="divide-y divide-slate-200">
                {articles.slice(0, 8).map((art) => (
                  <div
                    key={art.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <span className="font-bold text-[#C8102E]">
                          {getCategoryName(art.category)}
                        </span>
                        {art.city && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{art.city}</span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-slate-700">
                          {art.status === 'published'
                            ? 'Published'
                            : art.status === 'draft'
                              ? 'Draft'
                              : 'Scheduled'}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-slate-900 line-clamp-1">
                        {art.title}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEditArticle(art)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-400 text-xs font-bold text-slate-700 inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteArticle(art.id)}
                        className="px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-xs font-bold text-red-700 inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CREATE / EDIT ARTICLE */}
        {activeTab === 'editor' && (
          <form
            onSubmit={handleSaveArticle}
            className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h2 className="text-xl font-extrabold text-slate-950">
                {editingArticleId
                  ? 'खबर संपादित करें (Edit Article)'
                  : 'नई खबर प्रकाशित करें (Create News Article)'}
              </h2>
              {editingArticleId && (
                <button
                  type="button"
                  onClick={resetArticleEditor}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  + नया फॉर्म खोलें
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  खबर का मुख्य शीर्षक (Hindi Headline) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={300}
                  value={artTitle}
                  onChange={(e) => setArtTitle(e.target.value)}
                  placeholder="उदा: अररिया और सीमांचल में नई विकास परियोजनाओं को मंजूरी..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  SEO URL Slug (खाली छोड़ने पर स्वतः बनेगा)
                </label>
                <input
                  type="text"
                  maxLength={180}
                  value={artSlug}
                  onChange={(e) => setArtSlug(e.target.value)}
                  placeholder="araria-bihar-latest-news-update"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  समाचार कैटेगरी (Category) *
                </label>
                <select
                  value={artCategory}
                  onChange={(e) => setArtCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name} ({c.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  बिहार सब-सेक्शन (Bihar Sub-Section)
                </label>
                <select
                  value={artSubCategory}
                  onChange={(e) => setArtSubCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="">कोई नहीं (General)</option>
                  <option value="बिहार की ताज़ा खबरें">बिहार की ताज़ा खबरें</option>
                  <option value="बिहार राजनीति">बिहार राजनीति</option>
                  <option value="बिहार शिक्षा">बिहार शिक्षा</option>
                  <option value="बिहार रोजगार">बिहार रोजगार</option>
                  <option value="बिहार क्राइम">बिहार क्राइम</option>
                  <option value="बिहार के प्रमुख शहरों की खबरें">बिहार के प्रमुख शहरों की खबरें</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  शहर / जिला (City / District)
                </label>
                <input
                  type="text"
                  maxLength={100}
                  value={artCity}
                  onChange={(e) => setArtCity(e.target.value)}
                  placeholder="अररिया / पटना / पूर्णिया / गया"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  संक्षिप्त विवरण (Short Description / Summary Deck) *
                </label>
                <textarea
                  rows={2}
                  required
                  maxLength={1000}
                  value={artDescription}
                  onChange={(e) => setArtDescription(e.target.value)}
                  placeholder="खबर का 2-3 वाक्यों में मुख्य सारांश..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  पूरी खबर (Full News Content) *
                </label>
                <textarea
                  rows={8}
                  required
                  maxLength={50000}
                  value={artContent}
                  onChange={(e) => setArtContent(e.target.value)}
                  placeholder="पूरी खबर पैराग्राफ के साथ यहाँ लिखें..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm leading-relaxed"
                />
              </div>

              {/* Image Upload & Editorial Graphic Selector */}
              <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <label className="block text-xs font-bold text-slate-800">
                    फीचर्ड न्यूज़ इमेज (Image URL, फाइल अपलोड या NBI टेम्पलेट चुनें)
                  </label>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>फोटो अपलोड करें</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <input
                  type="text"
                  value={artImage}
                  onChange={(e) => setArtImage(e.target.value)}
                  placeholder="https://... या नीचे से NBI संपादकीय ग्राफिक चुनें"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                />

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {Object.entries(EDITORIAL_IMAGES).map(([key, svgUrl]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setArtImage(svgUrl)}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-semibold border whitespace-nowrap shrink-0 ${
                        artImage === svgUrl
                          ? 'bg-[#C8102E] text-white border-[#C8102E]'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  <div className="aspect-16/9 rounded-lg overflow-hidden bg-slate-900 border border-slate-200">
                    <EditorialImage
                      src={artImage}
                      alt="Preview"
                      category={artCategory}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      फोटो कैप्शन (Image Caption)
                    </label>
                    <input
                      type="text"
                      maxLength={500}
                      value={artImageCaption}
                      onChange={(e) => setArtImageCaption(e.target.value)}
                      placeholder="फोटो के नीचे दिखने वाला विवरण..."
                      className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  संवाददाता / लेखक का नाम (Author) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={150}
                  value={artAuthor}
                  onChange={(e) => setArtAuthor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  प्रकाशन स्थिति (Status: Publish / Draft / Schedule)
                </label>
                <select
                  value={artStatus}
                  onChange={(e) => setArtStatus(e.target.value as ArticleStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white"
                >
                  <option value="published">Publish Immediately (तुरंत प्रकाशित करें)</option>
                  <option value="draft">Save as Draft (ड्राफ्ट में रखें)</option>
                  <option value="scheduled">Schedule for Later (निर्धारित समय पर)</option>
                </select>
              </div>

              {artStatus === 'scheduled' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    निर्धारित समय (Schedule Date & Time)
                  </label>
                  <input
                    type="datetime-local"
                    value={artScheduledFor}
                    onChange={(e) => setArtScheduledFor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              )}

              {/* Placement Checkboxes */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={artIsFeatured}
                    onChange={(e) => setArtIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#C8102E]"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    मुख्य हीरो खबर (Featured Hero)
                  </span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={artIsBreaking}
                    onChange={(e) => setArtIsBreaking(e.target.checked)}
                    className="w-4 h-4 accent-[#C8102E]"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    ब्रेकिंग न्यूज़ टिकर (Breaking News)
                  </span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={artIsTrending}
                    onChange={(e) => setArtIsTrending(e.target.checked)}
                    className="w-4 h-4 accent-[#C8102E]"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    ट्रेंडिंग / लोकप्रिय सूची (Trending)
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-xl bg-[#C8102E] hover:bg-[#a50d25] text-white text-sm font-bold"
              >
                {submitting
                  ? 'सहेजा जा रहा है...'
                  : editingArticleId
                    ? 'खबर अपडेट करें'
                    : 'खबर प्रकाशित / सेव करें'}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetArticleEditor();
                  setActiveTab('articles');
                }}
                className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold"
              >
                रद्द करें
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: ALL ARTICLES LIST */}
        {activeTab === 'articles' && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-950">
                सभी समाचार प्रबंधन ({articles.length})
              </h2>
              <button
                type="button"
                onClick={() => {
                  resetArticleEditor();
                  setActiveTab('editor');
                }}
                className="px-4 py-2 rounded-lg bg-[#C8102E] text-white text-xs font-bold"
              >
                + नई खबर जोड़ें
              </button>
            </div>

            <div className="divide-y divide-slate-200">
              {articles.map((art) => (
                <div
                  key={art.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-bold text-[#C8102E]">
                        {getCategoryName(art.category)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-slate-800 uppercase">
                        {art.status}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{formatHindiDate(art.publishedAt)}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-950">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      /news/{art.slug}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEditArticle(art)}
                      className="px-3.5 py-2 rounded-lg border border-slate-200 hover:border-slate-400 text-xs font-bold text-slate-800 inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteArticle(art.id)}
                      className="px-3.5 py-2 rounded-lg border border-red-200 hover:bg-red-50 text-xs font-bold text-red-700 inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: VIDEO NEWS MANAGEMENT */}
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form
              onSubmit={handleSaveVideo}
              className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 self-start"
            >
              <h2 className="text-lg font-extrabold text-slate-950 pb-2 border-b border-slate-200">
                नया वीडियो न्यूज़ जोड़ें
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  वीडियो शीर्षक (Headline) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={300}
                  value={vidTitle}
                  onChange={(e) => setVidTitle(e.target.value)}
                  placeholder="अररिया से प्राइम बुलेटिन..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    कैटेगरी
                  </label>
                  <select
                    value={vidCategory}
                    onChange={(e) => setVidCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    अवधि (Duration)
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    value={vidDuration}
                    onChange={(e) => setVidDuration(e.target.value)}
                    placeholder="03:45"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Video MP4 या YouTube Embed URL *
                </label>
                <input
                  type="text"
                  required
                  value={vidUrl}
                  onChange={(e) => setVidUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Thumbnail URL
                </label>
                <input
                  type="text"
                  value={vidThumb}
                  onChange={(e) => setVidThumb(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vidIsVertical}
                    onChange={(e) => setVidIsVertical(e.target.checked)}
                    className="w-4 h-4 accent-[#C8102E]"
                  />
                  <span>Vertical Mobile Reel (9:16)</span>
                </label>

                <select
                  value={vidStatus}
                  onChange={(e) =>
                    setVidStatus(e.target.value as 'published' | 'draft')
                  }
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-[#C8102E] text-white text-sm font-bold"
              >
                वीडियो सेव करें
              </button>
            </form>

            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="text-lg font-extrabold text-slate-950 pb-3 mb-4 border-b border-slate-200">
                मौजूदा वीडियो न्यूज़ ({videos.length})
              </h2>
              <div className="divide-y divide-slate-200">
                {videos.map((v: VideoNewsItem) => (
                  <div
                    key={v.id}
                    className="py-3.5 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-xs text-slate-500">
                        <span className="font-bold text-[#C8102E]">
                          {getCategoryName(v.category)}
                        </span>{' '}
                        · {v.duration} · {v.isVertical ? '9:16 Vertical' : '16:9'}
                      </div>
                      <div className="text-sm font-bold text-slate-900">
                        {v.title}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVideo(v.id)}
                      className="px-3 py-1.5 rounded-lg border border-red-200 text-xs font-bold text-red-700 shrink-0"
                    >
                      हटाएं
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CATEGORY MANAGEMENT */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form
              onSubmit={handleSaveCategory}
              className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 self-start"
            >
              <h2 className="text-lg font-extrabold text-slate-950 pb-2 border-b border-slate-200">
                नई कैटेगरी जोड़ें / अपडेट करें
              </h2>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  कैटेगरी का हिंदी नाम *
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="उदा: सीमांचल विशेष"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Slug (English) *
                </label>
                <input
                  type="text"
                  required
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  placeholder="seemanchal"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  कैटेगरी विवरण (SEO Description)
                </label>
                <textarea
                  rows={2}
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    क्रम संख्या (Order)
                  </label>
                  <input
                    type="number"
                    value={catOrder}
                    onChange={(e) => setCatOrder(Number(e.target.value))}
                    className="w-24 px-3 py-1.5 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer mt-4">
                  <input
                    type="checkbox"
                    checked={catActive}
                    onChange={(e) => setCatActive(e.target.checked)}
                    className="w-4 h-4 accent-[#C8102E]"
                  />
                  <span>मेनू में सक्रिय (Active)</span>
                </label>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-xl bg-[#C8102E] text-white text-sm font-bold"
              >
                कैटेगरी सहेजें
              </button>
            </form>

            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="text-lg font-extrabold text-slate-950 pb-3 mb-4 border-b border-slate-200">
                सभी समाचार कैटेगरी ({categories.length})
              </h2>
              <div className="divide-y divide-slate-200">
                {categories.map((c: NewsCategory) => (
                  <div
                    key={c.id}
                    className="py-3 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-950">
                        {c.order}. {c.name}{' '}
                        <span className="text-xs font-normal text-slate-500">
                          (/category/{c.slug})
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-1">
                        {c.description}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCategory(c.id)}
                      className="px-3 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:text-red-600 shrink-0"
                    >
                      हटाएं
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: CREATE / MANAGE ADMIN ID & PASSWORD */}
        {activeTab === 'credentials' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <form
              onSubmit={handleCreateAdminId}
              className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 self-start"
            >
              <h2 className="text-lg font-extrabold text-slate-950 pb-2 border-b border-slate-200">
                नया Admin ID और Password बनाएं
              </h2>
              <p className="text-xs text-slate-600">
                यहाँ से आप अपने लिए या किसी रिपोर्टर/एडिटर के लिए नया Admin ID और Password बना सकते हैं या पासवर्ड बदल सकते हैं।
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  एडमिन / एडिटर का नाम *
                </label>
                <input
                  type="text"
                  required
                  value={newAdminName}
                  onChange={(e) => setNewAdminName(e.target.value)}
                  placeholder="उदा: NBI Chief Editor"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Admin ID (यूजर आईडी या मोबाइल नंबर) *
                </label>
                <input
                  type="text"
                  required
                  value={newAdminId}
                  onChange={(e) => setNewAdminId(e.target.value)}
                  placeholder="उदा: nbiadmin या 9162432466"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password (पासवर्ड) *
                </label>
                <input
                  type="text"
                  required
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  placeholder="नया पासवर्ड दर्ज करें"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#a50d25] text-white text-sm font-bold"
              >
                Admin ID / Password सेव करें
              </button>
            </form>

            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5">
              <h2 className="text-lg font-extrabold text-slate-950 pb-3 mb-4 border-b border-slate-200">
                सक्रिय Admin IDs & Passwords ({adminCredentials.length})
              </h2>
              <div className="divide-y divide-slate-200">
                {adminCredentials.map((cred) => (
                  <div
                    key={cred.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-950">
                        {cred.name}
                      </div>
                      <div className="text-xs text-slate-600 font-mono mt-0.5">
                        ID: <strong>{cred.adminId}</strong> · Password:{' '}
                        <strong>{cred.password}</strong>
                      </div>
                    </div>
                    {adminCredentials.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAdminCredential(cred.id)}
                        className="px-3 py-1.5 rounded-lg border border-red-200 text-xs font-bold text-red-700 hover:bg-red-50 self-start sm:self-center"
                      >
                        हटाएं
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PORTAL SETTINGS & BREAKING NEWS TICKER */}
        {activeTab === 'settings' && (
          <form
            onSubmit={handleSaveSettings}
            className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 space-y-6 max-w-3xl"
          >
            <h2 className="text-xl font-extrabold text-slate-950 pb-3 border-b border-slate-200">
              ब्रेकिंग न्यूज़ टिकर, होमपेज बैनर और सोशल मीडिया लिंक्स
            </h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  ब्रेकिंग न्यूज़ टिकर हेडलाइंस ( | चिह्न से अलग करें )
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tickerActive}
                    onChange={(e) => setTickerActive(e.target.checked)}
                    className="w-4 h-4 accent-[#C8102E]"
                  />
                  <span>टिकर दिखाएं</span>
                </label>
              </div>
              <textarea
                rows={3}
                value={tickerText}
                onChange={(e) => setTickerText(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm"
              />
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800">
                  होमपेज विशेष कवरेज बैनर (Special Announcement Banner)
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bannerActive}
                    onChange={(e) => setBannerActive(e.target.checked)}
                    className="w-4 h-4 accent-[#C8102E]"
                  />
                  <span>बैनर सक्रिय करें</span>
                </label>
              </div>
              <input
                type="text"
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
                placeholder="बैनर शीर्षक..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              />
              <input
                type="text"
                value={bannerLink}
                onChange={(e) => setBannerLink(e.target.value)}
                placeholder="/category/bihar"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Facebook URL
                </label>
                <input
                  type="text"
                  value={fbUrl}
                  onChange={(e) => setFbUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  YouTube URL
                </label>
                <input
                  type="text"
                  value={ytUrl}
                  onChange={(e) => setYtUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Instagram URL
                </label>
                <input
                  type="text"
                  value={igUrl}
                  onChange={(e) => setIgUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Channel URL
                </label>
                <input
                  type="text"
                  value={waUrl}
                  onChange={(e) => setWaUrl(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  संपादकीय ईमेल (Contact Email)
                </label>
                <input
                  type="text"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  संपर्क नंबर (Contact No - Araria, Bihar)
                </label>
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-[#C8102E] text-white text-sm font-bold"
            >
              पोर्टल सेटिंग्स अपडेट करें
            </button>
          </form>
        )}
      </main>
    </>
  );
}
