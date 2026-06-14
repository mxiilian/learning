import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Syne_800ExtraBold } from '@expo-google-fonts/syne';
import { Outfit_400Regular, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { NotoSansKR_400Regular, NotoSansKR_700Bold } from '@expo-google-fonts/noto-sans-kr';
import { DataProvider } from '@/context/DataContext';

const BG = '#090910';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded, fontError] = useFonts({
        Syne_800ExtraBold,
        Outfit_400Regular,
        Outfit_600SemiBold,
        Outfit_700Bold,
        NotoSansKR_400Regular,
        NotoSansKR_700Bold,
    });

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError && Platform.OS !== 'web') return null;

    return (
        <DataProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
            <StatusBar style="light" backgroundColor={BG} translucent={false} />
            <Stack
                screenOptions={{
                    headerShown:  false,
                    contentStyle: { backgroundColor: BG },
                    animation:    'none',
                }}
            >
                <Stack.Screen
                    name="new-vocab"
                    options={{ animation: 'slide_from_bottom' }}
                />
                <Stack.Screen
                    name="review"
                    options={{ animation: 'slide_from_bottom' }}
                />
            </Stack>
        </GestureHandlerRootView>
        </DataProvider>
    );
}
