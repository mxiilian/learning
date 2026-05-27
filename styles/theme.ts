import { Platform, StyleSheet } from 'react-native';

// ─── Farben (entsprechen den CSS-Variablen im Wireframe) ──────────
export const Colors = {
    ink:        '#1a1a1a',
    inkSoft:    '#2d2d2d',
    muted:      '#6b6b6b',
    muted2:     '#a3a3a3',
    paper:      '#fbf9f4',
    paper2:     '#f3f0e8',
    accent:     '#d4912a',   // oklch(72% 0.12 55) – warmes Amber
    accentSoft: '#faf2e4',   // oklch(92% 0.04 55)
    good:       '#5aaa72',   // oklch(70% 0.12 150)
    bad:        '#d95c4a',   // oklch(66% 0.15 25)
    badSoft:    '#fdf0ee',
};

// ─── Font-Familien ────────────────────────────────────────────────
export const Fonts = {
    caveat:     'Caveat_700Bold',
    caveatReg:  'Caveat_400Regular',
    kalam:      'Kalam_700Bold',
    kalamReg:   'Kalam_400Regular',
    notoKR:     'NotoSansKR_400Regular',
    notoKRBold: 'NotoSansKR_700Bold',
    mono:       Platform.select({
        ios:     'Courier New',
        android: 'monospace',
        default: 'monospace',
    }) as string,
};

// ─── Schatten (Ink-Offset-Look aus dem Wireframe) ─────────────────
export const Shadows = {
    card: Platform.select({
        ios: {
            shadowColor:   Colors.ink,
            shadowOffset:  { width: 1.5, height: 2 },
            shadowOpacity: 1,
            shadowRadius:  0,
        },
        android: { elevation: 3 },
        default: {},
    }),
    cardFlat: Platform.select({
        ios:     { shadowOpacity: 0 },
        android: { elevation: 0 },
        default: {},
    }),
    tabbar: Platform.select({
        ios: {
            shadowColor:   Colors.ink,
            shadowOffset:  { width: 1, height: 2 },
            shadowOpacity: 1,
            shadowRadius:  0,
        },
        android: { elevation: 4 },
        default: {},
    }),
    button: Platform.select({
        ios: {
            shadowColor:   Colors.ink,
            shadowOffset:  { width: 1.5, height: 2 },
            shadowOpacity: 1,
            shadowRadius:  0,
        },
        android: { elevation: 3 },
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
    // Karten
    card: {
        borderWidth:     1.5,
        borderColor:     Colors.ink,
        borderRadius:    14,
        backgroundColor: Colors.paper,
        padding:         12,
        ...Shadows.card,
    },
    cardFlat: {
        borderWidth:     1.5,
        borderColor:     Colors.ink,
        borderRadius:    14,
        backgroundColor: Colors.paper,
        padding:         12,
        ...Shadows.cardFlat,
    },

    // Chips (Border-Pill)
    chip: {
        borderWidth:       1.5,
        borderColor:       Colors.ink,
        borderRadius:      999,
        paddingHorizontal: 10,
        paddingVertical:   3,
        backgroundColor:   Colors.paper,
    },

    // Haupt-Button (akzentfarben)
    primaryBtn: {
        borderWidth:     1.5,
        borderColor:     Colors.ink,
        borderRadius:    10,
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: Colors.accent,
        alignItems:      'center' as const,
        ...Shadows.button,
    },
    primaryBtnDisabled: {
        backgroundColor: Colors.paper2,
        ...Shadows.buttonDisabled,
    },

    // Eingabefelder
    input: {
        borderWidth:     1.5,
        borderColor:     Colors.ink,
        borderRadius:    12,
        padding:         14,
        marginBottom:    14,
        fontSize:        16,
        backgroundColor: Colors.paper,
        color:           Colors.ink,
    },

    // Typografie
    caveatTitle: {
        fontFamily: Fonts.caveat,
        fontSize:   28,
        color:      Colors.ink,
    },
    kalamBody: {
        fontFamily: Fonts.kalamReg,
        fontSize:   14,
        color:      Colors.ink,
    },
    kalamBold: {
        fontFamily: Fonts.kalam,
        fontSize:   14,
        color:      Colors.ink,
    },
    kalamSub: {
        fontFamily: Fonts.kalamReg,
        fontSize:   13,
        color:      Colors.muted,
    },
    monoLabel: {
        fontFamily:    Fonts.mono,
        fontSize:      10,
        textTransform: 'uppercase' as const,
        letterSpacing: 1,
        color:         Colors.muted,
    },
    koText: {
        fontFamily: Fonts.notoKR,
        fontSize:   12,
        color:      Colors.muted,
    },
});
