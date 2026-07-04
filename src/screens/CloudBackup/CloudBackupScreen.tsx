import React from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';
import { useCloudBackup } from '@hooks/useCloudBackup';
import { BackupRecord } from '@models/CloudBackup';

const CloudBackupScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const { backups, isSyncing, isRestoring, runBackupNow, restoreBackup } = useCloudBackup();

  const confirmRestore = (item: BackupRecord) => {
    Alert.alert(
      'Restore this backup?',
      `This will overwrite your current device data with the backup from ${new Date(item.createdAt).toLocaleString()}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Restore', style: 'destructive', onPress: () => restoreBackup(item.id) },
      ],
    );
  };

  const renderItem = ({ item }: { item: BackupRecord }) => (
    <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
      <View>
        <Text style={[styles.label, { color: theme.text }]}>{item.label}</Text>
        <Text style={[styles.meta, { color: theme.textSecondary }]}>
          {new Date(item.createdAt).toLocaleString()} · {item.sizeMb} MB
        </Text>
      </View>
      {isRestoring === item.id ? (
        <ActivityIndicator color={Colors.primary} />
      ) : (
        <TouchableOpacity onPress={() => confirmRestore(item)} disabled={!!isRestoring}>
          <Text style={styles.restore}>Restore</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.syncCard, { backgroundColor: theme.surface }, Shadow.soft]}>
        <Text style={[styles.syncTitle, { color: theme.text }]}>Encrypted Cloud Sync</Text>
        <Text style={[styles.syncSub, { color: theme.textSecondary }]}>
          Settings and device data are encrypted on this device before upload — the key never leaves
          your phone.
        </Text>
        <TouchableOpacity style={styles.syncButton} onPress={runBackupNow} disabled={isSyncing} activeOpacity={0.85}>
          {isSyncing ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.syncButtonText}>Back Up Now</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Backup History</Text>
      <FlatList
        data={backups}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={[styles.empty, { color: theme.textSecondary }]}>No backups yet.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.xl },
  syncCard: { borderRadius: Radius.card, padding: Spacing.lg, marginBottom: Spacing.lg },
  syncTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.lg },
  syncSub: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, marginTop: Spacing.xs, marginBottom: Spacing.md },
  syncButton: { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: Spacing.md, alignItems: 'center' },
  syncButtonText: { color: '#FFFFFF', fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
  sectionTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.lg, marginBottom: Spacing.sm },
  list: { paddingBottom: Spacing.xxl },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: Radius.card, padding: Spacing.md, marginBottom: Spacing.md },
  label: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  meta: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginTop: 2 },
  restore: { color: Colors.primary, fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  empty: { textAlign: 'center', fontFamily: FontFamily.regular, fontSize: FontSize.sm, marginTop: Spacing.xl },
});

export default CloudBackupScreen;
