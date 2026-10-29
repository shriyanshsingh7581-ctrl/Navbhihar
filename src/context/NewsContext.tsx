import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_PORTAL_SETTINGS,
  DEMO_ARTICLES,
  DEMO_VIDEOS,
} from '../data/demoNewsData';
import {
  auth,
  db,
  googleProvider,
  isAuthorizedAdminEmail,
  sanitizeSlug,
} from '../lib/firebase';
import {
  AdminCredential,
  NewsArticle,
  NewsCategory,
  PortalSettings,
  VideoNewsItem,
} from '../types/news';

const DEFAULT_ADMIN_CREDENTIALS: AdminCredential[] = [
  {
    id: 'master-admin-1',
    adminId: 'nbiadmin',
    password: 'NbiNews@9162',
    name: 'NBI Chief Editor (Araria)',
    role: 'admin',
    createdAt: '2026-10-29T00:00:00Z',
  },
  {
    id: 'master-admin-2',
    adminId: '9162432466',
    password: '9162432466',
    name: 'NavBihar India News Desk',
    role: 'admin',
    createdAt: '2026-10-29T00:00:00Z',
  },
];

interface LocalAdminSession {
  adminId: string;
  name: string;
  role: 'admin' | 'editor';
}

interface NewsContextValue {
  articles: NewsArticle[];
  publishedArticles: NewsArticle[];
  categories: NewsCategory[];
  videos: VideoNewsItem[];
  settings: PortalSettings;
  loading: boolean;
  currentUser: User | null;
  activeAdminDisplay: string | null;
  isAdmin: boolean;
  authReady: boolean;
  usingDemoFallback: boolean;
  adminCredentials: AdminCredential[];
  loginWithGoogle: () => Promise<void>;
  loginWithIdPassword: (adminId: string, password: string) => Promise<void>;
  registerAdminIdPassword: (
    adminId: string,
    password: string,
    name: string,
    role?: 'admin' | 'editor'
  ) => Promise<void>;
  removeAdminCredential: (id: string) => void;
  logoutUser: () => Promise<void>;
  createArticle: (input: Omit<NewsArticle, 'id' | 'authorId' | 'views'>) => Promise<string>;
  updateArticle: (id: string, input: Partial<NewsArticle>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  saveCategory: (cat: Omit<NewsCategory, 'id'> & { id?: string }) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  saveVideo: (vid: Omit<VideoNewsItem, 'id' | 'authorId'> & { id?: string }) => Promise<void>;
  removeVideo: (id: string) => Promise<void>;
  savePortalSettings: (nextSettings: Omit<PortalSettings, 'updatedBy'>) => Promise<void>;
  seedDemoContentToCloud: () => Promise<number>;
  getCategoryName: (slug: string) => string;
}

const NewsContext = createContext<NewsContextValue | undefined>(undefined);

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function NewsProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseIsAdmin, setFirebaseIsAdmin] = useState<boolean>(false);
  const [authReady, setAuthReady] = useState<boolean>(false);

  const [adminCredentials, setAdminCredentials] = useState<AdminCredential[]>(() =>
    loadStorage<AdminCredential[]>('nbi_admin_credentials_v1', DEFAULT_ADMIN_CREDENTIALS)
  );

  const [localAdminSession, setLocalAdminSession] = useState<LocalAdminSession | null>(() =>
    loadStorage<LocalAdminSession | null>('nbi_local_admin_session_v1', null)
  );

  const [localArticles, setLocalArticles] = useState<NewsArticle[]>(() =>
    loadStorage<NewsArticle[]>('nbi_local_articles_v1', [])
  );
  const [localCategories, setLocalCategories] = useState<NewsCategory[]>(() =>
    loadStorage<NewsCategory[]>('nbi_local_categories_v1', [])
  );
  const [localVideos, setLocalVideos] = useState<VideoNewsItem[]>(() =>
    loadStorage<VideoNewsItem[]>('nbi_local_videos_v1', [])
  );
  const [localSettings, setLocalSettings] = useState<PortalSettings | null>(() =>
    loadStorage<PortalSettings | null>('nbi_local_settings_v1', null)
  );

  const [cloudArticles, setCloudArticles] = useState<NewsArticle[]>([]);
  const [cloudCategories, setCloudCategories] = useState<NewsCategory[]>([]);
  const [cloudVideos, setCloudVideos] = useState<VideoNewsItem[]>([]);
  const [cloudSettings, setCloudSettings] = useState<PortalSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletedDemoIds, setDeletedDemoIds] = useState<string[]>(() =>
    loadStorage<string[]>('nbi_deleted_demo_ids', [])
  );

  const isAdmin = Boolean(firebaseIsAdmin || localAdminSession);
  const activeAdminDisplay =
    localAdminSession
      ? `${localAdminSession.name} (ID: ${localAdminSession.adminId})`
      : currentUser?.email || null;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user && user.emailVerified) {
        if (isAuthorizedAdminEmail(user.email)) {
          setFirebaseIsAdmin(true);
        } else {
          try {
            const adminSnap = await getDoc(doc(db, 'admins', user.uid));
            setFirebaseIsAdmin(adminSnap.exists());
          } catch {
            setFirebaseIsAdmin(false);
          }
        }
      } else {
        setFirebaseIsAdmin(false);
      }
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!authReady) return;

    const articlesQuery = firebaseIsAdmin
      ? query(collection(db, 'articles'))
      : query(collection(db, 'articles'), where('status', '==', 'published'));

    const unsubArticles = onSnapshot(
      articlesQuery,
      (snapshot) => {
        const list: NewsArticle[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: String(data.title || ''),
            slug: String(data.slug || docSnap.id),
            category: String(data.category || 'bihar'),
            subCategory: data.subCategory ? String(data.subCategory) : undefined,
            city: data.city ? String(data.city) : undefined,
            description: String(data.description || ''),
            content: String(data.content || ''),
            featuredImage: String(data.featuredImage || ''),
            imageCaption: data.imageCaption ? String(data.imageCaption) : undefined,
            author: String(data.author || 'NBI News ब्यूरो'),
            authorId: String(data.authorId || ''),
            publishedAt: String(data.publishedAt || new Date().toISOString()),
            scheduledFor: data.scheduledFor ? String(data.scheduledFor) : undefined,
            status: (data.status as NewsArticle['status']) || 'published',
            isFeatured: Boolean(data.isFeatured),
            isBreaking: Boolean(data.isBreaking),
            isTrending: Boolean(data.isTrending),
            trendingRank:
              typeof data.trendingRank === 'number' ? data.trendingRank : undefined,
            views: typeof data.views === 'number' ? data.views : 0,
            isDemo: false,
          };
        });
        setCloudArticles(list);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    const categoriesQuery = firebaseIsAdmin
      ? query(collection(db, 'categories'))
      : query(collection(db, 'categories'), where('isActive', '==', true));

    const unsubCategories = onSnapshot(
      categoriesQuery,
      (snapshot) => {
        const list: NewsCategory[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: String(data.name || ''),
            englishName: String(data.slug || ''),
            slug: String(data.slug || docSnap.id),
            description: String(data.description || ''),
            order: typeof data.order === 'number' ? data.order : 99,
            isActive: Boolean(data.isActive),
          };
        });
        setCloudCategories(list);
      },
      () => {}
    );

    const videosQuery = firebaseIsAdmin
      ? query(collection(db, 'videos'))
      : query(collection(db, 'videos'), where('status', '==', 'published'));

    const unsubVideos = onSnapshot(
      videosQuery,
      (snapshot) => {
        const list: VideoNewsItem[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: String(data.title || ''),
            category: String(data.category || 'bihar'),
            thumbnailUrl: String(data.thumbnailUrl || ''),
            videoUrl: String(data.videoUrl || ''),
            duration: String(data.duration || '02:30'),
            isVertical: Boolean(data.isVertical),
            publishedAt: String(data.publishedAt || new Date().toISOString()),
            authorId: String(data.authorId || ''),
            status: (data.status as 'published' | 'draft') || 'published',
          };
        });
        setCloudVideos(list);
      },
      () => {}
    );

    const unsubSettings = onSnapshot(
      doc(db, 'settings', 'portal'),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCloudSettings({
            breakingNewsTicker: String(
              data.breakingNewsTicker || DEFAULT_PORTAL_SETTINGS.breakingNewsTicker
            ),
            breakingNewsActive: Boolean(data.breakingNewsActive ?? true),
            bannerTitle: String(data.bannerTitle || ''),
            bannerLink: String(data.bannerLink || '/category/bihar'),
            bannerActive: Boolean(data.bannerActive ?? false),
            facebookUrl: String(data.facebookUrl || DEFAULT_PORTAL_SETTINGS.facebookUrl),
            instagramUrl: String(
              data.instagramUrl || DEFAULT_PORTAL_SETTINGS.instagramUrl
            ),
            youtubeUrl: String(data.youtubeUrl || DEFAULT_PORTAL_SETTINGS.youtubeUrl),
            twitterUrl: String(data.twitterUrl || DEFAULT_PORTAL_SETTINGS.twitterUrl),
            whatsappChannelUrl: String(
              data.whatsappChannelUrl || DEFAULT_PORTAL_SETTINGS.whatsappChannelUrl
            ),
            contactEmail: String(
              data.contactEmail || DEFAULT_PORTAL_SETTINGS.contactEmail
            ),
            contactPhone: String(
              data.contactPhone || DEFAULT_PORTAL_SETTINGS.contactPhone
            ),
            updatedBy: String(data.updatedBy || ''),
          });
        }
      },
      () => {}
    );

    return () => {
      unsubArticles();
      unsubCategories();
      unsubVideos();
      unsubSettings();
    };
  }, [authReady, firebaseIsAdmin]);

  const articles = useMemo(() => {
    const map = new Map<string, NewsArticle>();
    for (const demo of DEMO_ARTICLES) {
      if (!deletedDemoIds.includes(demo.id)) {
        map.set(demo.id, demo);
      }
    }
    for (const loc of localArticles) {
      if (!deletedDemoIds.includes(loc.id)) {
        map.set(loc.id, loc);
      }
    }
    for (const cld of cloudArticles) {
      if (!deletedDemoIds.includes(cld.id)) {
        map.set(cld.id, cld);
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [cloudArticles, localArticles, deletedDemoIds]);

  const publishedArticles = useMemo(
    () => articles.filter((a) => a.status === 'published'),
    [articles]
  );

  const categories = useMemo(() => {
    const map = new Map<string, NewsCategory>();
    for (const d of DEFAULT_CATEGORIES) map.set(d.slug, d);
    for (const l of localCategories) map.set(l.slug, l);
    for (const c of cloudCategories) map.set(c.slug, c);
    return Array.from(map.values()).sort((a, b) => a.order - b.order);
  }, [cloudCategories, localCategories]);

  const videos = useMemo(() => {
    const map = new Map<string, VideoNewsItem>();
    for (const d of DEMO_VIDEOS) map.set(d.id, d);
    for (const l of localVideos) map.set(l.id, l);
    for (const c of cloudVideos) map.set(c.id, c);
    return Array.from(map.values());
  }, [cloudVideos, localVideos]);

  const settings = cloudSettings || localSettings || DEFAULT_PORTAL_SETTINGS;

  const getCategoryName = (slug: string): string => {
    if (slug === 'home' || slug === '') return 'होम';
    const found = categories.find(
      (c) => c.slug.toLowerCase() === slug.toLowerCase()
    );
    return found ? found.name : slug;
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const loginWithIdPassword = async (
    rawAdminId: string,
    rawPassword: string
  ): Promise<void> => {
    const cleanId = rawAdminId.trim().toLowerCase();
    const cleanPass = rawPassword.trim();

    if (!cleanId || !cleanPass) {
      throw new Error('कृपया एडमिन आईडी (ID) और पासवर्ड (Password) दोनों दर्ज करें।');
    }

    const matched = adminCredentials.find(
      (cred) =>
        cred.adminId.trim().toLowerCase() === cleanId &&
        cred.password === cleanPass
    );

    if (matched) {
      const session: LocalAdminSession = {
        adminId: matched.adminId,
        name: matched.name,
        role: matched.role,
      };
      setLocalAdminSession(session);
      localStorage.setItem('nbi_local_admin_session_v1', JSON.stringify(session));
      return;
    }

    // Also try Firebase Email/Password authentication if adminId is an email
    if (cleanId.includes('@')) {
      try {
        await signInWithEmailAndPassword(auth, cleanId, cleanPass);
        const session: LocalAdminSession = {
          adminId: cleanId,
          name: cleanId.split('@')[0],
          role: 'admin',
        };
        setLocalAdminSession(session);
        localStorage.setItem('nbi_local_admin_session_v1', JSON.stringify(session));
        return;
      } catch {
        // Fall through to invalid credentials message
      }
    }

    throw new Error(
      'गलत एडमिन ID या Password! कृपया सही ID/Password डालें या नया Admin ID बनाएं।'
    );
  };

  const registerAdminIdPassword = async (
    rawAdminId: string,
    rawPassword: string,
    rawName: string,
    role: 'admin' | 'editor' = 'admin'
  ): Promise<void> => {
    const cleanId = rawAdminId.trim();
    const cleanPass = rawPassword.trim();
    const cleanName = rawName.trim() || 'NBI Admin';

    if (cleanId.length < 3) {
      throw new Error('एडमिन ID कम से कम 3 अक्षरों का होना चाहिए।');
    }
    if (cleanPass.length < 4) {
      throw new Error('पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।');
    }

    const exists = adminCredentials.some(
      (c) => c.adminId.toLowerCase() === cleanId.toLowerCase()
    );
    const updatedList: AdminCredential[] = exists
      ? adminCredentials.map((c) =>
          c.adminId.toLowerCase() === cleanId.toLowerCase()
            ? { ...c, password: cleanPass, name: cleanName, role }
            : c
        )
      : [
          ...adminCredentials,
          {
            id: `adm-${Date.now().toString(36)}`,
            adminId: cleanId,
            password: cleanPass,
            name: cleanName,
            role,
            createdAt: new Date().toISOString(),
          },
        ];

    setAdminCredentials(updatedList);
    localStorage.setItem('nbi_admin_credentials_v1', JSON.stringify(updatedList));

    // Automatically log in the newly created/updated admin credential
    const session: LocalAdminSession = {
      adminId: cleanId,
      name: cleanName,
      role,
    };
    setLocalAdminSession(session);
    localStorage.setItem('nbi_local_admin_session_v1', JSON.stringify(session));

    if (cleanId.includes('@') && cleanPass.length >= 6) {
      try {
        await createUserWithEmailAndPassword(auth, cleanId, cleanPass);
      } catch {
        // Ignore if Firebase Email/Password provider is not enabled in console yet
      }
    }
  };

  const removeAdminCredential = (id: string) => {
    if (adminCredentials.length <= 1) return;
    const next = adminCredentials.filter((c) => c.id !== id);
    setAdminCredentials(next);
    localStorage.setItem('nbi_admin_credentials_v1', JSON.stringify(next));
  };

  const logoutUser = async () => {
    setLocalAdminSession(null);
    localStorage.removeItem('nbi_local_admin_session_v1');
    if (currentUser) {
      await signOut(auth);
    }
  };

  const createArticle = async (
    input: Omit<NewsArticle, 'id' | 'authorId' | 'views'>
  ): Promise<string> => {
    if (!isAdmin) throw new Error('कृपया पहले एडमिन लॉग इन करें।');
    const cleanSlug = sanitizeSlug(input.slug || input.title);
    const articleId = `art-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 6)}`;

    const newArticle: NewsArticle = {
      id: articleId,
      title: input.title.trim().slice(0, 300),
      slug: cleanSlug,
      category: input.category.trim().slice(0, 100),
      subCategory: input.subCategory?.trim().slice(0, 100) || undefined,
      city: input.city?.trim().slice(0, 100) || undefined,
      description: input.description.trim().slice(0, 1000),
      content: input.content.trim().slice(0, 50000),
      featuredImage: input.featuredImage.trim().slice(0, 2000),
      imageCaption: input.imageCaption?.trim().slice(0, 500) || undefined,
      author: (input.author || 'NBI News ब्यूरो').trim().slice(0, 150),
      authorId: currentUser?.uid || localAdminSession?.adminId || 'nbi-admin',
      publishedAt: (input.publishedAt || new Date().toISOString()).slice(0, 60),
      scheduledFor: input.scheduledFor?.trim().slice(0, 60) || undefined,
      status: input.status,
      isFeatured: Boolean(input.isFeatured),
      isBreaking: Boolean(input.isBreaking),
      isTrending: Boolean(input.isTrending),
      trendingRank:
        typeof input.trendingRank === 'number'
          ? Math.min(1000, Math.max(0, input.trendingRank))
          : undefined,
      views: 0,
      isDemo: false,
    };

    const nextLocal = [newArticle, ...localArticles];
    setLocalArticles(nextLocal);
    localStorage.setItem('nbi_local_articles_v1', JSON.stringify(nextLocal));

    if (currentUser && firebaseIsAdmin) {
      const payload: Record<string, unknown> = {
        title: newArticle.title,
        slug: newArticle.slug,
        category: newArticle.category,
        description: newArticle.description,
        content: newArticle.content,
        featuredImage: newArticle.featuredImage,
        author: newArticle.author,
        authorId: currentUser.uid,
        publishedAt: newArticle.publishedAt,
        status: newArticle.status,
        isFeatured: newArticle.isFeatured,
        isBreaking: newArticle.isBreaking,
        isTrending: newArticle.isTrending,
        views: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      if (newArticle.subCategory) payload.subCategory = newArticle.subCategory;
      if (newArticle.city) payload.city = newArticle.city;
      if (newArticle.imageCaption) payload.imageCaption = newArticle.imageCaption;
      if (newArticle.scheduledFor) payload.scheduledFor = newArticle.scheduledFor;
      if (typeof newArticle.trendingRank === 'number') {
        payload.trendingRank = newArticle.trendingRank;
      }
      try {
        await setDoc(doc(db, 'articles', articleId), payload);
      } catch {
        // Local persistence already updated
      }
    }

    return articleId;
  };

  const updateArticle = async (
    id: string,
    input: Partial<NewsArticle>
  ): Promise<void> => {
    if (!isAdmin) throw new Error('कृपया पहले एडमिन लॉग इन करें।');
    const existingArticle = articles.find((a) => a.id === id);
    if (!existingArticle) throw new Error('खबर नहीं मिली।');

    const merged: NewsArticle = {
      ...existingArticle,
      ...input,
      slug: sanitizeSlug(input.slug || existingArticle.slug || existingArticle.title),
      isDemo: false,
    };

    const nextLocal = [
      merged,
      ...localArticles.filter((a) => a.id !== id),
    ];
    setLocalArticles(nextLocal);
    localStorage.setItem('nbi_local_articles_v1', JSON.stringify(nextLocal));

    if (currentUser && firebaseIsAdmin) {
      const isAlreadyInCloud = cloudArticles.some((a) => a.id === id);
      const payload: Record<string, unknown> = {
        title: merged.title.trim().slice(0, 300),
        slug: merged.slug,
        category: merged.category.trim().slice(0, 100),
        description: merged.description.trim().slice(0, 1000),
        content: merged.content.trim().slice(0, 50000),
        featuredImage: merged.featuredImage.trim().slice(0, 2000),
        author: merged.author.trim().slice(0, 150),
        publishedAt: merged.publishedAt.slice(0, 60),
        status: merged.status,
        isFeatured: Boolean(merged.isFeatured),
        isBreaking: Boolean(merged.isBreaking),
        isTrending: Boolean(merged.isTrending),
        views: Math.max(0, merged.views || 0),
        updatedAt: serverTimestamp(),
      };
      if (merged.subCategory) payload.subCategory = merged.subCategory;
      if (merged.city) payload.city = merged.city;
      if (merged.imageCaption) payload.imageCaption = merged.imageCaption;
      if (merged.scheduledFor) payload.scheduledFor = merged.scheduledFor;
      if (typeof merged.trendingRank === 'number') {
        payload.trendingRank = merged.trendingRank;
      }

      try {
        if (!isAlreadyInCloud) {
          await setDoc(doc(db, 'articles', id), {
            ...payload,
            authorId: currentUser.uid,
            createdAt: serverTimestamp(),
          });
        } else {
          await updateDoc(doc(db, 'articles', id), payload);
        }
      } catch {
        // Local persistence already updated
      }
    }
  };

  const deleteArticle = async (id: string): Promise<void> => {
    if (!isAdmin) throw new Error('कृपया पहले एडमिन लॉग इन करें।');
    const nextDeleted = [...deletedDemoIds, id];
    setDeletedDemoIds(nextDeleted);
    localStorage.setItem('nbi_deleted_demo_ids', JSON.stringify(nextDeleted));

    const nextLocal = localArticles.filter((a) => a.id !== id);
    setLocalArticles(nextLocal);
    localStorage.setItem('nbi_local_articles_v1', JSON.stringify(nextLocal));

    if (currentUser && firebaseIsAdmin && cloudArticles.some((a) => a.id === id)) {
      try {
        await deleteDoc(doc(db, 'articles', id));
      } catch {
        // Handled locally
      }
    }
  };

  const saveCategory = async (
    cat: Omit<NewsCategory, 'id'> & { id?: string }
  ): Promise<void> => {
    if (!isAdmin) throw new Error('कृपया पहले एडमिन लॉग इन करें।');
    const cleanSlug = sanitizeSlug(cat.slug || cat.englishName || cat.name).slice(
      0,
      100
    );
    const categoryId = cat.id || `cat-${cleanSlug}`;

    const newCat: NewsCategory = {
      id: categoryId,
      name: cat.name.trim().slice(0, 100),
      englishName: cleanSlug,
      slug: cleanSlug,
      description: cat.description.trim().slice(0, 500),
      order: Math.min(1000, Math.max(0, Number(cat.order) || 1)),
      isActive: Boolean(cat.isActive),
    };

    const nextLocal = [
      newCat,
      ...localCategories.filter((c) => c.slug !== cleanSlug && c.id !== categoryId),
    ];
    setLocalCategories(nextLocal);
    localStorage.setItem('nbi_local_categories_v1', JSON.stringify(nextLocal));

    if (currentUser && firebaseIsAdmin) {
      const isAlreadyInCloud = cloudCategories.some((c) => c.id === categoryId);
      const basePayload = {
        name: newCat.name,
        slug: newCat.slug,
        description: newCat.description,
        order: newCat.order,
        isActive: newCat.isActive,
        updatedAt: serverTimestamp(),
      };
      try {
        if (!isAlreadyInCloud) {
          await setDoc(doc(db, 'categories', categoryId), {
            ...basePayload,
            createdAt: serverTimestamp(),
          });
        } else {
          await updateDoc(doc(db, 'categories', categoryId), basePayload);
        }
      } catch {
        // Saved locally
      }
    }
  };

  const removeCategory = async (id: string): Promise<void> => {
    if (!isAdmin) throw new Error('कृपया पहले एडमिन लॉग इन करें।');
    const nextLocal = localCategories.filter((c) => c.id !== id);
    setLocalCategories(nextLocal);
    localStorage.setItem('nbi_local_categories_v1', JSON.stringify(nextLocal));

    if (currentUser && firebaseIsAdmin && cloudCategories.some((c) => c.id === id)) {
      try {
        await deleteDoc(doc(db, 'categories', id));
      } catch {
        // Handled locally
      }
    }
  };

  const saveVideo = async (
    vid: Omit<VideoNewsItem, 'id' | 'authorId'> & { id?: string }
  ): Promise<void> => {
    if (!isAdmin) throw new Error('कृपया पहले एडमिन लॉग इन करें।');
    const videoId = vid.id || `vid-${Date.now().toString(36)}`;
    const newVid: VideoNewsItem = {
      id: videoId,
      title: vid.title.trim().slice(0, 300),
      category: vid.category.trim().slice(0, 100),
      thumbnailUrl: vid.thumbnailUrl.trim().slice(0, 2000),
      videoUrl: vid.videoUrl.trim().slice(0, 2000),
      duration: vid.duration.trim().slice(0, 20),
      isVertical: Boolean(vid.isVertical),
      publishedAt: (vid.publishedAt || new Date().toISOString()).slice(0, 60),
      authorId: currentUser?.uid || localAdminSession?.adminId || 'nbi-admin',
      status: vid.status,
    };

    const nextLocal = [newVid, ...localVideos.filter((v) => v.id !== videoId)];
    setLocalVideos(nextLocal);
    localStorage.setItem('nbi_local_videos_v1', JSON.stringify(nextLocal));

    if (currentUser && firebaseIsAdmin) {
      const isAlreadyInCloud = cloudVideos.some((v) => v.id === videoId);
      const basePayload = {
        title: newVid.title,
        category: newVid.category,
        thumbnailUrl: newVid.thumbnailUrl,
        videoUrl: newVid.videoUrl,
        duration: newVid.duration,
        isVertical: newVid.isVertical,
        publishedAt: newVid.publishedAt,
        status: newVid.status,
        updatedAt: serverTimestamp(),
      };
      try {
        if (!isAlreadyInCloud) {
          await setDoc(doc(db, 'videos', videoId), {
            ...basePayload,
            authorId: currentUser.uid,
            createdAt: serverTimestamp(),
          });
        } else {
          await updateDoc(doc(db, 'videos', videoId), basePayload);
        }
      } catch {
        // Saved locally
      }
    }
  };

  const removeVideo = async (id: string): Promise<void> => {
    if (!isAdmin) throw new Error('कृपया पहले एडमिन लॉग इन करें।');
    const nextLocal = localVideos.filter((v) => v.id !== id);
    setLocalVideos(nextLocal);
    localStorage.setItem('nbi_local_videos_v1', JSON.stringify(nextLocal));

    if (currentUser && firebaseIsAdmin && cloudVideos.some((v) => v.id === id)) {
      try {
        await deleteDoc(doc(db, 'videos', id));
      } catch {
        // Handled locally
      }
    }
  };

  const savePortalSettings = async (
    nextSettings: Omit<PortalSettings, 'updatedBy'>
  ): Promise<void> => {
    if (!isAdmin) throw new Error('कृपया पहले एडमिन लॉग इन करें।');
    const resolved: PortalSettings = {
      breakingNewsTicker: nextSettings.breakingNewsTicker.trim().slice(0, 1000),
      breakingNewsActive: Boolean(nextSettings.breakingNewsActive),
      bannerTitle: nextSettings.bannerTitle.trim().slice(0, 300),
      bannerLink: nextSettings.bannerLink.trim().slice(0, 500),
      bannerActive: Boolean(nextSettings.bannerActive),
      facebookUrl: nextSettings.facebookUrl.trim().slice(0, 500),
      instagramUrl: nextSettings.instagramUrl.trim().slice(0, 500),
      youtubeUrl: nextSettings.youtubeUrl.trim().slice(0, 500),
      twitterUrl: nextSettings.twitterUrl.trim().slice(0, 500),
      whatsappChannelUrl: nextSettings.whatsappChannelUrl.trim().slice(0, 500),
      contactEmail: nextSettings.contactEmail.trim().slice(0, 200),
      contactPhone: nextSettings.contactPhone.trim().slice(0, 50),
      updatedBy: currentUser?.uid || localAdminSession?.adminId || 'nbi-admin',
    };

    setLocalSettings(resolved);
    localStorage.setItem('nbi_local_settings_v1', JSON.stringify(resolved));

    if (currentUser && firebaseIsAdmin) {
      const payload = {
        ...resolved,
        updatedBy: currentUser.uid,
        updatedAt: serverTimestamp(),
      };
      try {
        if (!cloudSettings) {
          await setDoc(doc(db, 'settings', 'portal'), payload);
        } else {
          await updateDoc(doc(db, 'settings', 'portal'), payload);
        }
      } catch {
        // Saved locally
      }
    }
  };

  const seedDemoContentToCloud = async (): Promise<number> => {
    if (!isAdmin) throw new Error('कृपया पहले एडमिन लॉग इन करें।');
    let count = 0;
    if (currentUser && firebaseIsAdmin) {
      for (const demo of DEMO_ARTICLES) {
        if (!cloudArticles.some((a) => a.id === demo.id)) {
          const payload: Record<string, unknown> = {
            title: demo.title.slice(0, 300),
            slug: sanitizeSlug(demo.slug),
            category: demo.category,
            description: demo.description.slice(0, 1000),
            content: demo.content.slice(0, 50000),
            featuredImage: demo.featuredImage.slice(0, 2000),
            author: demo.author.slice(0, 150),
            authorId: currentUser.uid,
            publishedAt: demo.publishedAt,
            status: demo.status,
            isFeatured: demo.isFeatured,
            isBreaking: demo.isBreaking,
            isTrending: demo.isTrending,
            views: demo.views,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          if (demo.subCategory) payload.subCategory = demo.subCategory;
          if (demo.city) payload.city = demo.city;
          if (demo.imageCaption) payload.imageCaption = demo.imageCaption;
          if (typeof demo.trendingRank === 'number') {
            payload.trendingRank = demo.trendingRank;
          }
          await setDoc(doc(db, 'articles', demo.id), payload);
          count++;
        }
      }
    } else {
      setLocalArticles(DEMO_ARTICLES);
      localStorage.setItem('nbi_local_articles_v1', JSON.stringify(DEMO_ARTICLES));
      count = DEMO_ARTICLES.length;
    }
    return count;
  };

  return (
    <NewsContext.Provider
      value={{
        articles,
        publishedArticles,
        categories,
        videos,
        settings,
        loading,
        currentUser,
        activeAdminDisplay,
        isAdmin,
        authReady,
        usingDemoFallback: cloudArticles.length === 0,
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
      }}
    >
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  const ctx = useContext(NewsContext);
  if (!ctx) throw new Error('useNews must be used inside NewsProvider');
  return ctx;
}
