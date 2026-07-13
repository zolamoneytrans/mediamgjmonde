import { db } from '../firebase/config';
import { collection, doc, setDoc, getDocs } from 'firebase/firestore';

export interface MediaVideoItem {
  id: string;
  title: string;
  platform: 'youtube' | 'facebook';
  embedUrl: string;
  date: string;
  category: 'Conventions KZI' | 'Veillées Joël 2:28' | 'Enseignements' | 'Messages & Exhortations';
  views: string;
  likes: string;
  description: string;
  thumbnailUrl?: string;
  duration?: string;
  publishedAt?: string;
}

// Configuration & Constants
export const YOUTUBE_API_KEY = (import.meta as any).env.VITE_YOUTUBE_API_KEY || 'AIzaSyDMD10jygYxw5T7aQMB9uNQccZiGWLdOI0';
export const YOUTUBE_HANDLE = '@mediaministeresgenerationj4157';

// Resolved defaults / fallbacks (to save API quota and avoid re-resolving on every load)
export const FALLBACK_CHANNEL_ID = (import.meta as any).env.VITE_YOUTUBE_CHANNEL_ID || 'UCUErfJlUHAPNOzTNQIEPnww';
export const FALLBACK_UPLOADS_PLAYLIST_ID = (import.meta as any).env.VITE_YOUTUBE_UPLOADS_PLAYLIST_ID || 'UUUErfJlUHAPNOzTNQIEPnww';

const CACHE_KEY_VIDEOS = 'mediamondemjg_youtube_videos_cache_v1';
const CACHE_KEY_TIMESTAMP = 'mediamondemjg_youtube_cache_timestamp_v1';
const CACHE_KEY_RESOLVED_CHANNEL_ID = 'mediamondemjg_resolved_channel_id';
const CACHE_KEY_RESOLVED_PLAYLIST_ID = 'mediamondemjg_resolved_uploads_playlist_id';

// Default TTL: 6 hours in ms
const DEFAULT_TTL_MS = 6 * 60 * 60 * 1000;

/**
 * Categorize video intelligently based on title and description
 */
export function categorizeVideo(title: string, description = ''): MediaVideoItem['category'] {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes('convention') || text.includes('kzi') || text.includes('kolwezi') || text.includes('30e') || text.includes('28e')) {
    return 'Conventions KZI';
  }
  if (text.includes('veillée') || text.includes('veillee') || text.includes('adoration') || text.includes('culte') || text.includes('prière') || text.includes('priere') || text.includes('louange') || text.includes('intercession')) {
    return 'Veillées Joël 2:28';
  }
  if (text.includes('enseignement') || text.includes('séminaire') || text.includes('seminaire') || text.includes('formation') || text.includes('école') || text.includes('ecole') || text.includes('conférence') || text.includes('conference')) {
    return 'Enseignements';
  }
  return 'Messages & Exhortations';
}

/**
 * Format ISO 8601 duration (PT1H12M30S -> 1:12:30 or 14:20)
 */
export function formatDuration(isoDuration?: string): string {
  if (!isoDuration) return 'VOD';
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 'VOD';
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format ISO date string to readable French/English date
 */
export function formatPublishDate(isoDate?: string): string {
  if (!isoDate) return 'Récemment';
  try {
    const date = new Date(isoDate);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return 'Récemment';
  }
}

/**
 * Resolve Channel ID and Uploads Playlist ID via channels.list endpoint.
 * Stores result after first lookup so we don't re-resolve on every app open.
 */
export async function resolveChannelAndUploadsPlaylist(): Promise<{ channelId: string; uploadsPlaylistId: string }> {
  // Check local cache/constants first
  const cachedChannelId = localStorage.getItem(CACHE_KEY_RESOLVED_CHANNEL_ID) || FALLBACK_CHANNEL_ID;
  const cachedPlaylistId = localStorage.getItem(CACHE_KEY_RESOLVED_PLAYLIST_ID) || FALLBACK_UPLOADS_PLAYLIST_ID;

  if (cachedChannelId && cachedPlaylistId) {
    return { channelId: cachedChannelId, uploadsPlaylistId: cachedPlaylistId };
  }

  // If online and missing, resolve via API
  if (navigator.onLine && YOUTUBE_API_KEY) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&forHandle=${encodeURIComponent(YOUTUBE_HANDLE)}&key=${YOUTUBE_API_KEY}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const item = data.items?.[0];
        if (item) {
          const resolvedChannelId = item.id || FALLBACK_CHANNEL_ID;
          const resolvedPlaylistId = item.contentDetails?.relatedPlaylists?.uploads || FALLBACK_UPLOADS_PLAYLIST_ID;

          localStorage.setItem(CACHE_KEY_RESOLVED_CHANNEL_ID, resolvedChannelId);
          localStorage.setItem(CACHE_KEY_RESOLVED_PLAYLIST_ID, resolvedPlaylistId);

          return { channelId: resolvedChannelId, uploadsPlaylistId: resolvedPlaylistId };
        }
      }
    } catch (err) {
      console.warn('Unable to resolve channel handle, using fallbacks:', err);
    }
  }

  return { channelId: cachedChannelId, uploadsPlaylistId: cachedPlaylistId };
}

