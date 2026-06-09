import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Pressable,
    Text,
    View,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    Extrapolate,
    interpolate,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

import ProtectedRoute from '@/components/ProtectedRoute';
import { getUserId } from '@/services/authService';
import { getDueVocabs, submitReview } from '@/services/vocabService';
import { VocabWithProgress } from '@/services/model/VocabModels';
import { BASE_URL } from '@/services/api';
import { Colors, Fonts } from '@/styles/theme';
import { reviewStyles as s } from '@/styles/review.styles';
import { useData } from '@/context/DataContext';

// ─── Konstanten ───────────────────────────────────────────────────
const { width: SCREEN_W } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_W * 0.28;
const SWIPE_VELOCITY  = 650;

// ─── Hilfsfunktion: relative pictureUrl → absolute URL ───────────
function resolveImageUrl(url: string | undefined): string | undefined {
    if (!url) return undefined;
    if (url.startsWith('http')) return url;        // Web-URL: bereits absolut
    return `${BASE_URL}${url}`;                    // /uploads/… → http://host:3000/uploads/…
}

// ─── Review-Screen ────────────────────────────────────────────────
export default function ReviewScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { invalidate } = useData();

    // ── State ─────────────────────────────────────────────────────
    const [cards, setCards]               = useState<VocabWithProgress[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped]       = useState(false);
    const [showHint, setShowHint]         = useState(false);
    const [loading, setLoading]           = useState(true);
    const [isDone, setIsDone]             = useState(false);

    // ── Refs ──────────────────────────────────────────────────────
    const cardsRef          = useRef<VocabWithProgress[]>([]);
    const currentIndexRef   = useRef(0);
    const userIdRef         = useRef<number | null>(null);
    const submittingRef     = useRef(false);
    const targetFlippedRef  = useRef(false);
    // Verhindert, dass Tippen auf Hinweis-Button die Karte flippt
    const hintPressedRef    = useRef(false);

    useEffect(() => { cardsRef.current = cards; },                [cards]);
    useEffect(() => { currentIndexRef.current = currentIndex; },  [currentIndex]);

    // ── Animations ────────────────────────────────────────────────
    const translateX  = useSharedValue(0);
    const translateY  = useSharedValue(0);
    const flipAnim    = useSharedValue(0);    // 0 = Vorderseite, 1 = Rückseite
    const cardOpacity = useSharedValue(1);

    // ── Daten laden ───────────────────────────────────────────────
    useEffect(() => {
        (async () => {
            const id = await getUserId();
            if (!id) { router.replace('/'); return; }
            userIdRef.current = id;
            try {
                const due = await getDueVocabs(id);
                setCards(due);
                cardsRef.current = due;
            } catch {
                router.back();
            } finally {
                setLoading(false);
            }
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Karte umdrehen ────────────────────────────────────────────
    // Phase 1 (flipAnim 0 → 0.5): scaleX 1 → 0  (Karte klappt zu)
    // Mitte (0.5):                 Inhalt wechselt (Karte unsichtbar)
    // Phase 2 (flipAnim 0.5 → 1): scaleX 0 → 1  (Karte klappt auf)
    const flipCard = useCallback(() => {
        const toFlipped = !targetFlippedRef.current;
        targetFlippedRef.current = toFlipped;

        flipAnim.value = withTiming(0.5, { duration: 160 }, () => {
            runOnJS(setIsFlipped)(toFlipped);
            if (!toFlipped) runOnJS(setShowHint)(false); // Hinweis zurücksetzen beim Zurückdrehen
            flipAnim.value = withTiming(toFlipped ? 1 : 0, { duration: 160 });
        });
    }, [flipAnim]);

    // Flip-Handler der den Hinweis-Button-Guard berücksichtigt
    const handleCardPress = useCallback(() => {
        if (hintPressedRef.current) {
            hintPressedRef.current = false;
            return;
        }
        flipCard();
    }, [flipCard]);

    // ── Zur nächsten Karte wechseln ───────────────────────────────
    const advanceCard = useCallback(async (correct: boolean) => {
        if (submittingRef.current) return;
        const uid  = userIdRef.current;
        const deck = cardsRef.current;
        const idx  = currentIndexRef.current;

        if (!uid || idx >= deck.length) return;
        submittingRef.current = true;

        try {
            await submitReview(uid, deck[idx].id, correct);
        } catch (err) {
            const msg = err instanceof Error ? err.message : '';
            if (msg.startsWith('UNAUTHORIZED') || msg === 'Nicht eingeloggt') {
                submittingRef.current = false;
                router.replace('/');
                return;
            }
            // Netzwerkfehler: Fortschritt geht verloren, aber Session läuft weiter
        } finally {
            submittingRef.current = false;
        }

        const nextIdx = idx + 1;
        if (nextIdx >= deck.length) {
            invalidate(); // Stats sind jetzt veraltet → beim nächsten Wechsel neu laden
            setIsDone(true);
            return;
        }

        // Alles zurücksetzen für die nächste Karte
        translateX.value             = 0;
        translateY.value             = 0;
        flipAnim.value               = 0;
        cardOpacity.value            = 0;
        targetFlippedRef.current     = false;
        hintPressedRef.current       = false;

        setIsFlipped(false);
        setShowHint(false);
        setCurrentIndex(nextIdx);
        currentIndexRef.current = nextIdx;

        // Nächste Karte sanft einblenden
        cardOpacity.value = withTiming(1, { duration: 200 });
    }, [translateX, translateY, flipAnim, cardOpacity]);

    // ── Wisch-Aktion: Karte fliegt ab, dann advanceCard ───────────
    const triggerSwipe = useCallback((correct: boolean) => {
        const targetX = correct ? SCREEN_W * 1.6 : -SCREEN_W * 1.6;
        translateX.value = withTiming(targetX, { duration: 340 }, () => {
            runOnJS(advanceCard)(correct);
        });
    }, [translateX, advanceCard]);

    // ── Pan-Geste: nur Wischen (kein Tap-Erkennung mehr) ─────────
    // minDistance(15): Kurze Taps aktivieren die Geste nicht →
    // Pressables innerhalb der Karte funktionieren normal.
    //
    // runOnJS(true): Callbacks laufen auf dem JS-Thread statt auf dem
    // UI-Thread (Worklet). Dadurch ist das pointerup-Handling inklusive
    // releasePointerCapture schon abgeschlossen, bevor onEnd läuft —
    // vermeidet "Invalid pointer id"-Fehler in RNGH auf Web.
    const panGesture = Gesture.Pan()
        .runOnJS(true)
        .minDistance(15)
        .onUpdate((e) => {
            if (flipAnim.value > 0.5) {
                translateX.value = e.translationX;
                translateY.value = e.translationY * 0.12;
            }
        })
        .onEnd((e) => {
            // Wischen nur auf Rückseite
            if (flipAnim.value <= 0.5) {
                translateX.value = withSpring(0);
                translateY.value = withSpring(0);
                return;
            }

            if (e.translationX > SWIPE_THRESHOLD || e.velocityX > SWIPE_VELOCITY) {
                triggerSwipe(true);   // Richtig →
            } else if (e.translationX < -SWIPE_THRESHOLD || e.velocityX < -SWIPE_VELOCITY) {
                triggerSwipe(false);  // Falsch ←
            } else {
                translateX.value = withSpring(0, { damping: 15, stiffness: 200 });
                translateY.value = withSpring(0, { damping: 15, stiffness: 200 });
            }
        });

    // ── Animated Styles ───────────────────────────────────────────
    const cardAnimStyle = useAnimatedStyle(() => ({
        opacity: cardOpacity.value,
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            {
                rotate: `${interpolate(
                    translateX.value,
                    [-SCREEN_W, 0, SCREEN_W],
                    [-12, 0, 12],
                    Extrapolate.CLAMP,
                )}deg`,
            },
        ],
    }));

    // Klapp-Animation der Karte (scaleX: 1 → 0 → 1)
    const flipScaleStyle = useAnimatedStyle(() => ({
        transform: [
            {
                scaleX: interpolate(
                    flipAnim.value,
                    [0, 0.5, 1],
                    [1, 0, 1],
                ),
            },
        ],
    }));

    // "Richtig"-Badge (erscheint beim Wischen nach rechts)
    const correctBadgeStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            translateX.value,
            [0, SWIPE_THRESHOLD * 0.6],
            [0, 1],
            Extrapolate.CLAMP,
        ),
    }));

    // "Falsch"-Badge (erscheint beim Wischen nach links)
    const wrongBadgeStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            translateX.value,
            [0, -SWIPE_THRESHOLD * 0.6],
            [0, 1],
            Extrapolate.CLAMP,
        ),
    }));

    // ── Lade-Zustand ──────────────────────────────────────────────
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.paper }}>
                <ActivityIndicator size="large" color={Colors.accent} />
            </View>
        );
    }

    // ── Fertig-Zustand ────────────────────────────────────────────
    if (isDone || cards.length === 0) {
        const reviewedCount = cards.length;
        return (
            <View style={[s.doneScreen, { paddingTop: insets.top }]}>
                <Text style={s.doneEmoji}>🎉</Text>
                <Text style={s.doneTitle}>
                    {cards.length === 0 ? 'Keine Karten fällig!' : 'Alle Karten gelernt!'}
                </Text>
                <Text style={s.doneSub}>
                    {cards.length === 0
                        ? 'Komm morgen wieder 😊'
                        : `${reviewedCount} Karte${reviewedCount !== 1 ? 'n' : ''} wiederholt`}
                </Text>
                <Pressable style={s.primaryBtn} onPress={() => router.back()}>
                    <Text style={s.primaryBtnText}>Zurück zum Dashboard</Text>
                </Pressable>
            </View>
        );
    }

    // ── Karten-Daten ──────────────────────────────────────────────
    const card    = cards[currentIndex];
    const boxNum  = card.boxNumber;
    const nextBox = Math.min(5, boxNum + 1);
    const progress = currentIndex / cards.length;
    const imageUrl = resolveImageUrl(card.pictureUrl);

    // ── Haupt-Render ──────────────────────────────────────────────
    return (
        <ProtectedRoute>
            <View style={[s.screen, { paddingTop: insets.top + 10 }]}>

                {/* ── Top-Bar: ✕ · Fortschrittsbalken · Zähler ── */}
                <View style={s.topBar}>
                    <Pressable
                        onPress={() => router.back()}
                        style={s.closeChip}
                        hitSlop={8}
                    >
                        <Text style={s.chipText}>✕</Text>
                    </Pressable>
                    <View style={s.progressTrack}>
                        <View style={[s.progressFill, { width: `${progress * 100}%` as any }]} />
                    </View>
                    <Text style={s.countText}>{currentIndex + 1} / {cards.length}</Text>
                </View>

                {/* ── Box-Chip ── */}
                <View style={s.boxChipRow}>
                    <View style={s.boxChip}>
                        <Text style={s.chipText}>Box {boxNum}</Text>
                    </View>
                </View>

                {/* ── Karten-Stapel ── */}
                <View style={s.stackWrapper}>

                    {/* Hintergrund-Karten (Tiefe/Stapel-Effekt) */}
                    <View style={[s.bgCard, {
                        top: 28, bottom: 80, left: 22, right: 22,
                        opacity: 0.4, transform: [{ scale: 0.93 }, { rotate: '-1.5deg' }],
                    }]} />
                    <View style={[s.bgCard, {
                        top: 14, bottom: 60, left: 10, right: 10,
                        opacity: 0.7, transform: [{ scale: 0.97 }, { rotate: '1deg' }],
                    }]} />

                    {/* Aktive Karte: Wischen (Pan) + Flip (Pressable) */}
                    <GestureDetector gesture={panGesture}>
                        <Animated.View style={[s.cardOuter, cardAnimStyle]}>

                            {/* Wisch-Badges */}
                            <Animated.View style={[s.badge, s.badgeRight, correctBadgeStyle]}>
                                <Text style={[s.badgeText, { color: Colors.good }]}>Richtig</Text>
                            </Animated.View>
                            <Animated.View style={[s.badge, s.badgeLeft, wrongBadgeStyle]}>
                                <Text style={[s.badgeText, { color: Colors.bad }]}>Falsch</Text>
                            </Animated.View>

                            {/* Klapp-Animation */}
                            <Animated.View style={[{ flex: 1 }, flipScaleStyle]}>

                                {/* ─────────── Vorderseite ─────────── */}
                                {!isFlipped && (
                                    <Pressable style={s.cardFace} onPress={handleCardPress}>

                                        {/* ── Bild-Bereich (füllt den verfügbaren Platz) ── */}
                                        <View style={s.cardImageContainer}>
                                            {imageUrl ? (
                                                <ExpoImage
                                                    source={imageUrl}
                                                    contentFit="contain"
                                                    style={s.cardImageFill}
                                                />
                                            ) : (
                                                <View style={s.cardImagePlaceholder}>
                                                    <Text style={s.cardImagePlaceholderIcon}>❓</Text>
                                                    <Text style={s.cardImagePlaceholderText}>Kein Bild hinterlegt</Text>
                                                </View>
                                            )}
                                        </View>

                                        {/* ── Hinweis-Button (nur wenn Hinweis hinterlegt) ── */}
                                        {!!card.hint && (
                                            <View style={s.hintArea}>
                                                <Pressable
                                                    style={s.hintToggleBtn}
                                                    hitSlop={8}
                                                    onPress={() => {
                                                        hintPressedRef.current = true;
                                                        setShowHint(h => !h);
                                                    }}
                                                >
                                                    <Text style={s.hintToggleText}>
                                                        💡 {showHint ? 'Hinweis ausblenden' : 'Hinweis zeigen'}
                                                    </Text>
                                                </Pressable>
                                                {showHint && (
                                                    <View style={s.hintBox}>
                                                        <Text style={s.hintText}>{card.hint}</Text>
                                                    </View>
                                                )}
                                            </View>
                                        )}

                                        <Text style={s.tapHint}>Tippen zum Umdrehen</Text>
                                    </Pressable>
                                )}

                                {/* ─────────── Rückseite ─────────── */}
                                {isFlipped && (
                                    <Pressable style={[s.cardFace, s.cardBack]} onPress={handleCardPress}>
                                        <Text style={s.cardLabel}>Lösung</Text>
                                        <Text style={s.koreanWord}>{card.word}</Text>

                                        <View style={s.divider} />

                                        <Text style={s.cardLabel}>Übersetzung</Text>
                                        <Text style={s.definitionText}>{card.definition}</Text>

                                        {!!card.exampleSentence && (
                                            <>
                                                <Text style={[s.cardLabel, { marginTop: 10 }]}>Beispielsatz</Text>
                                                <Text style={s.exampleKoText}>{card.exampleSentence}</Text>
                                            </>
                                        )}

                                        <Text style={s.tapHint}>Nach links oder rechts wischen</Text>
                                    </Pressable>
                                )}

                            </Animated.View>
                        </Animated.View>
                    </GestureDetector>
                </View>

                {/* ── Wisch-Hinweise unten ── */}
                <View style={[s.swipeHints, { paddingBottom: Math.max(insets.bottom + 16, 24) }]}>
                    <View>
                        <Text style={[s.swipeLabel, { color: Colors.bad }]}>← Falsch</Text>
                        <Text style={s.swipeSub}>zurück in Box 1</Text>
                    </View>
                    <Pressable onPress={flipCard} style={s.flipChip} hitSlop={8}>
                        <Text style={s.chipText}>↻</Text>
                    </Pressable>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={[s.swipeLabel, { color: Colors.good }]}>Richtig →</Text>
                        <Text style={s.swipeSub}>weiter zu Box {nextBox}</Text>
                    </View>
                </View>

            </View>
        </ProtectedRoute>
    );
}
