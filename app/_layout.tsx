import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Caveat_400Regular, Caveat_700Bold } from '@expo-google-fonts/caveat';
import { Kalam_400Regular, Kalam_700Bold } from '@expo-google-fonts/kalam';
import { NotoSansKR_400Regular, NotoSansKR_700Bold } from '@expo-google-fonts/noto-sans-kr';
import { DataProvider } from '@/context/DataContext';

const PAPER = '#fbf9f4';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        Caveat_400Regular,
        Caveat_700Bold,
        Kalam_400Regular,
        Kalam_700Bold,
        NotoSansKR_400Regular,
        NotoSansKR_700Bold,
    });

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) return null;

    return (
        <DataProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style="dark" backgroundColor={PAPER} translucent={false} />
            <Stack
                screenOptions={{
                    headerShown:  false,
                    contentStyle: { backgroundColor: PAPER },
                    animation:    'none',
                }}
            >
                {/* Neue Vokabel: von unten hochschieben wie ein Modal */}
                <Stack.Screen
                    name="new-vocab"
                    options={{ animation: 'slide_from_bottom' }}
                />
                {/* Abfrage-Modus: von unten hochschieben */}
                <Stack.Screen
                    name="review"
                    options={{ animation: 'slide_from_bottom' }}
                />
            </Stack>
        </GestureHandlerRootView>
        </DataProvider>
    );
}
