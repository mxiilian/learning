import { DataProvider } from '@/context/DataContext';
import { NotoSansKR_400Regular, NotoSansKR_700Bold } from '@expo-google-fonts/noto-sans-kr';
import { Outfit_400Regular, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { Syne_800ExtraBold } from '@expo-google-fonts/syne';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

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
