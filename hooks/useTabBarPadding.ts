import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TABBAR_HEIGHT   = 90;
const ELECTRON_OFFSET = 28;

export function useTabBarPadding(): number {
    const insets     = useSafeAreaInsets();
    const isElectron = typeof window !== 'undefined' && !!(window as any).electronAPI;
    return TABBAR_HEIGHT + insets.bottom + (isElectron ? ELECTRON_OFFSET : 0);
}
