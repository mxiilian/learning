import { StyleSheet } from 'react-native';
import { Colors, Fonts, Shadows } from './theme';

export const dashboardStyles = StyleSheet.create({

    // ── Layout ────────────────────────────────────────────────────
    screen: {
        flex:            1,
        backgroundColor: Colors.paper,
    },
    centered: {
        justifyContent: 'center',
        alignItems:     'center',
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding: 18,
        // paddingTop / paddingBottom werden dynamisch via SafeAreaInsets gesetzt
    },

    // ── Header ────────────────────────────────────────────────────
    header: {
        flexDirection:  'row',
        justifyContent: 'space-between',
        alignItems:     'flex-start',
        marginBottom:   14,
    },
    headerTitle: {
        fontFamily: Fonts.caveat,
        fontSize:   28,
        color:      Colors.ink,
        lineHeight: 32,
    },
    headerKo: {
        fontFamily: Fonts.notoKR,
        fontSize:   12,
        color:      Colors.muted,
        marginTop:  2,
    },
    chip: {
        borderWidth:       1.5,
        borderColor:       Colors.ink,
        borderRadius:      999,
        paddingHorizontal: 10,
        paddingVertical:   3,
        backgroundColor:   Colors.paper,
    },
    chipText: {
        fontFamily: Fonts.kalam,
        fontSize:   13,
        color:      Colors.ink,
    },

    // ── Fehlerbanner ──────────────────────────────────────────────
    errorBanner: {
        borderWidth:     1.5,
        borderStyle:     'dashed',
        borderColor:     Colors.bad,
        borderRadius:    10,
        padding:         10,
        marginBottom:    12,
        backgroundColor: Colors.badSoft,
    },
    errorText: {
        fontFamily: Fonts.kalamReg,
        fontSize:   13,
        color:      Colors.bad,
    },

    // ── Karten (Basis kommt aus theme, Overrides hier) ────────────
    card: {
        borderWidth:     1.5,
        borderColor:     Colors.ink,
        borderRadius:    14,
        backgroundColor: Colors.paper,
        padding:         12,
        ...Shadows.card,
    },
    cardFlat: {
        ...Shadows.cardFlat,
    },

    // ── Hero-Karte ────────────────────────────────────────────────
    heroCard: {
        backgroundColor: Colors.accentSoft,
        marginBottom:    10,
    },
    heroDueRow: {
        flexDirection:  'row',
        alignItems:     'baseline',
        gap:            15,
        marginVertical: 4,
        marginBottom:   12,
    },
    heroDueNumber: {
        fontFamily:  Fonts.caveat,
        fontSize:    56,
        color:       Colors.ink,
        lineHeight:  60,
        paddingRight: 4,
    },
    heroDueSub: {
        fontFamily: Fonts.kalamReg,
        fontSize:   13,
        color:      Colors.muted,
    },
    primaryBtn: {
        borderWidth:       1.5,
        borderColor:       Colors.ink,
        borderRadius:      10,
        paddingVertical:   10,
        paddingHorizontal: 14,
        backgroundColor:   Colors.accent,
        alignItems:        'center',
        ...Shadows.button,
    },
    primaryBtnDisabled: {
        backgroundColor: Colors.paper2,
        ...Shadows.buttonDisabled,
    },
    primaryBtnText: {
        fontFamily: Fonts.kalam,
        fontSize:   15,
        color:      Colors.ink,
    },

    // ── Stats-Zeile ───────────────────────────────────────────────
    statsRow: {
        flexDirection: 'row',
        gap:           8,
        marginBottom:  14,
    },
    statCard: {
        flex:    1,
        padding: 10,
    },
    statNumber: {
        fontFamily: Fonts.caveat,
        fontSize:   26,
        color:      Colors.ink,
        marginTop:  2,
    },
    statNumberSub: {
        fontFamily: Fonts.caveatReg,
        fontSize:   14,
        color:      Colors.muted,
    },

    // ── Leitner-Boxen ─────────────────────────────────────────────
    sectionLabel: {
        fontFamily:    Fonts.mono,
        fontSize:      10,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color:         Colors.muted,
        marginBottom:  6,
    },
    boxesWrapper: {
        gap:          6,
        marginBottom: 14,
    },
    boxRow: {
        flexDirection:   'row',
        alignItems:      'center',
        gap:             10,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    boxRowHighlight: {
        backgroundColor: Colors.accentSoft,
    },
    boxBadge: {
        width:           28,
        height:          28,
        borderWidth:     1.5,
        borderColor:     Colors.ink,
        borderRadius:    7,
        justifyContent:  'center',
        alignItems:      'center',
        backgroundColor: Colors.paper,
        flexShrink:      0,
    },
    boxBadgeHighlight: {
        backgroundColor: Colors.accent,
    },
    boxBadgeText: {
        fontFamily: Fonts.caveat,
        fontSize:   16,
        color:      Colors.ink,
    },
    boxBadgeTextHighlight: {
        color: Colors.paper,
    },
    boxMid: {
        flex:     1,
        minWidth: 0,
    },
    boxTopRow: {
        flexDirection:  'row',
        justifyContent: 'space-between',
        alignItems:     'baseline',
    },
    boxLabel: {
        fontFamily: Fonts.kalam,
        fontSize:   13,
        color:      Colors.ink,
    },
    boxCount: {
        fontFamily: Fonts.mono,
        fontSize:   10,
        color:      Colors.muted,
    },
    barTrack: {
        height:          8,
        borderWidth:     1.2,
        borderColor:     Colors.ink,
        borderRadius:    99,
        backgroundColor: Colors.paper,
        overflow:        'hidden',
        marginTop:       4,
    },
    barFill: {
        height:          '100%',
        backgroundColor: Colors.accent,
        borderRadius:    99,
        minWidth:        4,
    },
    boxInterval: {
        fontFamily: Fonts.kalamReg,
        fontSize:   11,
        color:      Colors.muted,
        flexShrink: 0,
        textAlign:  'right',
        maxWidth:   72,
    },

    // Tab-Bar-Styles leben in components/TabBar.tsx
});
