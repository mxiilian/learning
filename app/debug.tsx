import ProtectedRoute from '@/components/ProtectedRoute';
import { getIsAdmin, getUserId } from '@/services/authService';
import { debugTimeTravel } from '@/services/vocabService';
import { Colors, Fonts } from '@/styles/theme';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DebugScreen() {
    const router  = useRouter();
    const insets  = useSafeAreaInsets();
    const [days, setDays]       = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        getIsAdmin().then(isAdmin => {
            if (!isAdmin) router.replace('/(tabs)/dashboard');
        });
    }, []);

    const clampDays = (v: number) => Math.min(60, Math.max(1, v));

    const travel = async (multiplier: 1 | -1) => {
        const id = await getUserId();
        if (id === null) return;

        setLoading(true);
        setMessage(null);
        try {
            await debugTimeTravel(id, days * multiplier);
            const dir = multiplier === 1 ? 'vorgesprungen' : 'zurückgesprungen';
            setMessage(`${days} ${days === 1 ? 'Tag' : 'Tage'} ${dir}. Ziehe im Dashboard zum Aktualisieren.`);
        } catch {
            setMessage('Fehler beim Zeitreisen.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <View style={[s.screen, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}>

                {/* Header */}
                <View style={s.header}>
                    <Pressable onPress={() => router.back()} hitSlop={12}>
                        <Text style={s.back}>← Zurück</Text>
                    </Pressable>
                    <Text style={s.title}>Dev: Zeitreise</Text>
                    <View style={{ width: 70 }} />
                </View>

                <View style={s.body}>
                    <Text style={s.label}>TAGE VORSPRINGEN</Text>

                    {/* Stepper */}
                    <View style={s.stepper}>
                        <Pressable
                            style={s.stepBtn}
                            onPress={() => setDays(d => clampDays(d - 1))}
                            hitSlop={8}
                        >
                            <Text style={s.stepBtnText}>−</Text>
                        </Pressable>
                        <Text style={s.stepValue}>{days}</Text>
                        <Pressable
                            style={s.stepBtn}
                            onPress={() => setDays(d => clampDays(d + 1))}
                            hitSlop={8}
                        >
                            <Text style={s.stepBtnText}>+</Text>
                        </Pressable>
                    </View>

                    {/* Schnellwahl */}
                    <View style={s.presets}>
                        {[1, 3, 7, 14, 30].map(d => (
                            <Pressable
                                key={d}
                                style={[s.presetBtn, days === d && s.presetBtnActive]}
                                onPress={() => setDays(d)}
                            >
                                <Text style={[s.presetText, days === d && s.presetTextActive]}>
                                    {d}d
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* Buttons */}
                    {loading ? (
                        <ActivityIndicator size="large" color={Colors.accent} style={{ marginTop: 32 }} />
                    ) : (
                        <View style={s.actions}>
                            <Pressable style={s.primaryBtn} onPress={() => travel(1)}>
                                <Text style={s.primaryBtnText}>⏩  {days} {days === 1 ? 'Tag' : 'Tage'} vorspringen</Text>
                            </Pressable>
                            <Pressable style={s.secondaryBtn} onPress={() => travel(-1)}>
                                <Text style={s.secondaryBtnText}>↩  {days} {days === 1 ? 'Tag' : 'Tage'} zurück</Text>
                            </Pressable>
                        </View>
                    )}

                    {/* Feedback */}
                    {message && (
                        <View style={s.messageBanner}>
                            <Text style={s.messageText}>{message}</Text>
                        </View>
                    )}

                    <Text style={s.hint}>
                        Verschiebt alle next_review-Daten des eingeloggten Users.{'\n'}
                        Nur für Entwicklung — nicht in Produktion deployen.
                    </Text>
                </View>
            </View>
        </ProtectedRoute>
    );
}

const s = StyleSheet.create({
    screen: {
        flex:            1,
        backgroundColor: Colors.paper,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection:  'row',
        alignItems:     'center',
        justifyContent: 'space-between',
        marginBottom:   32,
    },
    back: {
        fontFamily: Fonts.kalamReg,
        fontSize:   16,
        color:      Colors.accent,
        width:      70,
    },
    title: {
        fontFamily: Fonts.kalam,
        fontSize:   18,
        color:      Colors.muted,
    },
    body: {
        flex:      1,
        alignItems: 'center',
    },
    label: {
        fontFamily:    Fonts.mono,
        fontSize:      12,
        letterSpacing: 1.5,
        color:         Colors.muted,
        marginBottom:  20,
    },
    stepper: {
        flexDirection:  'row',
        alignItems:     'center',
        gap:            28,
        marginBottom:   24,
    },
    stepBtn: {
        width:           52,
        height:          52,
        borderRadius:    16,
        borderWidth:     1,
        borderColor:     'rgba(255,255,255,0.12)',
        backgroundColor: Colors.paper2,
        justifyContent:  'center',
        alignItems:      'center',
    },
    stepBtnText: {
        fontFamily: Fonts.caveat,
        fontSize:   26,
        color:      Colors.ink,
        lineHeight: 30,
    },
    stepValue: {
        fontFamily: Fonts.caveat,
        fontSize:   72,
        color:      Colors.ink,
        lineHeight: 80,
        minWidth:   90,
        textAlign:  'center',
    },
    presets: {
        flexDirection: 'row',
        gap:           10,
        marginBottom:  36,
    },
    presetBtn: {
        paddingHorizontal: 14,
        paddingVertical:   8,
        borderRadius:      10,
        borderWidth:       1,
        borderColor:       'rgba(255,255,255,0.12)',
        backgroundColor:   Colors.paper2,
    },
    presetBtnActive: {
        backgroundColor: Colors.accent,
        borderColor:     Colors.accent,
    },
    presetText: {
        fontFamily: Fonts.kalamMed,
        fontSize:   14,
        color:      Colors.muted,
    },
    presetTextActive: {
        color: '#ffffff',
    },
    actions: {
        width: '100%',
        gap:   12,
    },
    primaryBtn: {
        borderRadius:    16,
        paddingVertical: 16,
        backgroundColor: Colors.accent,
        alignItems:      'center',
    },
    primaryBtnText: {
        fontFamily: Fonts.kalam,
        fontSize:   17,
        color:      '#ffffff',
    },
    secondaryBtn: {
        borderRadius:    16,
        paddingVertical: 16,
        borderWidth:     1,
        borderColor:     'rgba(255,255,255,0.15)',
        backgroundColor: Colors.paper2,
        alignItems:      'center',
    },
    secondaryBtnText: {
        fontFamily: Fonts.kalam,
        fontSize:   17,
        color:      Colors.inkSoft,
    },
    messageBanner: {
        marginTop:       24,
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius:    14,
        borderWidth:     1,
        borderColor:     'rgba(34,197,94,0.3)',
        backgroundColor: 'rgba(34,197,94,0.08)',
        width:           '100%',
    },
    messageText: {
        fontFamily: Fonts.kalamReg,
        fontSize:   15,
        color:      Colors.good,
        textAlign:  'center',
    },
    hint: {
        fontFamily: Fonts.kalamReg,
        fontSize:   13,
        color:      Colors.muted2,
        textAlign:  'center',
        marginTop:  32,
        lineHeight: 20,
    },
});
