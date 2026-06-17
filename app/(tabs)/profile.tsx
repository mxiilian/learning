import ProtectedRoute from '@/components/ProtectedRoute';
import TabBar from '@/components/TabBar';
import { useData } from '@/context/DataContext';
import { deleteUserSession, getUserId, getUsername } from '@/services/authService';
import { DayActivity } from '@/services/model/vocabStatsModel';
import { profileStyles as s } from '@/styles/profile.styles';
import { Colors } from '@/styles/theme';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTabBarPadding } from '@/hooks/useTabBarPadding';

// ─── Heatmap-Konstanten ───────────────────────────────────────────
const HEATMAP_GAP  = 3;
const HEATMAP_COLS = 7;

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
export default function Profile() {
    const router  = useRouter();
    const insets        = useSafeAreaInsets();
    const tabBarPadding = useTabBarPadding();
    const { getVocabData } = useData();

    const [username,   setUsername]   = useState<string>('');
    const [userId,     setUserId]     = useState<number | null>(null);
    const [heatmap,    setHeatmap]    = useState<DayActivity[]>([]);
    const [loading,    setLoading]    = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [cellSize,   setCellSize]   = useState(36);

    useFocusEffect(
        useCallback(() => {
            let cancelled = false;
            (async () => {
                const [name, id] = await Promise.all([getUsername(), getUserId()]);
                if (cancelled) return;
                if (id === null) {
                    await deleteUserSession();
                    router.replace('/');
                    return;
                }
                setUsername(name ?? 'Lerner');
                setUserId(id);
                try {
                    const { stats } = await getVocabData(id);
                    if (!cancelled) setHeatmap(stats.heatmap ?? []);
                } catch {
                    // Heatmap optional; Seite trotzdem anzeigen
                } finally {
                    if (!cancelled) setLoading(false);
                }
            })();
            return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    const onRefresh = useCallback(async () => {
        if (userId === null) return;
        setRefreshing(true);
        try {
            const { stats } = await getVocabData(userId);
            setHeatmap(stats.heatmap ?? []);
        } finally {
            setRefreshing(false);
        }
    }, [userId, getVocabData]);

    const handleLogout = useCallback(async () => {
        if (Platform.OS === 'web') {
            if (!window.confirm('Möchtest du dich wirklich abmelden?')) return;
            await deleteUserSession();
            router.replace('/');
        } else {
            Alert.alert('Abmelden', 'Möchtest du dich wirklich abmelden?', [
                { text: 'Abbrechen', style: 'cancel' },
                {
                    text: 'Abmelden',
                    style: 'destructive',
                    onPress: async () => {
                        await deleteUserSession();
                        router.replace('/');
                    },
                },
            ]);
        }
    }, [router]);

    if (loading) {
        return (
            <ProtectedRoute>
                <View style={[s.screen, s.centered, { paddingTop: insets.top }]}>
                    <ActivityIndicator size="large" color={Colors.accent} />
                </View>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <View style={s.screen}>
                <ScrollView
                    style={s.scroll}
                    contentContainerStyle={[
                        s.scrollContent,
                        { paddingTop: insets.top + 12, paddingBottom: tabBarPadding },
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
                    {/* Profil-Header */}
                    <View style={s.header}>
                        <View style={s.avatarCircle}>
                            <Text style={s.avatarInitial}>
                                {username.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                        <View>
                            <Text style={s.username}>{username}</Text>
                            <Text style={s.subtitle}>Koreanisch-Lerner</Text>
                        </View>
                    </View>

                    {/* Aktivitätsübersicht */}
                    <View
                        style={s.heatmapCard}
                        onLayout={({ nativeEvent: { layout } }) => {
                            const inner = layout.width - 16 * 2;
                            setCellSize(Math.floor(
                                (inner - (HEATMAP_COLS - 1) * HEATMAP_GAP) / HEATMAP_COLS
                            ));
                        }}
                    >
                        <View style={s.heatmapHeader}>
                            <Text style={s.cardTitle}>Aktivität</Text>
                            <Text style={s.subText}>5 Wochen</Text>
                        </View>
                        <View style={{ gap: HEATMAP_GAP }}>
                            {Array.from({ length: 5 }).map((_, row) => (
                                <View key={row} style={{ flexDirection: 'row', gap: HEATMAP_GAP }}>
                                    {Array.from({ length: 7 }).map((_, col) => {
                                        const idx   = row * 7 + col;
                                        const day   = heatmap[idx];
                                        const level = day ? countToLevel(day.count) : 0;
                                        return (
                                            <View
                                                key={col}
                                                style={{
                                                    width:           cellSize,
                                                    height:          cellSize,
                                                    borderRadius:    3,
                                                    borderWidth:     1,
                                                    borderColor:     Colors.muted,
                                                    backgroundColor: HEATMAP_COLORS[level],
                                                }}
                                            />
                                        );
                                    })}
                                </View>
                            ))}
                        </View>
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

                    {/* Abmelden */}
                    <Pressable style={s.logoutBtn} onPress={handleLogout}>
                        <Text style={s.logoutText}>Abmelden</Text>
                    </Pressable>
                </ScrollView>

                <TabBar />
            </View>
        </ProtectedRoute>
    );
}
