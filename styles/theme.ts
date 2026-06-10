import { Platform, StyleSheet } from 'react-native';

// ─── Farben ───────────────────────────────────────────────────────
export const Colors = {
    ink:        '#ede9e4',
    inkSoft:    '#b0aca8',
    muted:      '#72728a',
    muted2:     '#32324a',
    paper:      '#090910',
    paper2:     '#13131e',
    border:     'rgba(255,255,255,0.09)' as string,
    accent:     '#f97316',
    accentSoft: '#1c1208',
    good:       '#22c55e',
    bad:        '#ef4444',
    badSoft:    '#180808',
};

// ─── Font-Familien ────────────────────────────────────────────────
// 3 Schriftfamilien (Koreanisch ausgenommen):
//   1. Syne_800ExtraBold   – Display / Überschriften / große Zahlen
//   2. Outfit_*             – UI-Text, Buttons, Labels
//   3. System Mono          – technische Kleinstbeschriftungen
export const Fonts = {
    caveat:     'Syne_800ExtraBold',     // Display: Zahlen, Titel, Brand
    caveatReg:  'Outfit_400Regular',     // früher casual Caveat Regular
    kalam:      'Outfit_700Bold',        // bold UI-Text, Buttons
    kalamReg:   'Outfit_400Regular',     // regulärer UI-Text
    kalamMed:   'Outfit_600SemiBold',    // mittleres Gewicht
    notoKR:     'NotoSansKR_400Regular',
    notoKRBold: 'NotoSansKR_700Bold',
    mono:       Platform.select({
        ios:     'Courier New',
        android: 'monospace',
        default: 'monospace',
    }) as string,
};

// ─── Schatten ─────────────────────────────────────────────────────
export const Shadows = {
    card: Platform.select({
        ios: {
            shadowColor:   '#000000',
            shadowOffset:  { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius:  10,
        },
        android: { elevation: 6 },
        default: {},
    }),
    cardFlat: Platform.select({
        ios:     { shadowOpacity: 0 },
        android: { elevation: 0 },
        default: {},
    }),
    tabbar: Platform.select({
        ios: {
            shadowColor:   '#000000',
            shadowOffset:  { width: 0, height: 6 },
            shadowOpacity: 0.55,
            shadowRadius:  20,
        },
        android: { elevation: 12 },
        default: {},
    }),
    button: Platform.select({
        ios: {
            shadowColor:   '#f97316',
            shadowOffset:  { width: 0, height: 3 },
            shadowOpacity: 0.4,
            shadowRadius:  8,
        },
        android: { elevation: 4 },
        default: {},
    }),
    buttonDisabled: Platform.select({
        ios:     { shadowOpacity: 0 },
        android: { elevation: 0 },
        default: {},
    }),
};

// ─── Wiederverwendbare Basis-Styles ───────────────────────────────
export const Base = StyleSheet.create({
    card: {
        borderWidth:     1,
        borderColor:     'rgba(255,255,255,0.09)',
        borderRadius:    18,
        backgroundColor: Colors.paper2,
        padding:         18,
        ...Shadows.card,
    },
    cardFlat: {
        borderWidth:     1,
        borderColor:     'rgba(255,255,255,0.09)',
        borderRadius:    18,
        backgroundColor: Colors.paper2,
        padding:         18,
        ...Shadows.cardFlat,
    },

    chip: {
        borderWidth:       1,
        borderColor:       'rgba(255,255,255,0.12)',
        borderRadius:      999,
        paddingHorizontal: 12,
        paddingVertical:   5,
        backgroundColor:   Colors.paper2,
    },

    primaryBtn: {
        borderRadius:      16,
        paddingVertical:   16,
        paddingHorizontal: 20,
        backgroundColor:   Colors.accent,
        alignItems:        'center' as const,
        ...Shadows.button,
    },
    primaryBtnDisabled: {
        backgroundColor: Colors.paper2,
        ...Shadows.buttonDisabled,
    },

    input: {
        borderWidth:     1,
        borderColor:     'rgba(255,255,255,0.12)',
        borderRadius:    14,
        padding:         17,
        marginBottom:    14,
        fontSize:        17,
        backgroundColor: Colors.paper2,
        color:           Colors.ink,
    },

    caveatTitle: {
        fontFamily: Fonts.caveat,
        fontSize:   32,
        color:      Colors.ink,
    },
    kalamBody: {
        fontFamily: Fonts.kalamReg,
        fontSize:   16,
        color:      Colors.ink,
    },
    kalamBold: {
        fontFamily: Fonts.kalam,
        fontSize:   16,
        color:      Colors.ink,
    },
    kalamSub: {
        fontFamily: Fonts.kalamReg,
        fontSize:   14,
        color:      Colors.muted,
    },
    monoLabel: {
        fontFamily:    Fonts.mono,
        fontSize:      11,
        textTransform: 'uppercase' as const,
        letterSpacing: 1.4,
        color:         Colors.muted,
    },
    koText: {
        fontFamily: Fonts.notoKR,
        fontSize:   14,
        color:      Colors.muted,
    },
});
