import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    ActivityIndicator,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Linking,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ProtectedRoute from '@/components/ProtectedRoute';
import { getUserId } from '@/services/authService';
import { createVocab, uploadImage, addVocabToUser } from '@/services/vocabService';
import { newVocabStyles as s } from '@/styles/new-vocab.styles';
import { Colors } from '@/styles/theme';

// ─── Typen für das Bild-Sheet ──────────────────────────────────────
type SheetMode = 'choose' | 'url';

export default function NewVocabScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // ── Formular-State ────────────────────────────────────────────
    const [word,            setWord]            = useState('');
    const [definition,      setDefinition]      = useState('');
    const [exampleSentence, setExampleSentence] = useState('');
    const [hint,            setHint]            = useState('');

    // imageUri: lokale Datei-URI (Galerie) oder Web-URL
    const [imageUri,   setImageUri]   = useState<string | null>(null);
    const [saving,     setSaving]     = useState(false);
    const [error,      setError]      = useState<string | null>(null);

    // ── Bild-Sheet ────────────────────────────────────────────────
    const [sheetVisible, setSheetVisible] = useState(false);
    const [sheetMode,    setSheetMode]    = useState<SheetMode>('choose');
    const [urlInput,     setUrlInput]     = useState('');
    const [urlPreviewOk, setUrlPreviewOk] = useState(false);

    const openSheet = () => {
        Keyboard.dismiss();   // ggf. offene Tastatur aus einem Formular-Feld schließen
        setSheetMode('choose');
        setUrlInput('');
        setUrlPreviewOk(false);
        setSheetVisible(true);
    };

    const closeSheet = () => setSheetVisible(false);

    const backToChoose = () => {
        setSheetMode('choose');
        setUrlInput('');
        setUrlPreviewOk(false);
    };

    // Galerie öffnen
    const pickFromGallery = async () => {
        // Kein closeSheet() nötig: ImageSourceSheet unmountet sich selbst
        // über seinen internen mounted-State und kein nativer Modal-VC steht
        // dem ImagePicker mehr im Weg.
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            setError('Foto-Zugriff verweigert. Bitte in den Einstellungen erlauben.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes:    ['images'],
            allowsEditing: true,
            aspect:        [4, 3],
            quality:       0.8,
        });
        if (!result.canceled && result.assets[0]) {
            setImageUri(result.assets[0].uri);
            setError(null);
        }
    };

    // Google Bilder im Browser öffnen (vorausgefüllt mit dem Vokabelwort)
    const openGoogleImages = () => {
        const query = word.trim() || 'koreanisch';
        Linking.openURL(
            `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(query)}`
        );
    };

    // Web-URL übernehmen — kein closeSheet() hier, da animateClose
    // im Popup onClose (= closeSheet) selbst aufruft.
    const confirmUrl = () => {
        const trimmed = urlInput.trim();
        if (trimmed) {
            setImageUri(trimmed);
            setError(null);
        }
    };

    // ── Speichern ─────────────────────────────────────────────────
    const handleSave = async () => {
        if (!word.trim()) {
            setError('Bitte ein koreanisches Wort eingeben.');
            return;
        }
        if (!definition.trim()) {
            setError('Bitte eine Definition eingeben.');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            let pictureUrl: string | undefined;

            if (imageUri) {
                // Lokale Datei → auf Server hochladen
                // Web-URL → direkt speichern (beginnt mit http)
                if (imageUri.startsWith('http')) {
                    pictureUrl = imageUri;
                } else {
                    pictureUrl = await uploadImage(imageUri);
                }
            }

            const userId = await getUserId();
            if (!userId) { router.replace('/'); return; }

            const vocab = await createVocab({
                word:            word.trim(),
                definition:      definition.trim(),
                exampleSentence: exampleSentence.trim() || undefined,
                hint:            hint.trim() || undefined,
                pictureUrl,
            });

            // Vokabel sofort ins Lern-Deck des Users aufnehmen,
            // damit sie in den Stats (user_vocab_progress) erscheint.
            await addVocabToUser(userId, vocab.id);

            router.back();
        } catch (e: any) {
            setError(e?.message ?? 'Speichern fehlgeschlagen. Nochmal versuchen?');
        } finally {
            setSaving(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────
    return (
        <ProtectedRoute>
            <KeyboardAvoidingView
                style={s.screen}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    style={s.scroll}
                    contentContainerStyle={[
                        s.scrollContent,
                        { paddingTop: insets.top + 12 },
                    ]}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header: ✕  Neue Vokabel  ✓ */}
                    <View style={s.headerRow}>
                        <Pressable style={s.iconBtn} onPress={() => router.back()}>
                            <Text style={s.iconBtnText}>✕</Text>
                        </Pressable>
                        <Text style={s.headerTitle}>Neue Vokabel</Text>
                        <Pressable
                            style={[s.iconBtn, s.iconBtnFilled, saving && s.iconBtnSaving]}
                            onPress={handleSave}
                            disabled={saving}
                        >
                            {saving
                                ? <ActivityIndicator size="small" color={Colors.paper} />
                                : <Text style={[s.iconBtnText, s.iconBtnTextFilled]}>✓</Text>
                            }
                        </Pressable>
                    </View>

                    {/* Fehler */}
                    {error && (
                        <View style={s.errorBanner}>
                            <Text style={s.errorText}>{error}</Text>
                        </View>
                    )}

                    {/* Bild-Picker */}
                    <Text style={s.imageLabel}>Bild</Text>
                    <Pressable style={s.imagePicker} onPress={openSheet}>
                        {imageUri ? (
                            <>
                                <Image
                                    source={{ uri: imageUri }}
                                    style={s.imagePreview}
                                    resizeMode="cover"
                                />
                                <Pressable
                                    style={s.imageRemoveBtn}
                                    onPress={() => setImageUri(null)}
                                    hitSlop={8}
                                >
                                    <Text style={s.imageRemoveBtnText}>✕</Text>
                                </Pressable>
                            </>
                        ) : (
                            <Text style={s.imagePickerText}>+ Bild wählen</Text>
                        )}
                    </Pressable>

                    {/* Wort (Koreanisch) */}
                    <View style={s.fieldGroup}>
                        <Text style={s.fieldLabel}>Wort (Koreanisch)</Text>
                        <TextInput
                            style={[s.input, s.inputKo]}
                            value={word}
                            onChangeText={setWord}
                            placeholder="예) 사과"
                            placeholderTextColor={Colors.muted2}
                            autoCorrect={false}
                            returnKeyType="next"
                        />
                    </View>

                    {/* Definition */}
                    <View style={s.fieldGroup}>
                        <Text style={s.fieldLabel}>Definition</Text>
                        <TextInput
                            style={s.input}
                            value={definition}
                            onChangeText={setDefinition}
                            placeholder="Übersetzung / Bedeutung"
                            placeholderTextColor={Colors.muted2}
                            returnKeyType="next"
                        />
                    </View>

                    {/* Beispielsatz */}
                    <View style={s.fieldGroup}>
                        <Text style={s.fieldLabel}>Beispielsatz</Text>
                        <TextInput
                            style={[s.input, s.inputKo, s.inputMultiline]}
                            value={exampleSentence}
                            onChangeText={setExampleSentence}
                            placeholder="나는 사과를 먹어요."
                            placeholderTextColor={Colors.muted2}
                            multiline
                            returnKeyType="next"
                        />
                    </View>

                    {/* Hinweis (optional) */}
                    <View style={s.fieldGroup}>
                        <Text style={s.fieldLabel}>Hinweis (optional)</Text>
                        <TextInput
                            style={[s.input, s.inputDashed, s.inputMultiline]}
                            value={hint}
                            onChangeText={setHint}
                            placeholder="z.B. rote Frucht, Buchstabe ㅅ..."
                            placeholderTextColor={Colors.muted2}
                            multiline
                            returnKeyType="done"
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* ── Bild-Quellen-Popup ───────────────────────────── */}
            <ImageSourceSheet
                visible={sheetVisible}
                mode={sheetMode}
                urlInput={urlInput}
                urlPreviewOk={urlPreviewOk}
                onClose={closeSheet}
                onPickGallery={pickFromGallery}
                onSwitchToUrl={() => setSheetMode('url')}
                onBackToChoose={backToChoose}
                onUrlChange={(v) => { setUrlInput(v); setUrlPreviewOk(false); }}
                onUrlPreviewLoad={() => setUrlPreviewOk(true)}
                onUrlPreviewError={() => setUrlPreviewOk(false)}
                onOpenGoogleImages={openGoogleImages}
                onConfirmUrl={confirmUrl}
            />
        </ProtectedRoute>
    );
}

