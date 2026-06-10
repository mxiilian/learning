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
        padding: 20,
    },

    // ── Header ────────────────────────────────────────────────────
    header: {
        flexDirection:  'row',
        justifyContent: 'space-between',
        alignItems:     'flex-start',
        marginBottom:   22,
    },
    headerTitle: {
        fontFamily: Fonts.caveat,
        fontSize:   30,
        color:      Colors.ink,
        lineHeight: 40,
    },
    headerKo: {
        fontFamily: Fonts.notoKR,
        fontSize:   14,
        color:      Colors.muted,
        marginTop:  4,
    },
    chip: {
        borderWidth:       1,
        borderColor:       'rgba(255,255,255,0.12)',
        borderRadius:      999,
        paddingHorizontal: 14,
        paddingVertical:   7,
        backgroundColor:   Colors.paper2,
    },
    chipText: {
        fontFamily: Fonts.kalam,
        fontSize:   15,
        color:      Colors.ink,
    },

    // ── Fehlerbanner ──────────────────────────────────────────────
    errorBanner: {
        borderWidth:     1,
        borderStyle:     'dashed',
        borderColor:     Colors.bad,
        borderRadius:    14,
        padding:         14,
        marginBottom:    16,
        backgroundColor: Colors.badSoft,
    },
    errorText: {
        fontFamily: Fonts.kalamReg,
        fontSize:   15,
        color:      Colors.bad,
    },

    // ── Karten ────────────────────────────────────────────────────
    card: {
        borderWidth:     1,
        borderColor:     'rgba(255,255,255,0.09)',
        borderRadius:    18,
        backgroundColor: Colors.paper2,
        padding:         18,
        ...Shadows.card,
    },
    cardFlat: {
        ...Shadows.cardFlat,
    },

    // ── Hero-Karte ────────────────────────────────────────────────
    heroCard: {
        backgroundColor: Colors.accentSoft,
        borderColor:     'rgba(249,115,22,0.2)',
        marginBottom:    14,
    },
    heroDueRow: {
        flexDirection:  'row',
        alignItems:     'baseline',
        gap:            14,
        marginVertical: 6,
        marginBottom:   16,
    },
    heroDueNumber: {
        fontFamily: Fonts.caveat,
        fontSize:   76,
        color:      Colors.accent,
        lineHeight: 80,
    },
    heroDueSub: {
        fontFamily: Fonts.kalamReg,
        fontSize:   16,
        color:      Colors.muted,
    },
    primaryBtn: {
        borderRadius:      16,
        paddingVertical:   16,
        paddingHorizontal: 20,
        backgroundColor:   Colors.accent,
        alignItems:        'center',
        ...Shadows.button,
    },
    primaryBtnDisabled: {
        backgroundColor: Colors.paper2,
        borderWidth:     1,
        borderColor:     'rgba(255,255,255,0.09)',
        ...Shadows.buttonDisabled,
    },
    primaryBtnText: {
        fontFamily:    Fonts.kalam,
        fontSize:      17,
        color:         '#ffffff',
        letterSpacing: 0.3,
    },

    // ── Stats-Zeile ───────────────────────────────────────────────
    statsRow: {
        flexDirection: 'row',
        gap:           12,
        marginBottom:  18,
    },
    statCard: {
        flex:    1,
        padding: 16,
    },
    statNumber: {
        fontFamily: Fonts.caveat,
        fontSize:   34,
        color:      Colors.ink,
        marginTop:  6,
    },
    statNumberSub: {
        fontFamily: Fonts.caveatReg,
        fontSize:   16,
        color:      Colors.muted,
    },

    // ── Leitner-Boxen ─────────────────────────────────────────────
    sectionLabel: {
        fontFamily:    Fonts.mono,
        fontSize:      13,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        color:         Colors.muted,
        marginBottom:  10,
    },
    boxesWrapper: {
        gap:          8,
        marginBottom: 18,
    },
    boxRow: {
        flexDirection:   'row',
        alignItems:      'center',
        gap:             14,
        paddingHorizontal: 14,
        paddingVertical: 12,
    },
    boxRowHighlight: {
        backgroundColor: Colors.accentSoft,
        borderColor:     'rgba(249,115,22,0.2)',
    },
    boxBadge: {
        width:           36,
        height:          36,
        borderWidth:     1,
        borderColor:     'rgba(255,255,255,0.12)',
        borderRadius:    10,
        justifyContent:  'center',
        alignItems:      'center',
        backgroundColor: Colors.paper,
        flexShrink:      0,
    },
    boxBadgeHighlight: {
        backgroundColor: Colors.accent,
        borderColor:     Colors.accent,
    },
    boxBadgeText: {
        fontFamily: Fonts.caveat,
        fontSize:   19,
        color:      Colors.ink,
    },
    boxBadgeTextHighlight: {
        color: '#ffffff',
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
        fontSize:   15,
        color:      Colors.ink,
    },
    boxCount: {
        fontFamily: Fonts.mono,
        fontSize:   11,
        color:      Colors.muted,
    },
    barTrack: {
        height:          7,
        borderRadius:    99,
        backgroundColor: Colors.paper,
        overflow:        'hidden',
        marginTop:       6,
    },
    barFill: {
        height:          '100%',
        backgroundColor: Colors.accent,
        borderRadius:    99,
        minWidth:        4,
    },
    boxInterval: {
        fontFamily: Fonts.kalamReg,
        fontSize:   13,
        color:      Colors.muted,
        flexShrink: 0,
        textAlign:  'right',
        maxWidth:   80,
    },
});
