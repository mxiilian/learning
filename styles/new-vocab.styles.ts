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
        padding:       18,
        paddingBottom: 40,
    },

    // ── Header-Zeile (✕  Titel  ✓) ───────────────────────────────
    headerRow: {
        flexDirection:  'row',
        alignItems:     'center',
        justifyContent: 'space-between',
        marginBottom:   14,
    },
    headerTitle: {
        fontFamily: Fonts.caveat,
        fontSize:   22,
        color:      Colors.ink,
    },
    iconBtn: {
        width:           36,
        height:          36,
        borderWidth:     1.5,
        borderColor:     Colors.ink,
        borderRadius:    999,
        alignItems:      'center',
        justifyContent:  'center',
        backgroundColor: Colors.paper,
    },
    iconBtnFilled: {
        backgroundColor: Colors.ink,
    },
    iconBtnText: {
        fontFamily: Fonts.kalam,
        fontSize:   16,
        color:      Colors.ink,
        lineHeight: 20,
    },
    iconBtnTextFilled: {
        color: Colors.paper,
    },
    iconBtnSaving: {
        backgroundColor: Colors.muted2,
        borderColor:     Colors.muted2,
    },

    // ── Bild-Picker ───────────────────────────────────────────────
    imageLabel: {
        fontFamily:    Fonts.mono,
        fontSize:      10,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color:         Colors.muted,
        marginBottom:  6,
    },
    imagePicker: {
        height:          110,
        borderWidth:     1.5,
        borderColor:     Colors.ink,
        borderRadius:    12,
        borderStyle:     'dashed',
        backgroundColor: Colors.paper2,
        alignItems:      'center',
        justifyContent:  'center',
        marginBottom:    14,
        overflow:        'hidden',
    },
    imagePickerText: {
        fontFamily: Fonts.kalamReg,
        fontSize:   14,
        color:      Colors.muted,
    },
    imagePreview: {
        width:  '100%',
        height: '100%',
    },
    imageRemoveBtn: {
        position:        'absolute',
        top:             6,
        right:           6,
        width:           24,
        height:          24,
        borderRadius:    12,
        backgroundColor: Colors.ink,
        alignItems:      'center',
        justifyContent:  'center',
    },
    imageRemoveBtnText: {
        color:      Colors.paper,
        fontSize:   12,
        lineHeight: 14,
    },

    // ── Formularfelder ────────────────────────────────────────────
    fieldGroup: {
        marginBottom: 12,
    },
    fieldLabel: {
        fontFamily:    Fonts.mono,
        fontSize:      10,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color:         Colors.muted,
        marginBottom:  5,
    },
    input: {
        borderWidth:     1.5,
        borderColor:     Colors.ink,
        borderRadius:    12,
        paddingVertical: 10,
        paddingHorizontal: 14,
        backgroundColor: Colors.paper,
        color:           Colors.ink,
        fontFamily:      Fonts.kalamReg,
        fontSize:        16,
        ...Shadows.cardFlat,
    },
    inputKo: {
        fontFamily: Fonts.notoKR,
        fontSize:   20,
    },
    inputMultiline: {
        minHeight:   72,
        textAlignVertical: 'top',
    },
    inputDashed: {
        borderStyle: 'dashed',
        borderColor: Colors.muted2,
        color:       Colors.muted,
    },

    // ── Bild-Quellen-Popup ────────────────────────────────────────
    popupContainer: {
        flex:            1,
        justifyContent:  'center',
        alignItems:      'center',
        paddingHorizontal: 24,
    },
    popup: {
        alignSelf:         'stretch',
        backgroundColor:   Colors.paper,
        borderRadius:      20,
        overflow:          'hidden',
        borderWidth:       1.5,
        borderColor:       Colors.ink,
        paddingHorizontal: 18,
        paddingTop:        18,
        paddingBottom:     16,
    },
    sheetTitle: {
        fontFamily:   Fonts.caveat,
        fontSize:     20,
        color:        Colors.ink,
        marginBottom: 14,
    },
    sheetOption: {
        flexDirection: 'row',
        alignItems:    'center',
        gap:           12,
        paddingVertical: 12,
    },
    sheetOptionIcon: {
        fontSize: 26,
        width:    34,
        textAlign: 'center',
    },
    sheetOptionText: {
        flex: 1,
    },
    sheetOptionLabel: {
        fontFamily: Fonts.kalam,
        fontSize:   15,
        color:      Colors.ink,
    },
    sheetOptionSub: {
        fontFamily: Fonts.kalamReg,
        fontSize:   12,
        color:      Colors.muted,
        marginTop:  1,
    },
    sheetOptionChevron: {
        fontFamily: Fonts.caveat,
        fontSize:   22,
        color:      Colors.muted,
    },
    sheetDivider: {
        height:          1,
        backgroundColor: Colors.paper2,
        marginHorizontal: -18,
    },
    sheetCancel: {
        alignItems:   'center',
        paddingVertical: 14,
        marginTop:    4,
    },
    sheetCancelText: {
        fontFamily: Fonts.kalamReg,
        fontSize:   14,
        color:      Colors.muted,
    },

    // URL-Modus
    googleBtn: {
        borderWidth:       1.5,
        borderColor:       Colors.ink,
        borderRadius:      10,
        paddingVertical:   10,
        paddingHorizontal: 14,
        backgroundColor:   Colors.accentSoft,
        alignItems:        'center',
        marginBottom:      10,
        ...Shadows.button,
    },
    googleBtnText: {
        fontFamily: Fonts.kalam,
        fontSize:   14,
        color:      Colors.ink,
    },
    sheetHint: {
        fontFamily:   Fonts.kalamReg,
        fontSize:     11,
        color:        Colors.muted,
        textAlign:    'center',
        marginBottom: 10,
        lineHeight:   16,
    },
    urlInput: {
        borderWidth:       1.5,
        borderColor:       Colors.ink,
        borderRadius:      10,
        paddingVertical:   9,
        paddingHorizontal: 12,
        backgroundColor:   Colors.paper,
        color:             Colors.ink,
        fontFamily:        Fonts.kalamReg,
        fontSize:          13,
        marginBottom:      10,
    },
    urlPreview: {
        height:          90,
        borderWidth:     1.5,
        borderColor:     Colors.ink,
        borderRadius:    10,
        overflow:        'hidden',
        marginBottom:    12,
        backgroundColor: Colors.paper2,
    },
    urlPreviewImage: {
        width:  '100%',
        height: '100%',
    },
    urlPreviewOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems:      'center',
        justifyContent:  'center',
        backgroundColor: Colors.paper2,
    },
    urlPreviewOverlayText: {
        fontFamily: Fonts.kalamReg,
        fontSize:   12,
        color:      Colors.muted,
    },
    sheetRow: {
        flexDirection: 'row',
        gap:           8,
        marginBottom:  4,
    },
    sheetActionBtn: {
        flex:              1,
        borderWidth:       1.5,
        borderColor:       Colors.ink,
        borderRadius:      10,
        paddingVertical:   10,
        alignItems:        'center',
    },
    sheetActionBtnPrimary: {
        backgroundColor: Colors.ink,
    },
    sheetActionBtnSecondary: {
        backgroundColor: Colors.paper,
    },
    sheetActionBtnDisabled: {
        backgroundColor: Colors.paper2,
        borderColor:     Colors.muted2,
    },
    sheetActionBtnTextPrimary: {
        fontFamily: Fonts.kalam,
        fontSize:   14,
        color:      Colors.paper,
    },
    sheetActionBtnTextSecondary: {
        fontFamily: Fonts.kalam,
        fontSize:   14,
        color:      Colors.ink,
    },

    // ── Fehlermeldung ─────────────────────────────────────────────
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
});
