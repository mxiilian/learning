import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Fonts } from '@/styles/theme';

const TAB_ITEMS = [
    { id: 'home',      label: 'Home',     icon: '◉', route: '/dashboard' },
    { id: 'vokabeln',  label: 'Vokabeln', icon: '▣', route: '/vocab'     },
    { id: 'grammatik', label: 'Grammatik',icon: '✎', route: '/grammar'   },
    { id: 'profil',    label: 'Profil',   icon: '◔', route: '/profile'   },
] as const;

type TabId = (typeof TAB_ITEMS)[number]['id'];

const ROUTE_TO_TAB: Record<string, TabId> = {
    '/dashboard': 'home',
    '/vocab':     'vokabeln',
    '/grammar':   'grammatik',
    '/profile':   'profil',
};

export default function TabBar() {
    const router   = useRouter();
    const pathname = usePathname();
    const insets   = useSafeAreaInsets();

    const active = ROUTE_TO_TAB[pathname] ?? 'home';

    return (
        <View style={[styles.tabbar, { bottom: Math.max(insets.bottom + 10, 18) }]}>
            {TAB_ITEMS.map(item => {
                const isActive = item.id === active;
                return (
                    <Pressable
                        key={item.id}
                        style={styles.tabItem}
                        onPress={() => { if (!isActive) router.push(item.route as any); }}
                    >
                        <View style={[styles.tabPill, isActive && styles.tabPillActive]}>
                            <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
                                {item.icon}
                            </Text>
                        </View>
                        <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                            {item.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    tabbar: {
        position:          'absolute',
        left:              14,
        right:             14,
        borderWidth:       1,
        borderColor:       'rgba(255,255,255,0.08)',
        borderRadius:      30,
        backgroundColor:   Colors.paper2,
        flexDirection:     'row',
        justifyContent:    'space-around',
        alignItems:        'center',
        paddingVertical:   12,
        paddingHorizontal: 10,
        shadowColor:       '#000000',
        shadowOffset:      { width: 0, height: 6 },
        shadowOpacity:     0.55,
        shadowRadius:      20,
        elevation:         12,
    },
    tabItem: {
        alignItems:        'center',
        paddingHorizontal: 10,
        gap:               4,
        minWidth:          56,
    },
    tabPill: {
        width:           40,
        height:          34,
        borderRadius:    17,
        alignItems:      'center',
        justifyContent:  'center',
    },
    tabPillActive: {
        backgroundColor: 'rgba(249,115,22,0.15)',
    },
    tabIcon: {
        fontSize: 19,
        color:    Colors.muted,
    },
    tabIconActive: {
        color: Colors.accent,
    },
    tabLabel: {
        fontFamily: Fonts.kalamReg,
        fontSize:   13,
        color:      Colors.muted,
    },
    tabLabelActive: {
        fontFamily: Fonts.kalam,
        color:      Colors.accent,
    },
});
