import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Spacing } from '@constants/typography';

interface Props {
  title: string;
  description?: string;
}

/**
 * Temporary placeholder used for screens/modules not yet implemented
 * (e.g. Register, ForgotPassword, Devices, Security, Settings).
 * Replace with real screen implementations module by module.
 */
const PlaceholderScreen: React.FC<Props> = ({ title, description }) => {
  const { theme } = useAppTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {description ? (
        <Text style={[styles.description, { color: theme.textSecondary }]}>{description}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  title: { fontFamily: FontFamily.semiBold, fontSize: FontSize.xl, marginBottom: Spacing.xs },
  description: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, textAlign: 'center' },
});

export default PlaceholderScreen;
