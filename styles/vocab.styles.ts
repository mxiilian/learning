import { StyleSheet } from 'react-native';
import { Colors, Fonts, Shadows } from './theme';

export const vocabStyles = StyleSheet.create({

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
        padding:       20,
        paddingBottom: 110,
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
        fontSize:   32,
        color:      Colors.ink,
        lineHeight: 40,
    },
    headerKo: {
        fontFamily: Fonts.notoKR,
        fontSize:   14,
        color:      Colors.muted,
        marginTop:  4,
    },
    chipFilled: {
        borderRadius:      999,
        paddingHorizontal: 18,
        paddingVertical:   9,
        backgroundColor:   Colors.accent,
        ...Shadows.button,
    },
    chipFilledText: {
        fontFamily: Fonts.kalam,
        fontSize:   15,
        color:      '#ffffff',
        letterSpacing: 0.2,
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

    // ── Karten ───────────────────────────────────────────────────
    card: {
        borderWidth:     1,
        borderColor:     'rgba(255,255,255,0.09)',
        borderRadius:    18,
        backgroundColor: Colors.paper2,
        padding:         18,
        marginBottom:    12,
        ...Shadows.card,
    },
    cardFlat: {
        ...Shadows.cardFlat,
    },

    // ── Labels & Typografie ───────────────────────────────────────
    sectionLabel: {
        fontFamily:    Fonts.mono,
        fontSize:      11,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        color:         Colors.muted,
        marginBottom:  6,
    },
    cardTitle: {
        fontFamily: Fonts.kalam,
        fontSize:   17,
        color:      Colors.ink,
    },
    subText: {
        fontFamily: Fonts.kalamReg,
        fontSize:   14,
        color:      Colors.muted,
    },

    // ── Donut-Zusammenfassung ─────────────────────────────────────
    summaryCard: {
        flexDirection: 'row',
        alignItems:    'center',
        gap:           20,
        padding:       16,
    },
    summaryRight: {
        flex:     1,
        minWidth: 0,
    },
    summaryTotal: {
        fontFamily: Fonts.caveat,
        fontSize:   28,
        color:      Colors.ink,
        lineHeight: 32,
    },
    summaryDue: {
        fontFamily:   Fonts.kalamReg,
        fontSize:     14,
        color:        Colors.muted,
        marginBottom: 8,
    },
    miniBarRow: {
        flexDirection: 'row',
        gap:           2,
        height:        7,
    },
    miniBarSegment: {
        height:       7,
        borderRadius: 3,
    },

    // ── 5-Box-Balkendiagramm ──────────────────────────────────────
    boxChartCard: {
        padding: 16,
    },
    boxChartHeader: {
        flexDirection:  'row',
        justifyContent: 'space-between',
        alignItems:     'baseline',
        marginBottom:   30,
    },
    boxChartBars: {
        flexDirection:     'row',
        alignItems:        'flex-end',
        gap:               8,
        height:            110,
        paddingHorizontal: 4,
    },
    boxBarColumn: {
        flex:       1,
        alignItems: 'center',
        gap:        5,
    },
    boxBarCountText: {
        fontFamily: Fonts.mono,
        fontSize:   10,
        color:      Colors.muted,
    },
    boxBar: {
        width:        '100%',
        borderRadius: 7,
    },
    boxBarAccent: {
        backgroundColor: Colors.accent,
    },
    boxBarNeutral: {
        backgroundColor: Colors.paper2,
        borderWidth:     1,
        borderColor:     'rgba(255,255,255,0.50)',
    },
    boxBarLabel: {
        fontFamily: Fonts.kalam,
        fontSize:   12,
        color:      Colors.ink,
    },

    // ── Heatmap ───────────────────────────────────────────────────
    heatmapCard: {
        padding: 16,
    },
    heatmapHeader: {
        flexDirection:  'row',
        justifyContent: 'space-between',
        alignItems:     'baseline',
        marginBottom:   10,
    },
    heatmapLegend: {
        flexDirection:  'row',
        justifyContent: 'flex-end',
        alignItems:     'center',
        gap:            4,
        marginTop:      8,
    },
    heatmapLegendText: {
        fontFamily: Fonts.mono,
        fontSize:   10,
        color:      Colors.muted,
    },
    heatmapLegendDot: {
        width:        9,
        height:       9,
        borderRadius: 2,
    },

    // ── Vokabelliste ──────────────────────────────────────────────
    vocabListSection: {
        flexDirection:  'row',
        justifyContent: 'space-between',
        alignItems:     'baseline',
        marginTop:      10,
        marginBottom:   12,
    },
    vocabListTitle: {
        fontFamily: Fonts.kalam,
        fontSize:   17,
        color:      Colors.ink,
    },
    vocabListCount: {
        fontFamily: Fonts.mono,
        fontSize:   11,
        color:      Colors.muted,
    },
    vocabItem: {
        flexDirection:   'row',
        alignItems:      'center',
        gap:             14,
        borderWidth:     1,
        borderColor:     'rgba(255,255,255,0.07)',
        borderRadius:    16,
        backgroundColor: Colors.paper2,
        padding:         14,
        marginBottom:    10,
        ...Shadows.cardFlat,
    },
    vocabBoxBadge: {
        width:          34,
        height:         34,
        borderRadius:   9,
        alignItems:     'center',
        justifyContent: 'center',
        flexShrink:     0,
    },
    vocabBoxBadgeAccent: {
        backgroundColor: Colors.accent,
    },
    vocabBoxBadgeNeutral: {
        backgroundColor: Colors.paper,
        borderWidth:     1,
        borderColor:     'rgba(255,255,255,0.1)',
    },
    vocabBoxBadgeText: {
        fontFamily: Fonts.kalam,
        fontSize:   14,
        color:      '#ffffff',
    },
    vocabItemMid: {
        flex:     1,
        minWidth: 0,
    },
    vocabWord: {
        fontFamily: Fonts.notoKR,
        fontSize:   17,
        color:      Colors.ink,
        lineHeight: 22,
    },
    vocabDef: {
        fontFamily: Fonts.kalamReg,
        fontSize:   14,
        color:      Colors.muted,
        lineHeight: 19,
    },
    vocabStatus: {
        fontFamily: Fonts.mono,
        fontSize:   10,
        color:      Colors.muted,
        textAlign:  'right',
        flexShrink: 0,
    },
    vocabStatusDue: {
        color: Colors.accent,
    },
    vocabEmptyState: {
        alignItems:      'center',
        paddingVertical: 32,
        gap:             10,
    },
    vocabEmptyText: {
        fontFamily: Fonts.kalamReg,
        fontSize:   16,
        color:      Colors.muted,
        textAlign:  'center',
    },
});
