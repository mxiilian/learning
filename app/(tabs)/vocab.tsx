import ProtectedRoute from '@/components/ProtectedRoute';
import TabBar from '@/components/TabBar';
import { useData } from '@/context/DataContext';
import { useTabBarPadding } from '@/hooks/useTabBarPadding';
import { getUserId } from '@/services/authService';
import { VocabWithProgress } from '@/services/model/VocabModels';
import { VocabStats } from '@/services/model/vocabStatsModel';
import { Colors, Fonts } from '@/styles/theme';
import { vocabStyles as s } from '@/styles/vocab.styles';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

// ─── Konstanten ───────────────────────────────────────────────────
const DONUT_SIZE     = 120;
const DONUT_RADIUS   = 55;
const DONUT_STROKE   = 10;
const DONUT_CIRC     = 2 * Math.PI * DONUT_RADIUS; // ≈ 270.2

const BOX_INTERVALS  = ['täglich', 'alle 2 T.', 'alle 4 T.', 'wöchentl.', 'monatl.'];

// ─── Haupt-Screen ─────────────────────────────────────────────────
export default function VocabScreen() {
    const router        = useRouter();
    const insets        = useSafeAreaInsets();
    const tabBarPadding = useTabBarPadding();
    const { getVocabData, invalidate } = useData();

    const [userId, setUserId]         = useState<number | null>(null);
    const [stats, setStats]           = useState<VocabStats | null>(null);
    const [vocabList, setVocabList]   = useState<VocabWithProgress[]>([]);
    const [loading, setLoading]       = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError]           = useState<string | null>(null);

    const loadData = useCallback(async (uid: number) => {
        try {
            setError(null);
            const { stats: statsData, list: listData } = await getVocabData(uid);
            setStats(statsData);
            setVocabList(listData);
        } catch (err) {
            const msg = err instanceof Error ? err.message : '';
            if (msg.startsWith('UNAUTHORIZED') || msg === 'Nicht eingeloggt') {
                router.replace('/');
            } else {
                setError('Server nicht erreichbar. Bitte später erneut versuchen.');
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [router, getVocabData]);

    useFocusEffect(
        useCallback(() => {
            let cancelled = false;
            (async () => {
                const id = await getUserId();
                if (cancelled) return;
                if (id === null) { router.replace('/'); return; }
                setUserId(id);
                if (!cancelled) loadData(id);
            })();
            return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [loadData])
    );

    useEffect(() => {
        if (userId !== null && refreshing) loadData(userId);
    }, [refreshing, userId, loadData]);

    const onRefresh = useCallback(() => {
        if (userId !== null) {
            invalidate();
            setRefreshing(true);
            loadData(userId);
        }
    }, [userId, loadData, invalidate]);

    // ── Lade-Zustand ──────────────────────────────────────────────
    if (loading) {
        return (
            <ProtectedRoute>
                <View style={[s.screen, s.centered, { paddingTop: insets.top }]}>
                    <ActivityIndicator size="large" color={Colors.accent} />
                    <Text style={{ color: Colors.muted, marginTop: 10, fontSize: 14 }}>
                        Lade Statistiken…
                    </Text>
                </View>
            </ProtectedRoute>
        );
    }

    const total    = stats?.totalVocab  ?? 0;
    const due      = stats?.dueToday    ?? 0;
    const accuracy = stats?.accuracyPct ?? 0;
    const boxes    = [
        { n: 1, count: stats?.box1 ?? 0 },
        { n: 2, count: stats?.box2 ?? 0 },
        { n: 3, count: stats?.box3 ?? 0 },
        { n: 4, count: stats?.box4 ?? 0 },
        { n: 5, count: stats?.box5 ?? 0 },
    ];
    const maxBoxCount = Math.max(...boxes.map(b => b.count), 1);

    // Donut: Anteil der Genauigkeit
    const dashOffset = DONUT_CIRC - (accuracy / 100) * DONUT_CIRC;

    // ── Haupt-Render ──────────────────────────────────────────────
    return (
        <ProtectedRoute>
            <View style={s.screen}>
                <ScrollView
                    style={s.scroll}
                    contentContainerStyle={[
                        s.scrollContent,
                        { paddingTop: insets.top + 12, paddingBottom: tabBarPadding + 8 },
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
                            <Text style={s.headerTitle}>Vokabeln</Text>
                            <Text style={s.headerKo}>단어</Text>
                        </View>
                        <Pressable
                            style={s.chipFilled}
                            onPress={() => router.push('/new-vocab')}
                        >
                            <Text style={s.chipFilledText}>+ Neu</Text>
                        </Pressable>
                    </View>

                    {/* Fehler */}
                    {error && (
                        <Pressable style={s.errorBanner} onPress={onRefresh}>
                            <Text style={s.errorText}>{error} — Tippen zum Wiederholen</Text>
                        </Pressable>
                    )}

                    {/* Donut-Zusammenfassung */}
                    <View style={[s.card, s.summaryCard]}>
                        {/* SVG-Donut + RN-Text-Overlay */}
                        <View style={{ width: DONUT_SIZE, height: DONUT_SIZE }}>
                            <Svg
                                width={DONUT_SIZE}
                                height={DONUT_SIZE}
                                viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
                            >
                                <Circle
                                    cx={DONUT_SIZE / 2}
                                    cy={DONUT_SIZE / 2}
                                    r={DONUT_RADIUS}
                                    fill="none"
                                    stroke={Colors.muted2}
                                    strokeWidth={DONUT_STROKE}
                                />
                                <Circle
                                    cx={DONUT_SIZE / 2}
                                    cy={DONUT_SIZE / 2}
                                    r={DONUT_RADIUS}
                                    fill="none"
                                    stroke={Colors.accent}
                                    strokeWidth={DONUT_STROKE}
                                    strokeDasharray={DONUT_CIRC}
                                    strokeDashoffset={dashOffset}
                                    strokeLinecap="round"
                                    transform={`rotate(-90 ${DONUT_SIZE / 2} ${DONUT_SIZE / 2})`}
                                />
                            </Svg>
                            <View style={{
                                position:       'absolute',
                                top: 0, left: 0, right: 0, bottom: 0,
                                alignItems:     'center',
                                justifyContent: 'center',
                                gap:            2,
                            }}>
                                <Text style={{
                                    fontFamily: Fonts.caveat,
                                    fontSize:   22,
                                    color:      Colors.ink,
                                    lineHeight: 24,
                                }}>
                                    {accuracy}%
                                </Text>
                                <Text style={{
                                    fontFamily:    Fonts.mono,
                                    fontSize:      9,
                                    color:         Colors.muted,
                                    letterSpacing: 0.8,
                                }}>
                                    GENAU
                                </Text>
                            </View>
                        </View>

                        {/* Rechte Seite */}
                        <View style={s.summaryRight}>
                            <Text style={s.summaryTotal}>{total} Karten</Text>
                            <Text style={s.summaryDue}>
                                in 5 Boxen · {due} heute fällig
                            </Text>
                            {/* Mini-Balkenstreifen */}
                            <View style={s.miniBarRow}>
                                {boxes.map((b, i) => (
                                    <View
                                        key={b.n}
                                        style={[
                                            s.miniBarSegment,
                                            {
                                                flex:            b.count || 0,
                                                minWidth:        b.count > 0 ? 4 : 0,
                                                backgroundColor: i === 0
                                                    ? Colors.accent
                                                    : Colors.ink,
                                                opacity: i === 0
                                                    ? 1
                                                    : 0.15 + i * 0.2,
                                            },
                                        ]}
                                    />
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* 5-Box-Balkendiagramm */}
                    <View style={[s.card, s.boxChartCard]}>
                        <View style={s.boxChartHeader}>
                            <Text style={s.cardTitle}>5-Box-System</Text>
                            <Text style={s.subText}>{total} Karten</Text>
                        </View>
                        <View style={s.boxChartBars}>
                            {boxes.map((b, i) => {
                                const barHeight = maxBoxCount > 0
                                    ? Math.max(8, (b.count / maxBoxCount) * 78)
                                    : 8;
                                return (
                                    <View key={b.n} style={s.boxBarColumn}>
                                        <Text style={s.boxBarCountText}>{b.count}</Text>
                                        <View
                                            style={[
                                                s.boxBar,
                                                i === 0 ? s.boxBarAccent : s.boxBarNeutral,
                                                { height: barHeight },
                                            ]}
                                        />
                                        <Text style={s.boxBarLabel}>{b.n}</Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Vokabelliste */}
                    <View style={s.vocabListSection}>
                        <Text style={s.vocabListTitle}>Meine Vokabeln</Text>
                        <Text style={s.vocabListCount}>{vocabList.length} EINTRÄGE</Text>
                    </View>

                    {vocabList.length === 0 ? (
                        <View style={s.vocabEmptyState}>
                            <Text style={s.vocabEmptyText}>
                                Noch keine Vokabeln hinzugefügt.{'\n'}Tippe auf „+ Neu" um zu starten.
                            </Text>
                        </View>
                    ) : (
                        vocabList.map(item => (
                            <VocabListItem key={item.id} item={item} />
                        ))
                    )}
                </ScrollView>

                <TabBar />
            </View>
        </ProtectedRoute>
    );
}

// ─── Hilfsfunktion: Zeitangabe bis zur nächsten Wiederholung ──────
function nextReviewLabel(nextReview: string): { text: string; due: boolean } {
    const diffMs = new Date(nextReview).getTime() - Date.now();
    if (diffMs <= 0) return { text: 'fällig', due: true };
    const days = Math.ceil(diffMs / 86_400_000);
    if (days === 1) return { text: 'morgen', due: false };
    return { text: `in ${days} T.`, due: false };
}

// ─── VocabListItem ────────────────────────────────────────────────
function VocabListItem({ item }: { item: VocabWithProgress }) {
    const { text, due } = nextReviewLabel(item.nextReview);
    const isBox1 = item.boxNumber === 1;

    return (
        <View style={s.vocabItem}>
            <View style={[
                s.vocabBoxBadge,
                isBox1 ? s.vocabBoxBadgeAccent : s.vocabBoxBadgeNeutral,
            ]}>
                <Text style={s.vocabBoxBadgeText}>{item.boxNumber}</Text>
            </View>
            <View style={s.vocabItemMid}>
                <Text style={s.vocabWord} numberOfLines={1}>{item.word}</Text>
                <Text style={s.vocabDef} numberOfLines={1}>{item.definition}</Text>
            </View>
            <Text style={[s.vocabStatus, due && s.vocabStatusDue]}>{text}</Text>
        </View>
    );
}
