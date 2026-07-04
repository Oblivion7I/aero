import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import { store } from '@redux/store';
import { queryClient } from '@services/queryClient';
import { ThemeProvider } from '@context/ThemeContext';
import RootNavigator from '@navigation/RootNavigator';
import { configureGoogleSignIn, onAuthStateChanged } from '@services/authService';
import { GOOGLE_WEB_CLIENT_ID } from '@constants/env';
import { setUser, signOut } from '@redux/slices/authSlice';

const App: React.FC = () => {
  useEffect(() => {
    configureGoogleSignIn(GOOGLE_WEB_CLIENT_ID);

    const unsubscribeAuth = onAuthStateChanged(user => {
      if (user) {
        store.dispatch(setUser({ userId: user.uid, email: user.email ?? '' }));
      } else {
        store.dispatch(signOut());
      }
    });

    // Push notifications (see NOTIFICATIONS module). Requesting permission
    // here is a reasonable default for Android 13+; consider moving this
    // behind the Notifications toggle in OwnerVerificationScreen if you'd
    // rather ask at point of use like the other permissions.
    messaging()
      .requestPermission()
      .catch(() => {
        // Permission denied — notifications simply won't be delivered;
        // nothing else to do here.
      });

    // Foreground messages don't show a system notification automatically on
    // Android, so surface something to the user while the app is open.
    // Cloud Functions writing to users/{uid}/notifications (see
    // notificationService.ts) is what actually populates the in-app feed;
    // this is just the immediate foreground alert.
    const unsubscribeMessaging = messaging().onMessage(async remoteMessage => {
      const title = remoteMessage.notification?.title ?? 'Aero';
      const body = remoteMessage.notification?.body ?? '';
      Alert.alert(title, body);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeMessaging();
    };
  }, []);

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ThemeProvider>
            <RootNavigator />
          </ThemeProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
};

export default App;
