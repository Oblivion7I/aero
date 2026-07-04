import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';

interface Props {
  label: string;
  percent: number; // 0-100
  detail?: string;
}

const barColor = (percent: number): string => {
  if (percent >= 85) return Colors.danger;
  if (percent >= 60) return Colors.warning;
  return Colors.success;
};

const ProgressBar: React.FC<Props> = ({ label, percent, detail }) => {
  const { theme } = useAppTheme();
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
        <Text style={[styles.percent, { color: theme.textSecondary }]}>{clamped}%</Text>
      </View>
      <View style={[styles.track, { backgroundColor: theme.border }]}>
        <View style={[styles.fill, { width: `${clamped}%`, backgroundColor: barColor(clamped) }]} />
      </View>
      {detail ? <Text style={[styles.detail, { color: theme.textSecondary }]}>{detail}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.lg },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs },
  label: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  percent: { fontFamily: FontFamily.regular, fontSize: FontSize.xs },
  track: { height: 8, borderRadius: Radius.full, overflow: 'hidden' },
  fill: { height: 8, borderRadius: Radius.full },
  detail: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginTop: Spacing.xs },
});

export default ProgressBar;
