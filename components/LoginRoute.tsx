import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { isAuthenticated } from '@/services/authService';

export default function LoginRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        isAuthenticated().then((auth) => {
            if (auth) {
                router.replace('/dashboard'); 
            } else {
                setChecked(true);
            }
        });
    }, []);

    if (!checked) return null; 

    return <>{children}</>;
}