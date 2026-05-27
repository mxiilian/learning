import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const PAPER = '#fbf9f4';

export default function RootLayout() {
    return (
        <>
            <StatusBar style="dark" backgroundColor={PAPER} translucent={false} />
            <Stack
                screenOptions={{
                    headerShown:  false,
                    contentStyle: { backgroundColor: PAPER },
                    animation:    'none',   // Standard: kein Wischeffekt für Tab-Wechsel
                }}
            >
                {/* Neue Vokabel: von unten hochschieben wie ein Modal */}
                <Stack.Screen
                    name="new-vocab"
                    options={{ animation: 'slide_from_bottom' }}
                />
            </Stack>
        </>
    );
}
