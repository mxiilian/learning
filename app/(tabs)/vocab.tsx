import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from 'react-native';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import { useRouter, useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Caveat_400Regular, Caveat_700Bold } from '@expo-google-fonts/caveat';
import { Kalam_400Regular, Kalam_700Bold } from '@expo-google-fonts/kalam';
import { NotoSansKR_400Regular, NotoSansKR_700Bold } from '@expo-google-fonts/noto-sans-kr';

import ProtectedRoute from '@/components/ProtectedRoute';
import TabBar from '@/components/TabBar';
import { getUserId } from '@/services/authService';
import { getVocabStats } from '@/services/vocabService';
import { VocabStats } from '@/services/model/vocabStatsModel';
import { vocabStyles as s } from '@/styles/vocab.styles';
import { Colors, Fonts } from '@/styles/theme';

// ─── Konstanten ───────────────────────────────────────────────────
const DONUT_SIZE     = 72;
const DONUT_RADIUS   = 28;
const DONUT_STROKE   = 8;
const DONUT_CIRC     = 2 * Math.PI * DONUT_RADIUS; // ≈ 175.9

const BOX_INTERVALS  = ['täglich', 'alle 2 T.', 'alle 4 T.', 'wöchentl.', 'monatl.'];

// Heatmap-Zellgröße: 7 Spalten, je 3 px Abstand, Card-Padding 12 px beidseitig,
// Screen-Padding 18 px beidseitig → exakte Pixelgröße statt %-Angabe
const SCREEN_WIDTH     = Dimensions.get('window').width;
const HEATMAP_H_PAD    = 18 * 2 + 12 * 2;          // screen padding + card padding
const HEATMAP_GAP      = 3;
const HEATMAP_COLS     = 7;
const CELL_SIZE        = Math.floor(
    (SCREEN_WIDTH - HEATMAP_H_PAD - (HEATMAP_COLS - 1) * HEATMAP_GAP) / HEATMAP_COLS
);


// ─── Heatmap-Hilfsfunktion: count → Level 0–3 ─────────────────────
function countToLevel(count: number): 0 | 1 | 2 | 3 {
    if (count === 0) return 0;
    if (count <= 3)  return 1;
    if (count <= 8)  return 2;
    return 3;
}

const HEATMAP_COLORS: Record<0 | 1 | 2 | 3, string> = {
    0: Colors.paper,
    1: Colors.paper2,
    2: Colors.muted2,
    3: Colors.ink,
};

