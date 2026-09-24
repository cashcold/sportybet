import { SPORTS_CONFIG, SportApiConfig, getTTLForEndpoint } from './sportsConfig';

export interface CacheEntry<T = any> {
  data: T;
  createdAt: number;
  expiresAt: number;
  sport: string;
  endpoint: string;
  cacheKey: string;
  lastApiRequestTime: number;
  status: 'valid' | 'stale';
}

export interface SportUsageStats {
  sport: string;
  sportName: string;
  dailyLimit: number;
  safetyLimit: number;
  requestsMade: number;
  remainingRequests: number;
  cacheHits: number;
  cacheMisses: number;
  lastApiRequest: string | null;
  lastSuccessfulRequest: string | null;
  lastError: string | null;
  rateLimitHits: number;
  status: 'Healthy' | 'Conservative' | 'Rate Limited' | 'Exhausted';
}

class SportsCacheManager {
  private cache: Map<string, CacheEntry> = new Map();
  // Request deduplication (single-flight locking)
  private inFlightRequests: Map<string, Promise<any>> = new Map();

  // Sport usage tracking
  private usageStats: Map<string, SportUsageStats> = new Map();

  constructor() {
    this.initUsageStats();
  }

  private initUsageStats() {
    Object.values(SPORTS_CONFIG).forEach(sport => {
      this.usageStats.set(sport.id, {
        sport: sport.id,
        sportName: sport.name,
        dailyLimit: sport.dailyLimit,
        safetyLimit: sport.safetyLimit,
        requestsMade: 0,
        remainingRequests: sport.dailyLimit,
        cacheHits: 0,
        cacheMisses: 0,
        lastApiRequest: null,
        lastSuccessfulRequest: null,
        lastError: null,
        rateLimitHits: 0,
        status: 'Healthy'
      });
    });
  }

  /**
   * Generates a deterministic canonical cache key
   * e.g., sports:football:fixtures:league:39:season:2026
   */
  public generateKey(sport: string, endpoint: string, params: Record<string, any> = {}): string {
    const cleanSport = sport.toLowerCase().trim();
    const cleanEndpoint = endpoint.toLowerCase().trim().replace(/^\/+/, '');
    
    // Sort parameter keys for canonical key matching
    const sortedKeys = Object.keys(params)
      .filter(k => params[k] !== undefined && params[k] !== null && params[k] !== '')
      .sort();

    const paramParts = sortedKeys.map(k => `${k}:${String(params[k]).trim()}`);
    if (paramParts.length === 0) {
      return `sports:${cleanSport}:${cleanEndpoint}`;
    }
    return `sports:${cleanSport}:${cleanEndpoint}:${paramParts.join(':')}`;
  }

  /**
   * Retrieve cached data if valid and unexpired
   */
  public get<T = any>(cacheKey: string): { hit: boolean; entry: CacheEntry<T> | null; isStale: boolean } {
    const entry = this.cache.get(cacheKey);
    if (!entry) {
      return { hit: false, entry: null, isStale: false };
    }

    const now = Date.now();
    const isExpired = now >= entry.expiresAt;

    if (!isExpired) {
      return { hit: true, entry, isStale: false };
    }

    // Expired but available as stale fallback
    return { hit: false, entry, isStale: true };
  }

  /**
   * Save response to cache with TTL
   */
  public set<T = any>(
    cacheKey: string,
    sport: string,
    endpoint: string,
    data: T,
    customTTLSeconds?: number
  ): CacheEntry<T> {
    const ttlSeconds = customTTLSeconds || getTTLForEndpoint(endpoint);
    const now = Date.now();
    const entry: CacheEntry<T> = {
      data,
      createdAt: now,
      expiresAt: now + ttlSeconds * 1000,
      sport,
      endpoint,
      cacheKey,
      lastApiRequestTime: now,
      status: 'valid'
    };

    this.cache.set(cacheKey, entry);
    console.log(`[CACHE SAVED] ${cacheKey} (TTL: ${ttlSeconds}s, Expires in: ${ttlSeconds / 60}m)`);
    return entry;
  }

