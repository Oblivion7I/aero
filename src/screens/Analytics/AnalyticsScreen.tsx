import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';
import { MOCK_ANALYTICS } from '@models/Analytics';
import ProgressBar from '@components/ProgressBar';

const AnalyticsScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const data = MOCK_ANALYTICS;
  const maxBattery = Math.max(...data.batteryHistory.map(d => d.value), 100);
  const storagePercent = Math.round((data.storageUsedGb / data.storageTotalGb) * 100);
  const ramPercent = Math.round((data.ramAverageUsedGb / data.ramTotalGb) * 100);

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>Analytics</Text>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Weekly Battery Report</Text>
      <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
        <View style={styles.barsRow}>
          {data.batteryHistory.map(d => (
            <View key={d.label} style={styles.barCol}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { height: `${(d.value / maxBattery) * 100}%`, backgroundColor: Colors.primary },
                  ]}
                />
              </View>
              <Text style={[styles.barLabel, { color: theme.textSecondary }]}>{d.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Storage Report</Text>
      <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
        <ProgressBar
          label="Storage used"
          percent={storagePercent}
          detail={`${data.storageUsedGb} GB of ${data.storageTotalGb} GB`}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>RAM Report</Text>
      <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
        <ProgressBar
          label="Average RAM used"
          percent={ramPercent}
          detail={`${data.ramAverageUsedGb} GB of ${data.ramTotalGb} GB`}
        />
      </View>

      <Text style={[styles.note, { color: theme.textSecondary }]}>
        Monthly and device health reports will appear here once more history is collected.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  title: { fontFamily: FontFamily.bold, fontSize: FontSize.xxl, marginBottom: Spacing.lg },
  sectionTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.lg, marginBottom: Spacing.sm },
  card: { borderRadius: Radius.card, padding: Spacing.md, marginBottom: Spacing.lg },
  barsRow: { flexDirection: 'row', justifyContent: 'space-between', height: 140, alignItems: 'flex-end' },
  barCol: { alignItems: 'center', flex: 1 },
  barTrack: { width: 14, height: 110, backgroundColor: '#88888822', borderRadius: Radius.sm, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: Radius.sm },
  barLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginTop: Spacing.xs },
  note: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, textAlign: 'center', marginTop: Spacing.sm },
});

export default AnalyticsScreen;