// ─── Haupt-Screen ─────────────────────────────────────────────────
export default function VocabScreen() {
    const router   = useRouter();
    const insets   = useSafeAreaInsets();

    const [fontsLoaded] = useFonts({
        Caveat_400Regular,
        Caveat_700Bold,
        Kalam_400Regular,
        Kalam_700Bold,
        NotoSansKR_400Regular,
        NotoSansKR_700Bold,
    });

    const [userId, setUserId]         = useState<number | null>(null);
    const [stats, setStats]           = useState<VocabStats | null>(null);
    const [loading, setLoading]       = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError]           = useState<string | null>(null);

    const loadStats = useCallback(async (uid: number) => {
        try {
            setError(null);
            const data = await getVocabStats(uid);
            setStats(data);
        } catch {
            setError('Server nicht erreichbar. Bist du im gleichen WLAN wie der Mac?');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    // Stats bei jedem Screen-Focus abrufen (auch nach router.back())
    useFocusEffect(
        useCallback(() => {
            let cancelled = false;
            (async () => {
                const id = await getUserId();
                if (cancelled) return;
                if (id === null) { router.replace('/'); return; }
                setUserId(id);
                if (!cancelled) loadStats(id);
            })();
            return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [loadStats])
    );

    useEffect(() => {
        if (userId !== null && refreshing) loadStats(userId);
    }, [refreshing, userId, loadStats]);

    const onRefresh = useCallback(() => {
        if (userId !== null) { setRefreshing(true); loadStats(userId); }
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

    const total    = stats?.totalVocab   ?? 0;
    const due      = stats?.dueToday     ?? 0;
    const accuracy = stats?.accuracyPct  ?? 0;
    const boxes    = [
        { n: 1, count: stats?.box1 ?? 0 },
        { n: 2, count: stats?.box2 ?? 0 },
        { n: 3, count: stats?.box3 ?? 0 },
        { n: 4, count: stats?.box4 ?? 0 },
        { n: 5, count: stats?.box5 ?? 0 },
    ];
    const maxBoxCount = Math.max(...boxes.map(b => b.count), 1);
    const heatmap = stats?.heatmap ?? [];

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
                            <Text style={s.headerTitle}>Vokabeln</Text>
                            <Text style={s.headerKo}>단어</Text>
                        </View>
                        <Pressable
                            style={s.chipFilled}
                            onPress={() => router.push('/new-vocab' as any)}
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
                        {/* SVG-Donut */}
                        <Svg
                            width={DONUT_SIZE}
                            height={DONUT_SIZE}
                            viewBox={`0 0 ${DONUT_SIZE} ${DONUT_SIZE}`}
                        >
                            {/* Hintergrundring */}
                            <Circle
                                cx={DONUT_SIZE / 2}
                                cy={DONUT_SIZE / 2}
                                r={DONUT_RADIUS}
                                fill="none"
                                stroke={Colors.paper2}
                                strokeWidth={DONUT_STROKE}
                            />
                            {/* Fortschrittsring */}
                            <Circle
                                cx={DONUT_SIZE / 2}
                                cy={DONUT_SIZE / 2}
                                r={DONUT_RADIUS}
                                fill="none"
                                stroke={Colors.ink}
                                strokeWidth={DONUT_STROKE}
                                strokeDasharray={DONUT_CIRC}
                                strokeDashoffset={dashOffset}
                                strokeLinecap="round"
                                transform={`rotate(-90 ${DONUT_SIZE / 2} ${DONUT_SIZE / 2})`}
                            />
                            {/* Prozentzahl */}
                            <SvgText
                                x={DONUT_SIZE / 2}
                                y={DONUT_SIZE / 2 - 2}
                                textAnchor="middle"
                                fontFamily={Fonts.caveat}
                                fontSize={16}
                                fontWeight="700"
                                fill={Colors.ink}
                            >
                                {accuracy}%
                            </SvgText>
                            <SvgText
                                x={DONUT_SIZE / 2}
                                y={DONUT_SIZE / 2 + 11}
                                textAnchor="middle"
                                fontFamily={Fonts.mono}
                                fontSize={7}
                                fill={Colors.muted}
                            >
                                GENAU
                            </SvgText>
                        </Svg>

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

                    {/* Aktivitäts-Heatmap */}
                    <View style={[s.card, s.heatmapCard]}>
                        <View style={s.heatmapHeader}>
                            <Text style={s.cardTitle}>Aktivität</Text>
                            <Text style={s.subText}>5 Wochen</Text>
                        </View>
                        {/* 5 Zeilen à 7 Tage */}
                        <View style={{ gap: HEATMAP_GAP }}>
                            {Array.from({ length: 5 }).map((_, row) => (
                                <View
                                    key={row}
                                    style={{ flexDirection: 'row', gap: HEATMAP_GAP }}
                                >
                                    {Array.from({ length: 7 }).map((_, col) => {
                                        const idx   = row * 7 + col;
                                        const day   = heatmap[idx];
                                        const level = day ? countToLevel(day.count) : 0;
                                        return (
                                            <View
                                                key={col}
                                                style={{
                                                    width:           CELL_SIZE,
                                                    height:          CELL_SIZE,
                                                    borderRadius:    3,
                                                    borderWidth:     1,
                                                    borderColor:     Colors.ink,
                                                    backgroundColor: HEATMAP_COLORS[level],
                                                }}
                                            />
                                        );
                                    })}
                                </View>
                            ))}
                        </View>
                        {/* Legende */}
                        <View style={s.heatmapLegend}>
                            <Text style={s.heatmapLegendText}>weniger</Text>
                            {([0, 1, 2, 3] as const).map(lvl => (
                                <View
                                    key={lvl}
                                    style={[
                                        s.heatmapLegendDot,
                                        { backgroundColor: HEATMAP_COLORS[lvl] },
                                    ]}
                                />
                            ))}
                            <Text style={s.heatmapLegendText}>mehr</Text>
                        </View>
                    </View>
                </ScrollView>

                <TabBar />
            </View>
        </ProtectedRoute>
    );
}
