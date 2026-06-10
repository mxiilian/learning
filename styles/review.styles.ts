import { Dimensions, StyleSheet } from 'react-native';
import { Colors, Fonts, Shadows } from './theme';

const { width: SCREEN_W } = Dimensions.get('window');

export const reviewStyles = StyleSheet.create({

    // ── Layout ────────────────────────────────────────────────────
    screen: {
        flex:            1,
        backgroundColor: Colors.paper,
    },

    // ── Top-Bar ───────────────────────────────────────────────────
    topBar: {
        flexDirection:     'row',
        alignItems:        'center',
        gap:               12,
        paddingHorizontal: 20,
        marginBottom:      12,
    },
    closeChip: {
        borderWidth:       1,
        borderColor:       'rgba(255,255,255,0.12)',
        borderRadius:      999,
        paddingHorizontal: 14,
        paddingVertical:   7,
        backgroundColor:   Colors.paper2,
    },
    progressTrack: {
        flex:            1,
        height:          8,
        borderRadius:    99,
        backgroundColor: Colors.paper2,
        overflow:        'hidden',
    },
    progressFill: {
        height:          '100%',
        backgroundColor: Colors.accent,
        borderRadius:    99,
        minWidth:        4,
    },
    countText: {
        fontFamily: Fonts.mono,
        fontSize:   13,
        color:      Colors.muted,
        minWidth:   42,
        textAlign:  'right',
    },

    // ── Box-Chip ──────────────────────────────────────────────────
    boxChipRow: {
        paddingHorizontal: 20,
        marginBottom:      12,
    },
    boxChip: {
        alignSelf:         'flex-start',
        borderWidth:       1,
        borderColor:       'rgba(255,255,255,0.12)',
        borderRadius:      999,
        paddingHorizontal: 14,
        paddingVertical:   5,
        backgroundColor:   Colors.paper2,
    },
    chipText: {
        fontFamily: Fonts.kalam,
        fontSize:   15,
        color:      Colors.ink,
    },

    // ── Karten-Stapel ─────────────────────────────────────────────
    stackWrapper: {
        flex:             1,
        marginHorizontal: 20,
        position:         'relative',
    },

    bgCard: {
        position:        'absolute',
        borderWidth:     1,
        borderColor:     'rgba(255,255,255,0.07)',
        borderRadius:    22,
        backgroundColor: Colors.paper2,
        bottom:          0,
        ...Shadows.card,
    },

    cardOuter: {
        position: 'absolute',
        top:      0,
        bottom:   0,
        left:     0,
        right:    0,
    },

    cardInner: {
        flex: 1,
    },

    cardFace: {
        flex:            1,
        borderWidth:     1,
        borderColor:     'rgba(255,255,255,0.1)',
        borderRadius:    22,
        backgroundColor: Colors.paper2,
        padding:         22,
        ...Shadows.card,
    },
    cardBack: {
        backgroundColor: '#1a1a2a',
        borderColor:     'rgba(255,255,255,0.12)',
    },

    // ── Karten-Inhalt ─────────────────────────────────────────────
    cardLabel: {
        fontFamily:    Fonts.mono,
        fontSize:      11,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        color:         Colors.muted,
        marginBottom:  8,
    },
    definitionText: {
        fontFamily:   Fonts.kalam,
        fontSize:     30,
        color:        Colors.ink,
        lineHeight:   40,
        marginBottom: 16,
    },
    exampleBox: {
        borderWidth:     1,
        borderStyle:     'dashed',
        borderColor:     Colors.muted2,
        borderRadius:    14,
        padding:         14,
        backgroundColor: Colors.paper,
        marginBottom:    16,
    },
    exampleText: {
        fontFamily: Fonts.kalamReg,
        fontSize:   15,
        color:      Colors.inkSoft,
        lineHeight: 22,
    },
    tapHint: {
        fontFamily: Fonts.kalamReg,
        fontSize:   14,
        color:      Colors.muted,
        textAlign:  'center',
        marginTop:  'auto',
    },

    // ── Vorderseite: Bild ─────────────────────────────────────────
    cardImageContainer: {
        flex:            1,
        borderRadius:    14,
        overflow:        'hidden',
        backgroundColor: Colors.paper,
        minHeight:       90,
    },
    cardImageFill: {
        position: 'absolute',
        top:      0,
        left:     0,
        right:    0,
        bottom:   0,
    },
    cardImagePlaceholder: {
        flex:           1,
        alignItems:     'center',
        justifyContent: 'center',
        gap:            8,
        borderRadius:   14,
        borderWidth:    1,
        borderColor:    Colors.muted2,
        borderStyle:    'dashed',
    },
    cardImagePlaceholderIcon: {
        fontSize: 44,
    },
    cardImagePlaceholderText: {
        fontFamily: Fonts.kalamReg,
        fontSize:   15,
        color:      Colors.muted,
    },

    // ── Vorderseite: Hinweis-Bereich ──────────────────────────────
    hintArea: {
        marginTop: 12,
        gap:       8,
    },
    hintToggleBtn: {
        alignSelf:         'center',
        borderWidth:       1,
        borderColor:       'rgba(249,115,22,0.3)',
        borderRadius:      999,
        paddingHorizontal: 18,
        paddingVertical:   8,
        backgroundColor:   Colors.accentSoft,
    },
    hintToggleText: {
        fontFamily: Fonts.kalam,
        fontSize:   15,
        color:      Colors.accent,
    },
    hintBox: {
        borderWidth:     1,
        borderStyle:     'dashed',
        borderColor:     Colors.muted2,
        borderRadius:    14,
        padding:         14,
        backgroundColor: Colors.paper,
    },
    hintText: {
        fontFamily: Fonts.kalamReg,
        fontSize:   15,
        color:      Colors.inkSoft,
        lineHeight: 22,
        textAlign:  'center',
    },

    // ── Rückseite ─────────────────────────────────────────────────
    koreanWord: {
        fontFamily:   Fonts.notoKRBold,
        fontSize:     58,
        color:        Colors.ink,
        lineHeight:   68,
        textAlign:    'center',
        marginBottom: 10,
    },
    divider: {
        height:          1,
        backgroundColor: 'rgba(255,255,255,0.08)',
        marginVertical:  16,
    },
    exampleKoText: {
        fontFamily: Fonts.notoKR,
        fontSize:   18,
        color:      Colors.inkSoft,
        lineHeight: 28,
    },

    // ── Wisch-Badges ──────────────────────────────────────────────
    badge: {
        position:          'absolute',
        zIndex:            10,
        top:               20,
        paddingHorizontal: 14,
        paddingVertical:   6,
        borderRadius:      12,
        borderWidth:       2,
    },
    badgeRight: {
        right:       20,
        borderColor: Colors.good,
        transform:   [{ rotate: '-10deg' }],
    },
    badgeLeft: {
        left:        20,
        borderColor: Colors.bad,
        transform:   [{ rotate: '10deg' }],
    },
    badgeText: {
        fontFamily:    Fonts.kalam,
        fontSize:      20,
        letterSpacing: 0.5,
    },

    // ── Wisch-Hinweise unten ──────────────────────────────────────
    swipeHints: {
        flexDirection:     'row',
        justifyContent:    'space-between',
        alignItems:        'center',
        paddingHorizontal: 24,
        paddingTop:        18,
        paddingBottom:     22,
    },
    swipeLabel: {
        fontFamily: Fonts.caveat,
        fontSize:   18,
        color:      Colors.ink,
    },
    swipeSub: {
        fontFamily: Fonts.kalamReg,
        fontSize:   13,
        color:      Colors.muted,
        marginTop:  2,
    },
    flipChip: {
        borderWidth:       1,
        borderColor:       'rgba(255,255,255,0.12)',
        borderRadius:      999,
        paddingHorizontal: 16,
        paddingVertical:   8,
        backgroundColor:   Colors.paper2,
    },

    // ── Fertig-Screen ─────────────────────────────────────────────
    doneScreen: {
        flex:            1,
        justifyContent:  'center',
        alignItems:      'center',
        backgroundColor: Colors.paper,
        padding:         28,
    },
    doneEmoji: {
        fontFamily: Fonts.caveat,
        fontSize:   80,
    },
    doneTitle: {
        fontFamily: Fonts.kalam,
        fontSize:   32,
        color:      Colors.ink,
        marginTop:  12,
        textAlign:  'center',
    },
    doneSub: {
        fontFamily: Fonts.kalamReg,
        fontSize:   17,
        color:      Colors.muted,
        marginTop:  8,
        textAlign:  'center',
    },
    primaryBtn: {
        borderRadius:      16,
        paddingVertical:   17,
        paddingHorizontal: 32,
        backgroundColor:   Colors.accent,
        alignItems:        'center',
        marginTop:         32,
        ...Shadows.button,
    },
    primaryBtnText: {
        fontFamily:    Fonts.kalam,
        fontSize:      18,
        color:         '#ffffff',
        letterSpacing: 0.3,
    },
});