  /**
   * Get an existing stale cache entry if available
   */
  public getStale<T = any>(cacheKey: string): CacheEntry<T> | null {
    const entry = this.cache.get(cacheKey);
    return entry || null;
  }

  /**
   * Check if external request is allowed based on rate-limit & safety thresholds
   */
  public canMakeRequest(sportId: string): { allowed: boolean; reason?: string } {
    const stats = this.getOrCreateStats(sportId);

    // Hard daily limit reached
    if (stats.requestsMade >= stats.dailyLimit) {
      stats.status = 'Exhausted';
      return {
        allowed: false,
        reason: `Daily quota of ${stats.dailyLimit} requests exhausted for ${stats.sportName}. Using cached/stale data.`
      };
    }

    // Rate-limited response received from upstream API
    if (stats.rateLimitHits > 0 && stats.requestsMade >= stats.safetyLimit) {
      stats.status = 'Rate Limited';
      return {
        allowed: false,
        reason: `Upstream rate-limit reached for ${stats.sportName}. Preserving remaining quota.`
      };
    }

    // Safety limit reached: conservative mode
    if (stats.requestsMade >= stats.safetyLimit) {
      stats.status = 'Conservative';
      // In conservative mode, we do NOT allow frequent API calls, but can allow if no cache exists at all
    } else {
      stats.status = 'Healthy';
    }

    return { allowed: true };
  }

  /**
   * Central single-flight request executor with deduplication & stale fallback
   */
  public async executeWithCache<T = any>(
    sport: string,
    endpoint: string,
    params: Record<string, any>,
    fetcher: () => Promise<T>,
    customTTLSeconds?: number
  ): Promise<{ data: T; cached: boolean; stale: boolean; lastUpdated: string; cacheKey: string }> {
    const cacheKey = this.generateKey(sport, endpoint, params);
    const stats = this.getOrCreateStats(sport);

    // 1. Check Cache
    const cacheResult = this.get<T>(cacheKey);
    if (cacheResult.hit && cacheResult.entry) {
      stats.cacheHits++;
      console.log(`[CACHE HIT] ${cacheKey} (${stats.cacheHits} total hits)`);
      return {
        data: cacheResult.entry.data,
        cached: true,
        stale: false,
        lastUpdated: new Date(cacheResult.entry.createdAt).toLocaleTimeString(),
        cacheKey
      };
    }

    stats.cacheMisses++;
    console.log(`[CACHE MISS] ${cacheKey}`);

    // 2. Check if API request is blocked by safety threshold
    const safetyCheck = this.canMakeRequest(sport);
    if (!safetyCheck.allowed) {
      console.warn(`[RATE LIMIT PROTECTION] ${safetyCheck.reason}`);
      if (cacheResult.entry) {
        console.log(`[STALE CACHE FALLBACK] Returning expired data for ${cacheKey}`);
        return {
          data: cacheResult.entry.data,
          cached: true,
          stale: true,
          lastUpdated: new Date(cacheResult.entry.createdAt).toLocaleTimeString(),
          cacheKey
        };
      }
    }

    // 3. Single-flight request deduplication:
    // If another caller is already fetching the exact same key, await that exact same Promise!
    if (this.inFlightRequests.has(cacheKey)) {
      console.log(`[DEDUPLICATION] Joining in-flight request for: ${cacheKey}`);
      try {
        const inFlightData = await this.inFlightRequests.get(cacheKey)!;
        stats.cacheHits++;
        return {
          data: inFlightData,
          cached: true,
          stale: false,
          lastUpdated: new Date().toLocaleTimeString(),
          cacheKey
        };
      } catch (inFlightErr) {
        // If the shared request failed, fall back to stale cache if available
        if (cacheResult.entry) {
          return {
            data: cacheResult.entry.data,
            cached: true,
            stale: true,
            lastUpdated: new Date(cacheResult.entry.createdAt).toLocaleTimeString(),
            cacheKey
          };
        }
        throw inFlightErr;
      }
    }

    // 4. Create and register the in-flight promise
    const requestPromise = (async () => {
      try {
        stats.requestsMade++;
        stats.remainingRequests = Math.max(0, stats.dailyLimit - stats.requestsMade);
        stats.lastApiRequest = new Date().toISOString();
        console.log(`[API REQUEST] ${cacheKey} (Request #${stats.requestsMade}/${stats.dailyLimit})`);

        const freshData = await fetcher();

        stats.lastSuccessfulRequest = new Date().toISOString();
        stats.lastError = null;

        // Save fresh result into cache
        this.set(cacheKey, sport, endpoint, freshData, customTTLSeconds);

        return freshData;
      } catch (err: any) {
        stats.lastError = err?.message || String(err);
        console.error(`[API ERROR] ${cacheKey}:`, stats.lastError);

        if (
          err?.message?.includes('429') ||
          err?.message?.toLowerCase().includes('rate limit') ||
          err?.message?.toLowerCase().includes('quota')
        ) {
          stats.rateLimitHits++;
          stats.status = 'Rate Limited';
          console.warn(`[RATE LIMIT] Rate limit recorded for sport: ${sport}`);
        }

        // 5. Stale cache fallback on failure
        if (cacheResult.entry) {
          console.log(`[STALE CACHE FALLBACK] Request failed, returning stale cache for ${cacheKey}`);
          return cacheResult.entry.data;
        }

        throw err;
      } finally {
        this.inFlightRequests.delete(cacheKey);
      }
    })();

    this.inFlightRequests.set(cacheKey, requestPromise);

    try {
      const data = await requestPromise;
      const isStaleFallback = Boolean(stats.lastError && cacheResult.entry);
      return {
        data,
        cached: isStaleFallback,
        stale: isStaleFallback,
        lastUpdated: new Date().toLocaleTimeString(),
        cacheKey
      };
    } catch (err: any) {
      if (cacheResult.entry) {
        return {
          data: cacheResult.entry.data,
          cached: true,
          stale: true,
          lastUpdated: new Date(cacheResult.entry.createdAt).toLocaleTimeString(),
          cacheKey
        };
      }
      throw err;
    }
  }

