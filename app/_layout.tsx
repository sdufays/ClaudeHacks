import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Newsreader_400Regular,
  Newsreader_500Medium,
  Newsreader_700Bold,
} from '@expo-google-fonts/newsreader';
import {
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
} from '@expo-google-fonts/nunito';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

export default function RootLayout() {
  const [loaded] = useFonts({
    Newsreader_400Regular,
    Newsreader_500Medium,
    Newsreader_700Bold,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}
