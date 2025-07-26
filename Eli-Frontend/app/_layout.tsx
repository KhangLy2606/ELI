// app/_layout.tsx
import { Stack } from "expo-router"
import { Platform } from "react-native"
import { AuthProvider } from '@/context/authContext';
import "./globals.css"
import ClientLayout from "./(dashboard)/_layout"


if (Platform.OS === "web") {
    // Web bundler will pull Tailwind's generated CSS into the page
    require("./globals.css")
}

export default function RootLayout() {
    return (
        <AuthProvider>
        <Stack>
            <Stack.Screen name="landingPage" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="pricing" options={{ headerShown: false }} />
            <Stack.Screen name="about" options={{ headerShown: false }} />
            <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
        </Stack>
    </AuthProvider>
    );
}
