import { Redirect } from 'expo-router';

// This component redirects the user from the root URL ('/')
// to the default screen of your tab layout.
export default function Index() {
    // Redirect to the '(tab)' layout. Expo Router will automatically
    // load the 'index' screen within that layout.
    return <Redirect href="/landingPage" />;
}
