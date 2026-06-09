import React, { createContext, useCallback, useContext, useRef } from 'react';
import { HomeStats } from '@/services/model/statsModel';
import { VocabStats } from '@/services/model/vocabStatsModel';
import { VocabWithProgress } from '@/services/model/VocabModels';
import {
    getHomeStats as fetchHomeStats,
    getVocabStats as fetchVocabStats,
    getUserVocabList as fetchVocabList,
} from '@/services/vocabService';

const TTL_MS = 30_000;

type HomeCache  = { data: HomeStats;                             userId: number; ts: number } | null;
type VocabCache = { stats: VocabStats; list: VocabWithProgress[]; userId: number; ts: number } | null;

interface DataContextValue {
    getHomeStats: (userId: number) => Promise<HomeStats>;
    getVocabData: (userId: number) => Promise<{ stats: VocabStats; list: VocabWithProgress[] }>;
    invalidate: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const homeCache  = useRef<HomeCache>(null);
    const vocabCache = useRef<VocabCache>(null);

    const getHomeStats = useCallback(async (userId: number): Promise<HomeStats> => {
        const c = homeCache.current;
        if (c && c.userId === userId && Date.now() - c.ts < TTL_MS) {
            return c.data;
        }
        const data = await fetchHomeStats(userId);
        homeCache.current = { data, userId, ts: Date.now() };
        return data;
    }, []);

    const getVocabData = useCallback(async (userId: number) => {
        const c = vocabCache.current;
        if (c && c.userId === userId && Date.now() - c.ts < TTL_MS) {
            return { stats: c.stats, list: c.list };
        }
        const [stats, list] = await Promise.all([
            fetchVocabStats(userId),
            fetchVocabList(userId),
        ]);
        vocabCache.current = { stats, list, userId, ts: Date.now() };
        return { stats, list };
    }, []);

    const invalidate = useCallback(() => {
        homeCache.current  = null;
        vocabCache.current = null;
    }, []);

    return (
        <DataContext.Provider value={{ getHomeStats, getVocabData, invalidate }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData(): DataContextValue {
    const ctx = useContext(DataContext);
    if (!ctx) throw new Error('useData must be used within DataProvider');
    return ctx;
}
