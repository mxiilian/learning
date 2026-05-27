import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Caveat_400Regular, Caveat_700Bold } from '@expo-google-fonts/caveat';
import { Kalam_400Regular, Kalam_700Bold } from '@expo-google-fonts/kalam';
import { NotoSansKR_400Regular, NotoSansKR_700Bold } from '@expo-google-fonts/noto-sans-kr';

import ProtectedRoute from '@/components/ProtectedRoute';
import TabBar from '@/components/TabBar';
import { deleteUserSession, getUserId, getUsername } from '@/services/authService';
import { getHomeStats } from '@/services/vocabService';
import { HomeStats } from '@/services/model/statsModel';
import { dashboardStyles as s } from '@/styles/dashboard.styles';
import { Colors } from '@/styles/theme';

// ─── Konstanten ───────────────────────────────────────────────────
const BOX_INTERVALS = ['täglich', 'alle 2 Tage', 'alle 4 Tage', 'wöchentlich', 'monatlich'];

// ─── Haupt-Screen ─────────────────────────────────────────────────
export default function Dashboard() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [fontsLoaded] = useFonts({
        Caveat_400Regular,
        Caveat_700Bold,
        Kalam_400Regular,
        Kalam_700Bold,
        NotoSansKR_400Regular,
        NotoSansKR_700Bold,
    });

    const [username, setUsername]     = useState<string>('');
    const [userId, setUserId]         = useState<number | null>(null);
    const [stats, setStats]           = useState<HomeStats | null>(null);
    const [loading, setLoading]       = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError]           = useState<string | null>(null);

    // Session laden + Stats bei jedem Screen-Focus abrufen (auch nach router.back())
    useFocusEffect(
        useCallback(() => {
            let cancelled = false;
            (async () => {
                const [name, id] = await Promise.all([getUsername(), getUserId()]);
                if (cancelled) return;

                // Unvollständige Session → neu einloggen
                if (id === null) {
                    await deleteUserSession();
                    router.replace('/');
                    return;
                }

                setUsername(name ?? 'Lerner');
                setUserId(id);

                try {
                    setError(null);
                    const data = await getHomeStats(id);
                    if (!cancelled) setStats(data);
                } catch {
                    if (!cancelled) setError('Server nicht erreichbar. Bist du im gleichen WLAN wie der Mac?');
                } finally {
                    if (!cancelled) setLoading(false);
                }
            })();
            return () => { cancelled = true; };
        // router ist stabil, kein Re-Run nötig
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    const loadStats = useCallback(async (uid: number) => {
        try {
            setError(null);
            const data = await getHomeStats(uid);
            setStats(data);
        } catch {
            setError('Server nicht erreichbar. Bist du im gleichen WLAN wie der Mac?');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Pull-to-Refresh
    useEffect(() => {
        if (userId !== null && refreshing) loadStats(userId);
    }, [refreshing, userId, loadStats]);

    const onRefresh = useCallback(() => {
        if (userId !== null) {
            setRefreshing(true);
            loadStats(userId);
        }
    }, [userId, loadStats]);

    // ── Lade-Zustand ──────────────────────────────────────────────
    if (!fontsLoaded || loading) {
        return (
            <ProtectedRoute>
                <View style={[s.screen, s.centered, { paddingTop: insets.top }]}>
                    <ActivityIndicator size="large" color={Colors.accent} />
                    <Text style={{ color: Colors.muted, marginTop: 10, fontSize: 14 }}>
                        {!fontsLoaded ? 'Lade Schriften…' : 'Lade Statistiken…'}
                    </Text>
                </View>
            </ProtectedRoute>
        );
    }

    const dueCount  = stats?.dueToday   ?? 0;
    const totalVocab = stats?.totalVocab ?? 0;
    const estMin    = Math.max(1, Math.round((dueCount * 20) / 60));

    const boxes = [
        { n: 1, count: stats?.box1 ?? 0 },
        { n: 2, count: stats?.box2 ?? 0 },
        { n: 3, count: stats?.box3 ?? 0 },
        { n: 4, count: stats?.box4 ?? 0 },
        { n: 5, count: stats?.box5 ?? 0 },
    ];

    // ── Haupt-Render ──────────────────────────────────────────────
    return (
        <ProtectedRoute>
            <View style={s.screen}>
                <ScrollView
                    style={s.scroll}
                    contentContainerStyle={[
                        s.scrollContent,
                        { paddingTop: insets.top + 12, paddingBottom: 90 + insets.bottom },
                    ]}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={Colors.accent}
                            colors={[Colors.accent]}
                        />
                    }
                >
                    {/* Header */}
                    <View style={s.header}>
                        <View>
                            <Text style={s.headerTitle}>안녕, {username}!</Text>
                            <Text style={s.headerKo}>오늘도 화이팅 ✊</Text>
                        </View>
                        <View style={s.chip}>
                            <Text style={s.chipText}>🔥 {stats?.streakDays ?? 0}</Text>
                        </View>
                    </View>

                    {/* Fehler */}
                    {error && (
                        <Pressable style={s.errorBanner} onPress={onRefresh}>
                            <Text style={s.errorText}>{error} — Tippen zum Wiederholen</Text>
                        </Pressable>
                    )}

                    {/* Hero-Karte */}
                    <View style={[s.card, s.heroCard]}>
                        <Text style={s.sectionLabel}>HEUTE FÄLLIG</Text>
                        <View style={s.heroDueRow}>
                            <Text style={s.heroDueNumber}>{dueCount}</Text>
                            <Text style={[s.heroDueSub, { alignSelf: 'flex-end', marginBottom: 6 }]}>
                                Karten · ca. {estMin} min
                            </Text>
                        </View>
                        <Pressable
                            style={[s.primaryBtn, dueCount === 0 && s.primaryBtnDisabled]}
                            onPress={() => dueCount > 0 && router.push('/review' as any)}
                            disabled={dueCount === 0}
                        >
                            <Text style={s.primaryBtnText}>
                                {dueCount > 0 ? '▶  Jetzt üben' : '✓  Alles erledigt'}
                            </Text>
                        </Pressable>
                    </View>

                    {/* Stats-Zeile */}
                    <View style={s.statsRow}>
                        <View style={[s.card, s.cardFlat, s.statCard]}>
                            <Text style={s.sectionLabel}>STREAK</Text>
                            <Text style={s.statNumber}>
                                {stats?.streakDays ?? 0}
                                <Text style={s.statNumberSub}> Tage</Text>
                            </Text>
                        </View>
                        <View style={[s.card, s.cardFlat, s.statCard]}>
                            <Text style={s.sectionLabel}>GELERNT</Text>
                            <Text style={s.statNumber}>
                                {totalVocab}
                                <Text style={s.statNumberSub}> Wörter</Text>
                            </Text>
                        </View>
                    </View>

                    {/* Leitner-Boxen */}
                    <Text style={s.sectionLabel}>LEITNER-BOXEN</Text>
                    <View style={s.boxesWrapper}>
                        {boxes.map((b, i) => (
                            <BoxRow
                                key={b.n}
                                n={b.n}
                                count={b.count}
                                total={totalVocab}
                                interval={BOX_INTERVALS[i]}
                                highlight={b.n === 1 && b.count > 0}
                            />
                        ))}
                    </View>
                </ScrollView>

                <TabBar />
            </View>
        </ProtectedRoute>
    );
}

// ─── BoxRow ───────────────────────────────────────────────────────
function BoxRow({ n, count, total, interval, highlight }: {
    n: number;
    count: number;
    total: number;
    interval: string;
    highlight: boolean;
}) {
    const pct = total > 0 ? Math.min(100, (count / total) * 100) : 0;

    return (
        <View style={[s.card, s.cardFlat, s.boxRow, highlight && s.boxRowHighlight]}>
            <View style={[s.boxBadge, highlight && s.boxBadgeHighlight]}>
                <Text style={[s.boxBadgeText, highlight && s.boxBadgeTextHighlight]}>{n}</Text>
            </View>
            <View style={s.boxMid}>
                <View style={s.boxTopRow}>
                    <Text style={s.boxLabel}>Box {n}</Text>
                    <Text style={s.boxCount}>{count} Karten</Text>
                </View>
                <View style={s.barTrack}>
                    <View style={[s.barFill, { width: `${pct}%` as any }]} />
                </View>
            </View>
            <Text style={s.boxInterval}>{interval}</Text>
        </View>
    );
}

