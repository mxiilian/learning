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
        padding:     18,
        paddingBottom: 100,
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
    chipFilled: {
        borderWidth:       1.5,
        borderColor:       Colors.ink,
        borderRadius:      999,
        paddingHorizontal: 12,
        paddingVertical:   5,
        backgroundColor:   Colors.ink,
    },
    chipFilledText: {
        fontFamily: Fonts.kalam,
        fontSize:   13,
        color:      Colors.paper,
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

    // ── Karten ───────────────────────────────────────────────────
    card: {
        borderWidth:     1.5,
        borderColor:     Colors.ink,
        borderRadius:    14,
        backgroundColor: Colors.paper,
        padding:         12,
        marginBottom:    10,
        ...Shadows.card,
    },
    cardFlat: {
        ...Shadows.cardFlat,
    },

    // ── Labels & Typografie ───────────────────────────────────────
    sectionLabel: {
        fontFamily:    Fonts.mono,
        fontSize:      10,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color:         Colors.muted,
        marginBottom:  4,
    },
    cardTitle: {
        fontFamily: Fonts.kalam,
        fontSize:   15,
        color:      Colors.ink,
    },
    subText: {
        fontFamily: Fonts.kalamReg,
        fontSize:   12,
        color:      Colors.muted,
    },

    // ── Donut-Zusammenfassung ─────────────────────────────────────
    summaryCard: {
        flexDirection: 'row',
        alignItems:    'center',
        gap:           12,
        padding:       12,
    },
    summaryRight: {
        flex:    1,
        minWidth: 0,
    },
    summaryTotal: {
        fontFamily: Fonts.caveat,
        fontSize:   22,
        color:      Colors.ink,
        lineHeight: 26,
    },
    summaryDue: {
        fontFamily:  Fonts.kalamReg,
        fontSize:    12,
        color:       Colors.muted,
        marginBottom: 6,
    },
    miniBarRow: {
        flexDirection: 'row',
        gap:           2,
        height:        6,
    },
    miniBarSegment: {
        height:       6,
        borderRadius: 2,
    },

    // ── 5-Box-Balkendiagramm ──────────────────────────────────────
    boxChartCard: {
        padding: 12,
    },
    boxChartHeader: {
        flexDirection:  'row',
        justifyContent: 'space-between',
        alignItems:     'baseline',
        marginBottom:   10,
    },
    boxChartBars: {
        flexDirection: 'row',
        alignItems:    'flex-end',
        gap:           8,
        height:        90,
        paddingHorizontal: 4,
    },
    boxBarColumn: {
        flex:          1,
        alignItems:    'center',
        gap:           4,
    },
    boxBarCountText: {
        fontFamily: Fonts.mono,
        fontSize:   9,
        color:      Colors.muted,
    },
    boxBar: {
        width:        '100%',
        borderWidth:  1.5,
        borderColor:  Colors.ink,
        borderRadius: 6,
    },
    boxBarAccent: {
        backgroundColor: Colors.accent,
    },
    boxBarNeutral: {
        backgroundColor: Colors.paper2,
    },
    boxBarLabel: {
        fontFamily: Fonts.kalam,
        fontSize:   11,
        color:      Colors.ink,
    },

    // ── Heatmap ───────────────────────────────────────────────────
    heatmapCard: {
        padding: 12,
    },
    heatmapHeader: {
        flexDirection:  'row',
        justifyContent: 'space-between',
        alignItems:     'baseline',
        marginBottom:   8,
    },
    // Heatmap-Grid und Zellen werden direkt in vocab.tsx inline definiert,
    // da die Zellgröße zur Laufzeit aus Dimensions berechnet wird.
    heatmapLegend: {
        flexDirection:  'row',
        justifyContent: 'flex-end',
        alignItems:     'center',
        gap:            4,
        marginTop:      6,
    },
    heatmapLegendText: {
        fontFamily: Fonts.mono,
        fontSize:   9,
        color:      Colors.muted,
    },
    heatmapLegendDot: {
        width:        8,
        height:       8,
        borderWidth:  1,
        borderColor:  Colors.ink,
        borderRadius: 2,
    },

    // Tab-Bar-Styles leben in components/TabBar.tsx
});
