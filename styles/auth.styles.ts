import { StyleSheet } from 'react-native';
import { Colors, Fonts } from './theme';

export const authStyles = StyleSheet.create({

    container: {
        flex:            1,
        padding:         32,
        justifyContent:  'center',
        backgroundColor: Colors.paper,
    },

    brand: {
        fontFamily:    Fonts.notoKRBold,
        fontSize:      52,
        color:         Colors.accent,
        marginBottom:  6,
        textAlign:     'center',
        letterSpacing: -0.5,
    },

    title: {
        fontFamily:   Fonts.kalamMed,
        fontSize:     20,
        color:        Colors.muted,
        marginBottom: 40,
        textAlign:    'center',
        letterSpacing: 0.2,
    },

    input: {
        borderWidth:     1,
        borderColor:     'rgba(255,255,255,0.12)',
        borderRadius:    16,
        padding:         18,
        marginBottom:    14,
        fontSize:        17,
        backgroundColor: Colors.paper2,
        color:           Colors.ink,
        fontFamily:      Fonts.kalamReg,
    },

    button: {
        borderRadius:    16,
        paddingVertical: 18,
        alignItems:      'center',
        marginTop:       8,
        backgroundColor: Colors.accent,
        shadowColor:     '#f97316',
        shadowOffset:    { width: 0, height: 4 },
        shadowOpacity:   0.45,
        shadowRadius:    10,
        elevation:       6,
    },
    buttonDisabled: {
        opacity:       0.5,
        shadowOpacity: 0,
    },
    buttonText: {
        fontFamily:    Fonts.kalam,
        fontSize:      18,
        color:         '#ffffff',
        letterSpacing: 0.4,
    },

    link: {
        marginTop:     24,
        textAlign:     'center',
        color:         Colors.muted,
        fontSize:      16,
        fontFamily:    Fonts.kalamReg,
    },

    errorText: {
        fontFamily:   Fonts.kalamReg,
        fontSize:     14,
        color:        Colors.bad,
        textAlign:    'center',
        marginBottom: 12,
    },
});
