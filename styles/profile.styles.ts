import { StyleSheet } from 'react-native';
import { Colors, Fonts, Shadows } from './theme';

export const profileStyles = StyleSheet.create({

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
        alignItems:     'center',
        gap:            16,
        marginBottom:   28,
    },
    avatarCircle: {
        width:           56,
        height:          56,
        borderRadius:    28,
        backgroundColor: Colors.accentSoft,
        borderWidth:     1,
        borderColor:     'rgba(249,115,22,0.25)',
        justifyContent:  'center',
        alignItems:      'center',
    },
    avatarInitial: {
        fontFamily: Fonts.caveat,
        fontSize:   28,
        color:      Colors.accent,
        lineHeight: 34,
    },
    username: {
        fontFamily: Fonts.caveat,
        fontSize:   26,
        color:      Colors.ink,
        lineHeight: 32,
    },
    subtitle: {
        fontFamily: Fonts.kalamReg,
        fontSize:   13,
        color:      Colors.muted,
        marginTop:  2,
    },

    // ── Heatmap ───────────────────────────────────────────────────
    heatmapCard: {
        borderWidth:     1,
        borderColor:     'rgba(255,255,255,0.09)',
        borderRadius:    18,
        backgroundColor: Colors.paper2,
        padding:         16,
        marginBottom:    20,
        ...Shadows.card,
    },
    heatmapHeader: {
        flexDirection:  'row',
        justifyContent: 'space-between',
        alignItems:     'baseline',
        marginBottom:   10,
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

    // ── Abmelden-Button ───────────────────────────────────────────
    logoutBtn: {
        borderWidth:       1,
        borderColor:       'rgba(239,68,68,0.35)',
        borderRadius:      16,
        paddingVertical:   16,
        paddingHorizontal: 20,
        alignItems:        'center',
        backgroundColor:   'rgba(239,68,68,0.06)',
    },
    logoutText: {
        fontFamily: Fonts.kalam,
        fontSize:   16,
        color:      Colors.bad,
    },
});
