import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';
import { mapAuthError, sendPasswordReset } from '@services/authService';

type Props = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSend = async () => {
    if (!email.trim()) return;
    setError(null);
    setIsSubmitting(true);
    try {
      await sendPasswordReset(email.trim());
      setSent(true);
    } catch (e) {
      // Intentionally still show the generic confirmation for
      // auth/user-not-found to avoid leaking which emails have accounts.
      const code = (e as { code?: string })?.code;
      if (code === 'auth/user-not-found') {
        setSent(true);
      } else {
        setError(mapAuthError(e));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Reset your password</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Enter the email linked to your account and we'll send a reset link.
      </Text>

      {sent ? (
        <View style={styles.confirmation}>
          <Text style={[styles.confirmationText, { color: theme.text }]}>
            If an account exists for {email}, a reset link has been sent.
          </Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => navigation.goBack()} activeOpacity={0.85}>
            <Text style={styles.primaryButtonText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
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
          <TouchableOpacity
            style={[styles.primaryButton, isSubmitting && styles.disabled]}
            onPress={handleSend}
            disabled={isSubmitting}
            activeOpacity={0.85}>
            {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Send Reset Link</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backLink}>
            <Text style={{ color: Colors.primary }}>Back to Sign In</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.xl, justifyContent: 'center' },
  title: { fontFamily: FontFamily.bold, fontSize: FontSize.xxl, marginBottom: Spacing.xs },
  subtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, marginBottom: Spacing.xl, lineHeight: 20 },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    marginBottom: Spacing.md,
  },
  primaryButton: { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: Spacing.md, alignItems: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
  backLink: { alignItems: 'center', marginTop: Spacing.lg },
  confirmation: { alignItems: 'center' },
  confirmationText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, textAlign: 'center', marginBottom: Spacing.xl, lineHeight: 20 },
  error: { color: Colors.danger, fontFamily: FontFamily.medium, fontSize: FontSize.sm, marginBottom: Spacing.md },
  disabled: { opacity: 0.6 },
});

export default ForgotPasswordScreen;
