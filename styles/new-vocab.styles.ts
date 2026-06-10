import { StyleSheet } from 'react-native';
import { Colors, Fonts, Shadows } from './theme';

export const newVocabStyles = StyleSheet.create({

    // ── Layout ────────────────────────────────────────────────────
    screen: {
        flex:            1,
        backgroundColor: Colors.paper,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        padding:       20,
        paddingBottom: 52,
    },

    // ── Header-Zeile ─────────────────────────────────────────────
    headerRow: {
        flexDirection:  'row',
        alignItems:     'center',
        justifyContent: 'space-between',
        marginBottom:   22,
    },
    headerTitle: {
        fontFamily: Fonts.caveat,
        fontSize:   20,
        color:      Colors.ink,
    },
    iconBtn: {
        width:           44,
        height:          44,
        borderWidth:     1,
        borderColor:     'rgba(255,255,255,0.12)',
        borderRadius:    999,
        alignItems:      'center',
        justifyContent:  'center',
        backgroundColor: Colors.paper2,
    },
    iconBtnFilled: {
        backgroundColor: Colors.accent,
        borderColor:     Colors.accent,
        shadowColor:     '#f97316',
        shadowOffset:    { width: 0, height: 3 },
        shadowOpacity:   0.45,
        shadowRadius:    8,
        elevation:       5,
    },
    iconBtnText: {
        fontFamily: Fonts.kalam,
        fontSize:   19,
        color:      Colors.ink,
        lineHeight: 22,
    },
    iconBtnTextFilled: {
        color: '#ffffff',
    },
    iconBtnSaving: {
        backgroundColor: Colors.muted2,
        borderColor:     Colors.muted2,
    },

    // ── Bild-Picker ───────────────────────────────────────────────
    imageLabel: {
        fontFamily:    Fonts.mono,
        fontSize:      11,
        textTransform: 'uppercase',
        letterSpacing: 1.4,
        color:         Colors.muted,
        marginBottom:  8,
    },
    imagePicker: {
        height:          140,
        borderWidth:     1,
        borderColor:     'rgba(255,255,255,0.12)',
        borderRadius:    16,
        borderStyle:     'dashed',
        backgroundColor: Colors.paper2,
        alignItems:      'center',
        justifyContent:  'center',
        marginBottom:    18,
        overflow:        'hidden',
    },
    imagePickerText: {
        fontFamily: Fonts.kalamReg,
        fontSize:   15,
        color:      Colors.muted,
    },
    imagePreview: {
        width:  '100%',
        height: '100%',
    },
    imageRemoveBtn: {
        position:        'absolute',
        top:             10,
        right:           10,
        width:           28,
        height:          28,
        borderRadius:    14,
        backgroundColor: Colors.paper,
        borderWidth:     1,
        borderColor:     'rgba(255,255,255,0.15)',
        alignItems:      'center',
        justifyContent:  'center',
    },
    imageRemoveBtnText: {
        color:      Colors.ink,
        fontSize:   13,
        lineHeight: 15,
    },

    // ── Formularfelder ────────────────────────────────────────────
    fieldGroup: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontFamily:    Fonts.mono,
        fontSize:      11,
        textTransform: 'uppercase',
        letterSpacing: 1.4,
        color:         Colors.muted,
        marginBottom:  7,
    },
    input: {
        borderWidth:       1,
        borderColor:       'rgba(255,255,255,0.12)',
        borderRadius:      14,
        paddingVertical:   15,
        paddingHorizontal: 16,
        backgroundColor:   Colors.paper2,
        color:             Colors.ink,
        fontFamily:        Fonts.kalamReg,
        fontSize:          17,
        ...Shadows.cardFlat,
    },
    inputKo: {
        fontFamily: Fonts.notoKR,
        fontSize:   26,
    },
    inputMultiline: {
        minHeight:         90,
        textAlignVertical: 'top',
    },
    inputDashed: {
        borderStyle: 'dashed',
        borderColor: Colors.muted2,
        color:       Colors.muted,
    },

    // ── Bild-Quellen-Popup ────────────────────────────────────────
    popupContainer: {
        flex:              1,
        justifyContent:    'center',
        alignItems:        'center',
        paddingHorizontal: 20,
    },
    popup: {
        alignSelf:         'stretch',
        backgroundColor:   Colors.paper2,
        borderRadius:      24,
        overflow:          'hidden',
        borderWidth:       1,
        borderColor:       'rgba(255,255,255,0.1)',
        paddingHorizontal: 20,
        paddingTop:        22,
        paddingBottom:     18,
        ...Shadows.card,
    },
    sheetTitle: {
        fontFamily:   Fonts.caveat,
        fontSize:     26,
        color:        Colors.ink,
        marginBottom: 16,
    },
    sheetOption: {
        flexDirection:   'row',
        alignItems:      'center',
        gap:             16,
        paddingVertical: 15,
    },
    sheetOptionIcon: {
        fontSize:  28,
        width:     36,
        textAlign: 'center',
    },
    sheetOptionText: {
        flex: 1,
    },
    sheetOptionLabel: {
        fontFamily: Fonts.kalam,
        fontSize:   17,
        color:      Colors.ink,
    },
    sheetOptionSub: {
        fontFamily: Fonts.kalamReg,
        fontSize:   14,
        color:      Colors.muted,
        marginTop:  2,
    },
    sheetOptionChevron: {
        fontFamily: Fonts.caveat,
        fontSize:   24,
        color:      Colors.muted,
    },
    sheetDivider: {
        height:           1,
        backgroundColor:  'rgba(255,255,255,0.07)',
        marginHorizontal: -20,
    },
    sheetCancel: {
        alignItems:      'center',
        paddingVertical: 16,
        marginTop:       6,
    },
    sheetCancelText: {
        fontFamily: Fonts.kalamReg,
        fontSize:   16,
        color:      Colors.muted,
    },

    // URL-Modus
    googleBtn: {
        borderRadius:      14,
        paddingVertical:   13,
        paddingHorizontal: 18,
        backgroundColor:   Colors.accentSoft,
        borderWidth:       1,
        borderColor:       'rgba(249,115,22,0.2)',
        alignItems:        'center',
        marginBottom:      14,
    },
    googleBtnText: {
        fontFamily: Fonts.kalam,
        fontSize:   16,
        color:      Colors.accent,
    },
    sheetHint: {
        fontFamily:   Fonts.kalamReg,
        fontSize:     13,
        color:        Colors.muted,
        textAlign:    'center',
        marginBottom: 12,
        lineHeight:   18,
    },
    urlInput: {
        borderWidth:       1,
        borderColor:       'rgba(255,255,255,0.12)',
        borderRadius:      12,
        paddingVertical:   12,
        paddingHorizontal: 14,
        backgroundColor:   Colors.paper,
        color:             Colors.ink,
        fontFamily:        Fonts.kalamReg,
        fontSize:          15,
        marginBottom:      12,
    },
    urlPreview: {
        height:          100,
        borderWidth:     1,
        borderColor:     'rgba(255,255,255,0.1)',
        borderRadius:    14,
        overflow:        'hidden',
        marginBottom:    14,
        backgroundColor: Colors.paper,
    },
    urlPreviewImage: {
        width:  '100%',
        height: '100%',
    },
    urlPreviewOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems:      'center',
        justifyContent:  'center',
        backgroundColor: Colors.paper,
    },
    urlPreviewOverlayText: {
        fontFamily: Fonts.kalamReg,
        fontSize:   13,
        color:      Colors.muted,
    },
    sheetRow: {
        flexDirection: 'row',
        gap:           10,
        marginBottom:  6,
    },
    sheetActionBtn: {
        flex:              1,
        borderWidth:       1,
        borderColor:       'rgba(255,255,255,0.12)',
        borderRadius:      14,
        paddingVertical:   13,
        alignItems:        'center',
    },
    sheetActionBtnPrimary: {
        backgroundColor: Colors.accent,
        borderColor:     Colors.accent,
    },
    sheetActionBtnSecondary: {
        backgroundColor: Colors.paper2,
    },
    sheetActionBtnDisabled: {
        backgroundColor: Colors.paper,
        borderColor:     Colors.muted2,
    },
    sheetActionBtnTextPrimary: {
        fontFamily: Fonts.kalam,
        fontSize:   15,
        color:      '#ffffff',
    },
    sheetActionBtnTextSecondary: {
        fontFamily: Fonts.kalam,
        fontSize:   15,
        color:      Colors.ink,
    },

    // ── Fehlermeldung ─────────────────────────────────────────────
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
        fontSize:   14,
        color:      Colors.bad,
    },
});
