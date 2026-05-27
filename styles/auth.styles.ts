import { StyleSheet } from 'react-native';
import { Colors, Fonts } from './theme';

export const authStyles = StyleSheet.create({

    container: {
        flex:            1,
        padding:         28,
        justifyContent:  'center',
        backgroundColor: Colors.paper,
    },

    brand: {
        fontFamily:  Fonts.caveat,
        fontSize:    36,
        color:       Colors.ink,
        marginBottom: 8,
        textAlign:   'center',
    },

    title: {
        fontFamily:   Fonts.kalamReg,
        fontSize:     20,
        color:        Colors.muted,
        marginBottom: 32,
        textAlign:    'center',
    },

    input: {
        borderWidth:     1.5,
        borderColor:     Colors.ink,
        borderRadius:    12,
        padding:         14,
        marginBottom:    14,
        fontSize:        16,
        backgroundColor: Colors.paper,
        color:           Colors.ink,
    },

    button: {
        borderWidth:     1.5,
        borderColor:     Colors.ink,
        borderRadius:    12,
        paddingVertical: 14,
        alignItems:      'center',
        marginTop:       4,
        backgroundColor: Colors.accent,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        fontFamily: Fonts.kalam,
        fontSize:   16,
        color:      Colors.ink,
    },

    link: {
        marginTop: 20,
        textAlign: 'center',
        color:     Colors.muted,
        fontSize:  14,
        fontFamily: Fonts.kalamReg,
    },

    errorText: {
        fontFamily:  Fonts.kalamReg,
        fontSize:    13,
        color:       Colors.bad,
        textAlign:   'center',
        marginBottom: 10,
    },
});
