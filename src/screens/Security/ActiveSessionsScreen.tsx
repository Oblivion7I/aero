import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';
import { useSecurityCenter } from '@hooks/useSecurityCenter';
import { SessionInfo } from '@models/Security';

const ActiveSessionsScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const { sessions, revokeSession } = useSecurityCenter();

  const renderItem = ({ item }: { item: SessionInfo }) => (
    <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={[styles.deviceName, { color: theme.text }]}>{item.deviceName}</Text>
          <Text style={[styles.meta, { color: theme.textSecondary }]}>{item.location}</Text>
          <Text style={[styles.meta, { color: theme.textSecondary }]}>
            Last active {new Date(item.lastActiveAt).toLocaleString()}
          </Text>
        </View>
        {item.isCurrentSession ? (
          <View style={[styles.badge, { backgroundColor: Colors.success + '22' }]}>
            <Text style={[styles.badgeText, { color: Colors.success }]}>This device</Text>
          </View>
        ) : (
          <TouchableOpacity onPress={() => revokeSession(item.id)}>
            <Text style={styles.revoke}>Sign out</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={sessions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.xl },
  list: { paddingBottom: Spacing.xxl },
  card: { borderRadius: Radius.card, padding: Spacing.md, marginBottom: Spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  info: { flex: 1, marginRight: Spacing.sm },
  deviceName: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
  meta: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginTop: 2 },
  badge: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.full },
  badgeText: { fontFamily: FontFamily.medium, fontSize: FontSize.xs },
  revoke: { color: Colors.danger, fontFamily: FontFamily.medium, fontSize: FontSize.sm },
});

export default ActiveSessionsScreen;
