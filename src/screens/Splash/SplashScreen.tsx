import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Spacing } from '@constants/typography';
import { getCurrentUser } from '@services/authService';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SPLASH_DELAY_MS = 1200;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useAppTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      const user = getCurrentUser();
      if (user) {
        // TODO: once owner-verification status is persisted (e.g. in
        // Firestore under users/{uid}), check it here to decide between
        // 'OwnerVerification' and 'MainTabs' instead of always re-verifying.
        navigation.replace('OwnerVerification');
      } else {
        navigation.replace('Onboarding');
      }
    }, SPLASH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.primary }]}>
      <Text style={styles.logo}>Aero</Text>
      <Text style={styles.tagline}>Secure. Protect. Recover.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.display,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  tagline: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: '#E0E7FF',
    marginTop: Spacing.sm,
  },
});

export default SplashScreen;
