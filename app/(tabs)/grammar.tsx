import TabBar from '@/components/TabBar';
import { Colors, Fonts } from '@/styles/theme';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GrammarScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.screen, { paddingTop: insets.top }]}>
            <View style={styles.centered}>
                <Text style={styles.label}>✎</Text>
                <Text style={styles.text}>Working on</Text>
            </View>
            <TabBar />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex:            1,
        backgroundColor: Colors.paper,
    },
    centered: {
        flex:           1,
        alignItems:     'center',
        justifyContent: 'center',
        gap:            10,
    },
    label: {
        fontSize: 36,
        color:    Colors.muted,
    },
    text: {
        fontFamily: Fonts.caveat,
        fontSize:   32,
        color:      Colors.muted,
    },
});
