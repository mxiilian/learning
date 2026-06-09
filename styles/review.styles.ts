import { Dimensions, StyleSheet } from 'react-native';
import { Colors, Fonts, Shadows } from './theme';

const { width: SCREEN_W } = Dimensions.get('window');

export const reviewStyles = StyleSheet.create({

    // ── Layout ────────────────────────────────────────────────────
    screen: {
        flex:            1,
        backgroundColor: Colors.paper,
    },

    // ── Top-Bar (✕ · Fortschrittsbalken · Zähler) ────────────────
    topBar: {
        flexDirection:   'row',
        alignItems:      'center',
        gap:             10,
        paddingHorizontal: 18,
        marginBottom:    8,
    },
    closeChip: {
        borderWidth:       1.5,
        borderColor:       Colors.ink,
        borderRadius:      999,
        paddingHorizontal: 10,
        paddingVertical:   4,
        backgroundColor:   Colors.paper,
    },
    progressTrack: {
        flex:            1,
        height:          8,
        borderWidth:     1.2,
        borderColor:     Colors.ink,
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
        fontSize:   11,
        color:      Colors.muted,
        minWidth:   38,
        textAlign:  'right',
    },

    // ── Box-Chip ──────────────────────────────────────────────────
    boxChipRow: {
        paddingHorizontal: 18,
        marginBottom:      10,
    },
    boxChip: {
        alignSelf:         'flex-start',
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

    // ── Karten-Stapel ─────────────────────────────────────────────
    stackWrapper: {
        flex:            1,
        marginHorizontal: 18,
        position:        'relative',
    },

    // Hintergrund-Karten (statisch)
    bgCard: {
        position:        'absolute',
        borderWidth:     1.5,
        borderColor:     Colors.ink,
        borderRadius:    16,
        backgroundColor: Colors.paper,
        bottom:          0,
        ...Shadows.card,
    },

    // Äußere animierte Hülle (translateX + rotate für Wischen)
    cardOuter: {
        position:        'absolute',
        top:             0,
        bottom:          0,
        left:            0,
        right:           0,
    },

    // Innere animierte Hülle (scaleX für Flip)
    cardInner: {
        flex:            1,
    },

    // Gemeinsame Vorder-/Rückseite
    cardFace: {
        flex:            1,
        borderWidth:     1.5,
        borderColor:     Colors.ink,
        borderRadius:    16,
        backgroundColor: Colors.paper,
        padding:         18,
        ...Shadows.card,
    },
    cardBack: {
        backgroundColor: Colors.paper2,
    },

    // ── Karten-Inhalt ─────────────────────────────────────────────
    cardLabel: {
        fontFamily:    Fonts.mono,
        fontSize:      10,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color:         Colors.muted,
        marginBottom:  4,
    },
    definitionText: {
        fontFamily:  Fonts.kalam,
        fontSize:    26,
        color:       Colors.ink,
        lineHeight:  34,
        marginBottom: 12,
    },
    exampleBox: {
        borderWidth:     1.5,
        borderStyle:     'dashed',
        borderColor:     Colors.muted2,
        borderRadius:    10,
        padding:         10,
        backgroundColor: Colors.paper2,
        marginBottom:    12,
    },
    exampleText: {
        fontFamily: Fonts.kalamReg,
        fontSize:   13,
        color:      Colors.inkSoft,
        lineHeight: 20,
    },
    tapHint: {
        fontFamily: Fonts.kalamReg,
        fontSize:   12,
        color:      Colors.muted2,
        textAlign:  'center',
        marginTop:  'auto',
    },

    // ── Vorderseite: Bild ─────────────────────────────────────────
    // Container: flex: 1 gibt ihm den verbleibenden Platz in der Karte
    cardImageContainer: {
        flex:         1,
        borderRadius: 10,
        overflow:     'hidden',
        backgroundColor: Colors.paper2,
        // Mindesthöhe damit das Bild auch ohne Inhalt sichtbar bleibt
        minHeight:    80,
    },
    // Das Bild selbst: füllt den Container vollständig aus
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
        gap:            6,
        borderRadius:   10,
        borderWidth:    1.5,
        borderColor:    Colors.muted2,
        borderStyle:    'dashed',
    },
    cardImagePlaceholderIcon: {
        fontSize: 40,
    },
    cardImagePlaceholderText: {
        fontFamily: Fonts.kalamReg,
        fontSize:   13,
        color:      Colors.muted,
    },

    // ── Vorderseite: Hinweis-Bereich ──────────────────────────────
    hintArea: {
        marginTop: 10,
        gap:       6,
    },
    hintToggleBtn: {
        alignSelf:         'center',
        borderWidth:       1.5,
        borderColor:       Colors.ink,
        borderRadius:      999,
        paddingHorizontal: 12,
        paddingVertical:   5,
        backgroundColor:   Colors.accentSoft,
    },
    hintToggleText: {
        fontFamily: Fonts.kalam,
        fontSize:   13,
        color:      Colors.ink,
    },
    hintBox: {
        borderWidth:     1.5,
        borderStyle:     'dashed',
        borderColor:     Colors.muted2,
        borderRadius:    10,
        padding:         10,
        backgroundColor: Colors.paper2,
    },
    hintText: {
        fontFamily: Fonts.kalamReg,
        fontSize:   13,
        color:      Colors.inkSoft,
        lineHeight: 20,
        textAlign:  'center',
    },

    // Rückseite
    koreanWord: {
        fontFamily:   Fonts.notoKRBold,
        fontSize:     46,
        color:        Colors.ink,
        lineHeight:   56,
        textAlign:    'center',
        marginBottom: 6,
    },
    divider: {
        height:          1.5,
        backgroundColor: Colors.ink,
        opacity:         0.15,
        marginVertical:  12,
    },
    exampleKoText: {
        fontFamily: Fonts.notoKR,
        fontSize:   15,
        color:      Colors.inkSoft,
        lineHeight: 24,
    },

    // ── Wisch-Badges (erscheinen beim Ziehen) ─────────────────────
    badge: {
        position:          'absolute',
        zIndex:            10,
        top:               18,
        paddingHorizontal: 10,
        paddingVertical:   4,
        borderRadius:      8,
        borderWidth:       2,
    },
    badgeRight: {
        right:       18,
        borderColor: Colors.good,
        transform:   [{ rotate: '-10deg' }],
    },
    badgeLeft: {
        left:        18,
        borderColor: Colors.bad,
        transform:   [{ rotate: '10deg' }],
    },
    badgeText: {
        fontFamily:  Fonts.kalam,
        fontSize:    18,
        letterSpacing: 0.5,
    },

    // ── Wisch-Hinweise unten ──────────────────────────────────────
    swipeHints: {
        flexDirection:   'row',
        justifyContent:  'space-between',
        alignItems:      'center',
        paddingHorizontal: 22,
        paddingTop:      16,
        paddingBottom:   20,
    },
    swipeLabel: {
        fontFamily:  Fonts.caveat,
        fontSize:    22,
        fontWeight:  '700',
        color:       Colors.ink,
    },
    swipeSub: {
        fontFamily: Fonts.kalamReg,
        fontSize:   11,
        color:      Colors.muted,
        marginTop:  1,
    },
    flipChip: {
        borderWidth:       1.5,
        borderColor:       Colors.ink,
        borderRadius:      999,
        paddingHorizontal: 12,
        paddingVertical:   5,
        backgroundColor:   Colors.paper,
    },

    // ── Fertig-Screen ─────────────────────────────────────────────
    doneScreen: {
        flex:           1,
        justifyContent: 'center',
        alignItems:     'center',
        backgroundColor: Colors.paper,
        padding:        24,
    },
    doneEmoji: {
        fontFamily: Fonts.caveat,
        fontSize:   72,
    },
    doneTitle: {
        fontFamily:  Fonts.kalam,
        fontSize:    26,
        color:       Colors.ink,
        marginTop:   8,
        textAlign:   'center',
    },
    doneSub: {
        fontFamily: Fonts.kalamReg,
        fontSize:   15,
        color:      Colors.muted,
        marginTop:  4,
        textAlign:  'center',
    },
    primaryBtn: {
        borderWidth:       1.5,
        borderColor:       Colors.ink,
        borderRadius:      10,
        paddingVertical:   12,
        paddingHorizontal: 24,
        backgroundColor:   Colors.accent,
        alignItems:        'center',
        marginTop:         24,
        ...Shadows.button,
    },
    primaryBtnText: {
        fontFamily: Fonts.kalam,
        fontSize:   16,
        color:      Colors.ink,
    },
});
