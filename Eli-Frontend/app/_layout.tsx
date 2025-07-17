// app/_layout.tsx
import { Stack } from "expo-router"
import { Platform } from "react-native"

if (Platform.OS === "web") {
    // Web bundler will pull Tailwind's generated CSS into the page
    require("./globals.css")
}

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="landingPage" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="pricing" options={{ headerShown: false }} />
            <Stack.Screen name="about" options={{ headerShown: false }} />
            <Stack.Screen name="(tab)" options={{ headerShown: false }} />
        </Stack>
    )
}