// ─── ImageSourceSheet (als zentriertes Popup) ─────────────────────
// Kein Bottom-Sheet mehr — stattdessen ein zentriertes Popup mit
// Fade+Scale-Animation. KeyboardAvoidingView schiebt das Popup automatisch
// nach oben, wenn die Tastatur beim URL-Eingabefeld erscheint.
function ImageSourceSheet({
    visible, mode, urlInput, urlPreviewOk,
    onClose, onPickGallery, onSwitchToUrl, onBackToChoose,
    onUrlChange, onUrlPreviewLoad, onUrlPreviewError,
    onOpenGoogleImages, onConfirmUrl,
}: {
    visible:            boolean;
    mode:               SheetMode;
    urlInput:           string;
    urlPreviewOk:       boolean;
    onClose:            () => void;
    onPickGallery:      () => void;
    onSwitchToUrl:      () => void;
    onBackToChoose:     () => void;
    onUrlChange:        (v: string) => void;
    onUrlPreviewLoad:   () => void;
    onUrlPreviewError:  () => void;
    onOpenGoogleImages: () => void;
    onConfirmUrl:       () => void;
}) {
    const [mounted, setMounted] = useState(false);

    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const popupOpacity    = useRef(new Animated.Value(0)).current;
    const popupScale      = useRef(new Animated.Value(0.92)).current;

    useEffect(() => {
        if (visible) {
            setMounted(true);
            backdropOpacity.setValue(0);
            popupOpacity.setValue(0);
            popupScale.setValue(0.92);
            Animated.parallel([
                Animated.timing(backdropOpacity, {
                    toValue: 1, duration: 200, useNativeDriver: true,
                }),
                Animated.timing(popupOpacity, {
                    toValue: 1, duration: 200, useNativeDriver: true,
                }),
                Animated.spring(popupScale, {
                    toValue: 1, friction: 8, tension: 65, useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const animateClose = (callback?: () => void) => {
        Keyboard.dismiss();
        Animated.parallel([
            Animated.timing(backdropOpacity, {
                toValue: 0, duration: 150, useNativeDriver: true,
            }),
            Animated.timing(popupOpacity, {
                toValue: 0, duration: 150, useNativeDriver: true,
            }),
            Animated.timing(popupScale, {
                toValue: 0.92, duration: 150, useNativeDriver: true,
            }),
        ]).start(() => {
            setMounted(false);
            onClose();
            callback?.();
        });
    };

    const handleClose       = () => animateClose();
    const handlePickGallery = () => animateClose(onPickGallery);
    const handleConfirmUrl  = () => animateClose(onConfirmUrl);

    const popupContent = mode === 'choose' ? (
        <>
            <Text style={s.sheetTitle}>Bild hinzufügen</Text>

            <Pressable style={s.sheetOption} onPress={handlePickGallery}>
                <Text style={s.sheetOptionIcon}>📷</Text>
                <View style={s.sheetOptionText}>
                    <Text style={s.sheetOptionLabel}>Aus Galerie wählen</Text>
                    <Text style={s.sheetOptionSub}>Fotos auf diesem Gerät</Text>
                </View>
                <Text style={s.sheetOptionChevron}>›</Text>
            </Pressable>

            <View style={s.sheetDivider} />

            <Pressable style={s.sheetOption} onPress={onSwitchToUrl}>
                <Text style={s.sheetOptionIcon}>🌐</Text>
                <View style={s.sheetOptionText}>
                    <Text style={s.sheetOptionLabel}>Bild aus dem Web</Text>
                    <Text style={s.sheetOptionSub}>URL eingeben oder Google Bilder öffnen</Text>
                </View>
                <Text style={s.sheetOptionChevron}>›</Text>
            </Pressable>

            <Pressable style={s.sheetCancel} onPress={handleClose}>
                <Text style={s.sheetCancelText}>Abbrechen</Text>
            </Pressable>
        </>
    ) : (
        <>
            <Text style={s.sheetTitle}>Bild-URL eingeben</Text>

            <Pressable style={s.googleBtn} onPress={onOpenGoogleImages}>
                <Text style={s.googleBtnText}>🔍  Google Bilder öffnen</Text>
            </Pressable>
            <Text style={s.sheetHint}>
                Bild finden → lange drücken → „Link kopieren" → hier einfügen
            </Text>

            <TextInput
                style={s.urlInput}
                value={urlInput}
                onChangeText={onUrlChange}
                placeholder="https://example.com/bild.jpg"
                placeholderTextColor={Colors.muted2}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                returnKeyType="done"
                onSubmitEditing={handleConfirmUrl}
            />

            {urlInput.length > 8 && (
                <View style={s.urlPreview}>
                    <Image
                        source={{ uri: urlInput }}
                        style={s.urlPreviewImage}
                        resizeMode="cover"
                        onLoad={onUrlPreviewLoad}
                        onError={onUrlPreviewError}
                    />
                    {!urlPreviewOk && (
                        <View style={s.urlPreviewOverlay}>
                            <Text style={s.urlPreviewOverlayText}>Vorschau lädt…</Text>
                        </View>
                    )}
                </View>
            )}

            <View style={s.sheetRow}>
                <Pressable
                    style={[s.sheetActionBtn, s.sheetActionBtnSecondary]}
                    onPress={onBackToChoose}
                >
                    <Text style={s.sheetActionBtnTextSecondary}>← Zurück</Text>
                </Pressable>
                <Pressable
                    style={[
                        s.sheetActionBtn,
                        s.sheetActionBtnPrimary,
                        !urlPreviewOk && s.sheetActionBtnDisabled,
                    ]}
                    onPress={handleConfirmUrl}
                    disabled={!urlPreviewOk}
                >
                    <Text style={s.sheetActionBtnTextPrimary}>Übernehmen ✓</Text>
                </Pressable>
            </View>
        </>
    );

    if (!mounted) return null;

    return (
        <View style={[StyleSheet.absoluteFill, { zIndex: 99 }]} pointerEvents="box-none">
            {/* Backdrop */}
            <Animated.View
                style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: 'rgba(0,0,0,0.45)', opacity: backdropOpacity },
                ]}
                pointerEvents="none"
            />

            {/* Tap außerhalb → schließen */}
            <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />

            {/*
             * KeyboardAvoidingView schiebt den Inhalt nach oben,
             * sobald die Tastatur beim URL-Eingabefeld erscheint.
             * pointerEvents="box-none" damit Taps auf den leeren Bereich
             * durch zum Pressable oben fallen.
             */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={s.popupContainer}
                pointerEvents="box-none"
            >
                <Animated.View
                    style={[
                        s.popup,
                        {
                            opacity:   popupOpacity,
                            transform: [{ scale: popupScale }],
                        },
                    ]}
                >
                    {popupContent}
                </Animated.View>
            </KeyboardAvoidingView>
        </View>
    );
}
