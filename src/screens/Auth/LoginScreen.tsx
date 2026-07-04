import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';
import { isGoogleSignInCancelled, mapAuthError, signInWithEmail, signInWithGoogle } from '@services/authService';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithEmail(email.trim(), password);
      navigation.replace('OwnerVerification');
    } catch (e) {
      setError(mapAuthError(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      navigation.replace('OwnerVerification');
    } catch (e) {
      if (!isGoogleSignInCancelled(e)) {
        setError(mapAuthError(e));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Welcome back</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Sign in to manage and protect your devices.
      </Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        placeholder="Email"
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { borderColor: theme.border, color: theme.text }]}
        placeholder="Password"
        placeholderTextColor={theme.textSecondary}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={[styles.forgot, { color: Colors.primary }]}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.primaryButton, isSubmitting && styles.disabled]}
        onPress={handleEmailLogin}
        disabled={isSubmitting}
        activeOpacity={0.85}>
        {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Sign In</Text>}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.secondaryButton, { borderColor: theme.border }, isSubmitting && styles.disabled]}
        onPress={handleGoogleLogin}
        disabled={isSubmitting}
        activeOpacity={0.85}>
        <Text style={[styles.secondaryButtonText, { color: theme.text }]}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
        <Text style={{ color: theme.textSecondary }}>
          Don't have an account? <Text style={{ color: Colors.primary }}>Create one</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.xl, justifyContent: 'center' },
  title: { fontFamily: FontFamily.bold, fontSize: FontSize.xxl, marginBottom: Spacing.xs },
  subtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, marginBottom: Spacing.xl },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    marginBottom: Spacing.md,
  },
  forgot: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    textAlign: 'right',
    marginBottom: Spacing.lg,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  primaryButtonText: { color: '#FFFFFF', fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
  secondaryButton: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: { fontFamily: FontFamily.medium, fontSize: FontSize.base },
  registerLink: { alignItems: 'center', marginTop: Spacing.xl },
  error: { color: Colors.danger, fontFamily: FontFamily.medium, fontSize: FontSize.sm, marginBottom: Spacing.md },
  disabled: { opacity: 0.6 },
});

export default LoginScreen;
