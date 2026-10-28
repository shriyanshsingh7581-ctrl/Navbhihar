import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  onAuthStateChanged,
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
  handleFirestoreError,
  isAuthorizedAdminEmail,
  OperationType,
  sanitizeSlug,
} from '../lib/firebase';
import {
  NewsArticle,
  NewsCategory,
  PortalSettings,
  VideoNewsItem,
} from '../types/news';

interface NewsContextValue {
  articles: NewsArticle[];
  publishedArticles: NewsArticle[];
  categories: NewsCategory[];
  videos: VideoNewsItem[];
  settings: PortalSettings;
  loading: boolean;
  currentUser: User | null;
  isAdmin: boolean;
  authReady: boolean;
  usingDemoFallback: boolean;
  loginWithGoogle: () => Promise<void>;
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

export function NewsProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authReady, setAuthReady] = useState<boolean>(false);

  const [cloudArticles, setCloudArticles] = useState<NewsArticle[]>([]);
  const [cloudCategories, setCloudCategories] = useState<NewsCategory[]>([]);
  const [cloudVideos, setCloudVideos] = useState<VideoNewsItem[]>([]);
  const [cloudSettings, setCloudSettings] = useState<PortalSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletedDemoIds, setDeletedDemoIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nbi_deleted_demo_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user && user.emailVerified) {
        if (isAuthorizedAdminEmail(user.email)) {
          setIsAdmin(true);
        } else {
          try {
            const adminSnap = await getDoc(doc(db, 'admins', user.uid));
            setIsAdmin(adminSnap.exists());
          } catch {
            setIsAdmin(false);
          }
        }
      } else {
        setIsAdmin(false);
      }
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!authReady) return;

    const articlesQuery = isAdmin
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
      (error) => {
        console.warn('Articles listener fallback active:', error.message);
        setLoading(false);
      }
    );

    const categoriesQuery = isAdmin
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
      (error) => {
        console.warn('Categories listener fallback active:', error.message);
      }
    );

    const videosQuery = isAdmin
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
      (error) => {
        console.warn('Videos listener fallback active:', error.message);
      }
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
      (error) => {
        console.warn('Settings listener fallback active:', error.message);
      }
    );

    return () => {
      unsubArticles();
      unsubCategories();
      unsubVideos();
      unsubSettings();
    };
  }, [authReady, isAdmin]);

  const articles = useMemo(() => {
    const cloudSlugs = new Set(cloudArticles.map((a) => a.slug));
    const cloudIds = new Set(cloudArticles.map((a) => a.id));
    const remainingDemo = DEMO_ARTICLES.filter(
      (d) =>
        !cloudIds.has(d.id) &&
        !cloudSlugs.has(d.slug) &&
        !deletedDemoIds.includes(d.id)
    );
    const combined = [...cloudArticles, ...remainingDemo];
    return combined.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [cloudArticles, deletedDemoIds]);

  const publishedArticles = useMemo(
    () => articles.filter((a) => a.status === 'published'),
    [articles]
  );

  const categories = useMemo(() => {
    if (cloudCategories.length === 0) return DEFAULT_CATEGORIES;
    const cloudSlugs = new Set(cloudCategories.map((c) => c.slug));
    const merged = [
      ...cloudCategories,
      ...DEFAULT_CATEGORIES.filter((d) => !cloudSlugs.has(d.slug)),
    ];
    return merged.sort((a, b) => a.order - b.order);
  }, [cloudCategories]);

  const videos = useMemo(() => {
    if (cloudVideos.length === 0) return DEMO_VIDEOS;
    const cloudIds = new Set(cloudVideos.map((v) => v.id));
    return [...cloudVideos, ...DEMO_VIDEOS.filter((d) => !cloudIds.has(d.id))];
  }, [cloudVideos]);

  const settings = cloudSettings || DEFAULT_PORTAL_SETTINGS;

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

  const logoutUser = async () => {
    await signOut(auth);
  };

  const createArticle = async (
    input: Omit<NewsArticle, 'id' | 'authorId' | 'views'>
  ): Promise<string> => {
    if (!currentUser) throw new Error('कृपया पहले एडमिन लॉग इन करें।');
    const cleanSlug = sanitizeSlug(input.slug || input.title);
    const articleId = `art-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 6)}`;
    const path = `articles/${articleId}`;

    const payload: Record<string, unknown> = {
      title: input.title.trim().slice(0, 300),
      slug: cleanSlug,
      category: input.category.trim().slice(0, 100),
      description: input.description.trim().slice(0, 1000),
      content: input.content.trim().slice(0, 50000),
      featuredImage: input.featuredImage.trim().slice(0, 2000),
      author: (input.author || 'NBI News ब्यूरो').trim().slice(0, 150),
      authorId: currentUser.uid,
      publishedAt: (input.publishedAt || new Date().toISOString()).slice(0, 60),
      status: input.status,
      isFeatured: Boolean(input.isFeatured),
      isBreaking: Boolean(input.isBreaking),
      isTrending: Boolean(input.isTrending),
      views: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (input.subCategory && input.subCategory.trim()) {
      payload.subCategory = input.subCategory.trim().slice(0, 100);
    }
    if (input.city && input.city.trim()) {
      payload.city = input.city.trim().slice(0, 100);
    }
    if (input.imageCaption && input.imageCaption.trim()) {
      payload.imageCaption = input.imageCaption.trim().slice(0, 500);
    }
    if (input.scheduledFor && input.scheduledFor.trim()) {
      payload.scheduledFor = input.scheduledFor.trim().slice(0, 60);
    }
    if (typeof input.trendingRank === 'number') {
      payload.trendingRank = Math.min(1000, Math.max(0, input.trendingRank));
    }

    try {
      await setDoc(doc(db, 'articles', articleId), payload);
      return articleId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const updateArticle = async (
    id: string,
    input: Partial<NewsArticle>
  ): Promise<void> => {
    if (!currentUser) throw new Error('कृपया पहले एडमिन लॉग इन करें।');
    const existingArticle = articles.find((a) => a.id === id);
    if (!existingArticle) throw new Error('खबर नहीं मिली।');

    // If editing a built-in demo article that isn't in Firestore yet, promote it to Firestore
    const isAlreadyInCloud = cloudArticles.some((a) => a.id === id);
    const merged = { ...existingArticle, ...input };
    const cleanSlug = sanitizeSlug(merged.slug || merged.title);
    const path = `articles/${id}`;

    const payload: Record<string, unknown> = {
      title: merged.title.trim().slice(0, 300),
      slug: cleanSlug,
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

    if (merged.subCategory && merged.subCategory.trim()) {
      payload.subCategory = merged.subCategory.trim().slice(0, 100);
    }
    if (merged.city && merged.city.trim()) {
      payload.city = merged.city.trim().slice(0, 100);
    }
    if (merged.imageCaption && merged.imageCaption.trim()) {
      payload.imageCaption = merged.imageCaption.trim().slice(0, 500);
    }
    if (merged.scheduledFor && merged.scheduledFor.trim()) {
      payload.scheduledFor = merged.scheduledFor.trim().slice(0, 60);
    }
    if (typeof merged.trendingRank === 'number') {
      payload.trendingRank = Math.min(1000, Math.max(0, merged.trendingRank));
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
    } catch (error) {
      handleFirestoreError(
        error,
        isAlreadyInCloud ? OperationType.UPDATE : OperationType.CREATE,
        path
      );
    }
  };

  const deleteArticle = async (id: string): Promise<void> => {
    if (!currentUser) throw new Error('कृपया पहले एडमिन लॉग इन करें।');
    const isAlreadyInCloud = cloudArticles.some((a) => a.id === id);
    if (!isAlreadyInCloud) {
      const next = [...deletedDemoIds, id];
      setDeletedDemoIds(next);
      localStorage.setItem('nbi_deleted_demo_ids', JSON.stringify(next));
      return;
    }
    const path = `articles/${id}`;
    try {
      await deleteDoc(doc(db, 'articles', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const saveCategory = async (
    cat: Omit<NewsCategory, 'id'> & { id?: string }
  ): Promise<void> => {
    if (!currentUser) throw new Error('कृपया पहले एडमिन लॉग इन करें।');
    const cleanSlug = sanitizeSlug(cat.slug || cat.englishName || cat.name);
    const categoryId = cat.id || `cat-${cleanSlug}`;
    const isAlreadyInCloud = cloudCategories.some((c) => c.id === categoryId);
    const path = `categories/${categoryId}`;

    const basePayload = {
      name: cat.name.trim().slice(0, 100),
      slug: cleanSlug.slice(0, 100),
      description: cat.description.trim().slice(0, 500),
      order: Math.min(1000, Math.max(0, Number(cat.order) || 1)),
      isActive: Boolean(cat.isActive),
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
    } catch (error) {
      handleFirestoreError(
        error,
        isAlreadyInCloud ? OperationType.UPDATE : OperationType.CREATE,
        path
      );
    }
  };

  const removeCategory = async (id: string): Promise<void> => {
    if (!currentUser) throw new Error('कृपया पहले एडमिन लॉग इन करें।');
    const isAlreadyInCloud = cloudCategories.some((c) => c.id === id);
    if (!isAlreadyInCloud) return;
    const path = `categories/${id}`;
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const saveVideo = async (
    vid: Omit<VideoNewsItem, 'id' | 'authorId'> & { id?: string }
  ): Promise<void> => {
    if (!currentUser) throw new Error('कृपया पहले एडमिन लॉग इन करें।');
    const videoId = vid.id || `vid-${Date.now().toString(36)}`;
    const isAlreadyInCloud = cloudVideos.some((v) => v.id === videoId);
    const path = `videos/${videoId}`;

    const basePayload = {
      title: vid.title.trim().slice(0, 300),
      category: vid.category.trim().slice(0, 100),
      thumbnailUrl: vid.thumbnailUrl.trim().slice(0, 2000),
      videoUrl: vid.videoUrl.trim().slice(0, 2000),
      duration: vid.duration.trim().slice(0, 20),
      isVertical: Boolean(vid.isVertical),
      publishedAt: (vid.publishedAt || new Date().toISOString()).slice(0, 60),
      status: vid.status,
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
    } catch (error) {
      handleFirestoreError(
        error,
        isAlreadyInCloud ? OperationType.UPDATE : OperationType.CREATE,
        path
      );
    }
  };

  const removeVideo = async (id: string): Promise<void> => {
    if (!currentUser) throw new Error('कृपया पहले एडमिन लॉग इन करें।');
    const isAlreadyInCloud = cloudVideos.some((v) => v.id === id);
    if (!isAlreadyInCloud) return;
    const path = `videos/${id}`;
    try {
      await deleteDoc(doc(db, 'videos', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const savePortalSettings = async (
    nextSettings: Omit<PortalSettings, 'updatedBy'>
  ): Promise<void> => {
    if (!currentUser) throw new Error('कृपया पहले एडमिन लॉग इन करें।');
    const path = 'settings/portal';
    const payload = {
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
      updatedBy: currentUser.uid,
      updatedAt: serverTimestamp(),
    };

    try {
      if (!cloudSettings) {
        await setDoc(doc(db, 'settings', 'portal'), payload);
      } else {
        await updateDoc(doc(db, 'settings', 'portal'), payload);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const seedDemoContentToCloud = async (): Promise<number> => {
    if (!currentUser) throw new Error('कृपया पहले एडमिन लॉग इन करें।');
    let count = 0;
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
        isAdmin,
        authReady,
        usingDemoFallback: cloudArticles.length === 0,
        loginWithGoogle,
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