/**
 * Sync fetched videos to Firestore `mediaVideos` collection
 */
async function syncToFirestoreCache(videos: MediaVideoItem[]): Promise<void> {
  if (!navigator.onLine) return;
  try {
    const collRef = collection(db, 'mediaVideos');
    // Save up to top 30 videos to avoid long batch loops
    for (const video of videos.slice(0, 30)) {
      await setDoc(doc(collRef, video.id), video, { merge: true });
    }
  } catch (err) {
    console.warn('Quietly caught Firestore offline/permission sync error for mediaVideos:', err);
  }
}

/**
 * Sort videos from latest published video to oldest one (descending by publishedAt or date)
 */
export function sortVideosByLatest(videos: MediaVideoItem[]): MediaVideoItem[] {
  return [...videos].sort((a, b) => {
    const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return timeB - timeA;
  });
}

/**
 * Load cached videos from Firestore if local cache is empty
 */
async function loadFromFirestoreCache(): Promise<MediaVideoItem[] | null> {
  try {
    const snapshot = await getDocs(collection(db, 'mediaVideos'));
    if (!snapshot.empty) {
      const items: MediaVideoItem[] = [];
      snapshot.forEach(docSnap => {
        items.push(docSnap.data() as MediaVideoItem);
      });
      if (items.length > 0) {
        return sortVideosByLatest(items);
      }
    }
  } catch (err) {
    console.warn('Quietly caught Firestore read for mediaVideos:', err);
  }
  return null;
}

export interface FetchYouTubeResult {
  videos: MediaVideoItem[];
  isOffline: boolean;
  lastUpdated: number | null;
  fromCache: boolean;
  error?: string;
}

/**
 * Main quota-friendly function to fetch YouTube uploads via `playlistItems.list`.
 * Respects cache TTL (6 hours default) and offline-first persistence.
 */
