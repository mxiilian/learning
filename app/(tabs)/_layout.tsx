import { Tabs } from 'expo-router';

/**
 * Tab-Gruppe: Dashboard + Vokabeln (+ künftige Tabs).
 * Die Standard-Tab-Bar von React Navigation wird versteckt,
 * da jeder Screen seine eigene, gestaltete TabBar mitbringt.
 * Expo Router wechselt zwischen Tabs ohne Slide-Animation.
 */
export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: { display: 'none' },
            }}
        >
            <Tabs.Screen name="dashboard" />
            <Tabs.Screen name="vocab" />
            <Tabs.Screen name="grammar" />
            <Tabs.Screen name="profile" />
        </Tabs>
    );
}