  /**
   * Record external API response quota headers if provided by API-Sports
   */
  public recordApiSportsHeaders(sportId: string, headers: Headers) {
    const stats = this.getOrCreateStats(sportId);
    const remaining = headers.get('x-ratelimit-requests-remaining');
    const limit = headers.get('x-ratelimit-requests-limit');

    if (remaining !== null) {
      const remNum = parseInt(remaining, 10);
      if (!isNaN(remNum)) {
        stats.remainingRequests = remNum;
        if (limit !== null) {
          const limitNum = parseInt(limit, 10);
          if (!isNaN(limitNum)) {
            stats.dailyLimit = limitNum;
            stats.requestsMade = Math.max(0, limitNum - remNum);
          }
        }
      }
    }
  }

  public getOrCreateStats(sportId: string): SportUsageStats {
    let stats = this.usageStats.get(sportId);
    if (!stats) {
      const config = SPORTS_CONFIG[sportId] || {
        id: sportId,
        name: sportId.toUpperCase(),
        dailyLimit: 100,
        safetyLimit: 80
      };
      stats = {
        sport: sportId,
        sportName: config.name,
        dailyLimit: config.dailyLimit,
        safetyLimit: config.safetyLimit,
        requestsMade: 0,
        remainingRequests: config.dailyLimit,
        cacheHits: 0,
        cacheMisses: 0,
        lastApiRequest: null,
        lastSuccessfulRequest: null,
        lastError: null,
        rateLimitHits: 0,
        status: 'Healthy'
      };
      this.usageStats.set(sportId, stats);
    }
    return stats;
  }

  public getAllUsageStats(): SportUsageStats[] {
    return Array.from(this.usageStats.values());
  }

  public clearCache() {
    this.cache.clear();
    console.log('[CACHE] Sports cache cleared');
  }

  public resetStats() {
    this.usageStats.clear();
    console.log('[USAGE STATS] Usage stats cleared');
  }
}

export const sportsCache = new SportsCacheManager();