export async function fetchAndCacheVideos(options: {
  forceRefresh?: boolean;
  ttlHours?: number;
} = {}): Promise<FetchYouTubeResult> {
  const { forceRefresh = false, ttlHours = 6 } = options;
  const ttlMs = ttlHours * 60 * 60 * 1000;

  const cachedJson = localStorage.getItem(CACHE_KEY_VIDEOS);
  const cachedTimestampStr = localStorage.getItem(CACHE_KEY_TIMESTAMP);
  const lastUpdated = cachedTimestampStr ? parseInt(cachedTimestampStr, 10) : null;

  let localVideos: MediaVideoItem[] = [];
  if (cachedJson) {
    try {
      localVideos = JSON.parse(cachedJson);
    } catch {
      localVideos = [];
    }
  }

  // 1. If Offline -> immediately return local cache or Firestore
  if (!navigator.onLine) {
    if (localVideos.length > 0) {
      return { videos: sortVideosByLatest(localVideos), isOffline: true, lastUpdated, fromCache: true };
    }
    const firestoreVideos = await loadFromFirestoreCache();
    if (firestoreVideos && firestoreVideos.length > 0) {
      const sorted = sortVideosByLatest(firestoreVideos);
      localStorage.setItem(CACHE_KEY_VIDEOS, JSON.stringify(sorted));
      return { videos: sorted, isOffline: true, lastUpdated: Date.now(), fromCache: true };
    }
    return { videos: [], isOffline: true, lastUpdated, fromCache: true, error: 'Connexion requise pour le premier chargement.' };
  }

  // 2. If Online and NOT forcing refresh and cache is fresh -> return cache directly (0 quota cost!)
  if (!forceRefresh && lastUpdated && (Date.now() - lastUpdated < ttlMs) && localVideos.length > 0) {
    return { videos: sortVideosByLatest(localVideos), isOffline: false, lastUpdated, fromCache: true };
  }

  // 3. Otherwise, fetch from YouTube API using efficient `playlistItems.list`
  try {
    const { uploadsPlaylistId } = await resolveChannelAndUploadsPlaylist();

    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${uploadsPlaylistId}&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(playlistUrl);

    if (!response.ok) {
      const errText = await response.text();
      console.warn('YouTube API call failed:', response.status, errText);
      // Fallback to cache if API returns error (e.g. quota limit exceeded)
      if (localVideos.length > 0) {
        return { videos: sortVideosByLatest(localVideos), isOffline: false, lastUpdated, fromCache: true, error: 'Quota YouTube atteint ou erreur API. Affichage du cache.' };
      }
      throw new Error(`YouTube API HTTP ${response.status}`);
    }

    const data = await response.json();
    const items = data.items || [];

    // Optionally enrich with video duration/statistics via 1 `videos.list` batch call (1 quota unit for up to 50 items)
    const videoIds: string[] = items
      .map((item: any) => item.contentDetails?.videoId || item.snippet?.resourceId?.videoId)
      .filter(Boolean);

    const enrichMap: Record<string, { duration: string; views: string; likes: string }> = {};

    if (videoIds.length > 0) {
      try {
        const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds.join(',')}&key=${YOUTUBE_API_KEY}`;
        const vidRes = await fetch(videosUrl);
        if (vidRes.ok) {
          const vidData = await vidRes.json();
          (vidData.items || []).forEach((v: any) => {
            const vidId = v.id;
            const duration = formatDuration(v.contentDetails?.duration);
            const viewCount = v.statistics?.viewCount ? `${parseInt(v.statistics.viewCount, 10).toLocaleString('fr-FR')} vues` : 'VOD YouTube';
            const likeCount = v.statistics?.likeCount ? `${parseInt(v.statistics.likeCount, 10).toLocaleString('fr-FR')} J'aime` : 'Officiel MGJ';
            enrichMap[vidId] = { duration, views: viewCount, likes: likeCount };
          });
        }
      } catch (enrichErr) {
        console.warn('Enrichment batch call failed, using default video stats:', enrichErr);
      }
    }

    // Build structured list
    const fetchedVideos: MediaVideoItem[] = sortVideosByLatest(items.map((item: any) => {
      const vidId = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId || '';
      const title = item.snippet?.title || 'Vidéo MGJ Officielle';
      const description = item.snippet?.description || '';
      const publishedAt = item.snippet?.publishedAt || '';
      const dateFormatted = formatPublishDate(publishedAt);
      const thumb = item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || '';

      const enriched = enrichMap[vidId] || { duration: 'VOD', views: 'VOD YouTube', likes: 'Officiel MGJ' };
      const category = categorizeVideo(title, description);

      return {
        id: vidId,
        title: title.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"'),
        platform: 'youtube',
        embedUrl: `https://www.youtube.com/embed/${vidId}?rel=0`,
        date: dateFormatted,
        category,
        views: enriched.views,
        likes: enriched.likes,
        description: description.slice(0, 350) + (description.length > 350 ? '...' : ''),
        thumbnailUrl: thumb,
        duration: enriched.duration,
        publishedAt
      };
    }).filter((v: MediaVideoItem) => Boolean(v.id) && v.title !== 'Private video' && v.title !== 'Deleted video'));

    if (fetchedVideos.length > 0) {
      const now = Date.now();
      localStorage.setItem(CACHE_KEY_VIDEOS, JSON.stringify(fetchedVideos));
      localStorage.setItem(CACHE_KEY_TIMESTAMP, String(now));

      // Asynchronously sync to Firestore offline/online cache
      syncToFirestoreCache(fetchedVideos);

      return { videos: fetchedVideos, isOffline: false, lastUpdated: now, fromCache: false };
    } else if (localVideos.length > 0) {
      return { videos: sortVideosByLatest(localVideos), isOffline: false, lastUpdated, fromCache: true };
    }

    return { videos: [], isOffline: false, lastUpdated: null, fromCache: false };
  } catch (err: any) {
    console.error('fetchAndCacheVideos error:', err);
    if (localVideos.length > 0) {
      return { videos: sortVideosByLatest(localVideos), isOffline: false, lastUpdated, fromCache: true, error: 'Connexion à YouTube interrompue. Mode cache actif.' };
    }
    const firestoreVideos = await loadFromFirestoreCache();
    if (firestoreVideos && firestoreVideos.length > 0) {
      const sorted = sortVideosByLatest(firestoreVideos);
      localStorage.setItem(CACHE_KEY_VIDEOS, JSON.stringify(sorted));
      return { videos: sorted, isOffline: true, lastUpdated: Date.now(), fromCache: true };
    }
    return { videos: [], isOffline: !navigator.onLine, lastUpdated, fromCache: true, error: err.message || 'Erreur lors du chargement des vidéos.' };
  }
}
