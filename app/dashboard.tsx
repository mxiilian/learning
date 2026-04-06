import ProtectedRoute from '@/components/ProtectedRoute';
import Header from '@/components/ui/Header';
import { Text } from 'react-native';
export default function Dashboard() {
    
    return (
        <Header>
            <ProtectedRoute>
                <Text>Dashboard</Text>
                <Text>Welcome to the dashboard!</Text>
            </ProtectedRoute>
        </Header>
    );
}