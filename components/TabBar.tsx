import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts, Shadows } from '@/styles/theme';
import { StyleSheet } from 'react-native';

// ─── Tab-Einträge ─────────────────────────────────────────────────
const TAB_ITEMS = [
    { id: 'home',      label: 'Home',      icon: '◉', route: '/dashboard' },
    { id: 'vokabeln',  label: 'Vokabeln',  icon: '▣', route: '/vocab'     },
    { id: 'grammatik', label: 'Grammatik', icon: '✎', route: '/grammar'   },
    { id: 'profil',    label: 'Profil',    icon: '◔', route: '/profile'   },
] as const;

type TabId = (typeof TAB_ITEMS)[number]['id'];

// Pathname → Tab-ID
const ROUTE_TO_TAB: Record<string, TabId> = {
    '/dashboard': 'home',
    '/vocab':     'vokabeln',
    '/grammar':   'grammatik',
    '/profile':   'profil',
};

// ─── Komponente ───────────────────────────────────────────────────
export default function TabBar() {
    const router   = useRouter();
    const pathname = usePathname();
    const insets   = useSafeAreaInsets();

    const active = ROUTE_TO_TAB[pathname] ?? 'home';

    return (
        <View style={[styles.tabbar, { bottom: Math.max(insets.bottom + 8, 16) }]}>
            {TAB_ITEMS.map(item => {
                const isActive = item.id === active;
                return (
                    <Pressable
                        key={item.id}
                        style={styles.tabItem}
                        onPress={() => { if (!isActive) router.push(item.route as any); }}
                    >
                        <Text style={[styles.tabIcon, isActive && styles.tabActive]}>
                            {item.icon}
                        </Text>
                        <Text style={[styles.tabLabel, isActive && styles.tabActive]}>
                            {item.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────
const styles = StyleSheet.create({
    tabbar: {
        position:          'absolute',
        left:              10,
        right:             10,
        borderWidth:       1.5,
        borderColor:       Colors.ink,
        borderRadius:      22,
        backgroundColor:   Colors.paper,
        flexDirection:     'row',
        justifyContent:    'space-around',
        alignItems:        'center',
        paddingVertical:   8,
        paddingHorizontal: 6,
        ...Shadows.tabbar,
    },
    tabItem: {
        alignItems:        'center',
        paddingHorizontal: 10,
        paddingVertical:   2,
        gap:               2,
    },
    tabIcon: {
        fontSize: 16,
        color:    Colors.muted,
    },
    tabLabel: {
        fontFamily: Fonts.kalamReg,
        fontSize:   12,
        color:      Colors.muted,
    },
    tabActive: {
        color:      Colors.ink,
        fontFamily: Fonts.kalam,
        fontWeight: '700',
    },
});
