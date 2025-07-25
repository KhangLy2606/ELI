import { Stack } from 'expo-router';
import { SignupContextProvider } from "@/context/signupContext";

export default function SignupStackLayout() {

  return (
      <SignupContextProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SignupContextProvider>
  );
}
