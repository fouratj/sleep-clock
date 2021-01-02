import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'react-native-elements';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

dayjs.extend(relativeTime);

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
