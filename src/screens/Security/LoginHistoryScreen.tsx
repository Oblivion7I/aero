import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';
import { useSecurityCenter } from '@hooks/useSecurityCenter';
import { SecurityEvent, SecurityEventType } from '@models/Security';

const eventColor = (type: SecurityEventType): string => {
  switch (type) {
    case 'security_alert':
      return Colors.danger;
    case 'permission_change':
    case 'password_change':
      return Colors.warning;
    default:
      return Colors.success;
  }
};

const eventIcon = (type: SecurityEventType): string => {
  switch (type) {
    case 'login':
      return '🔐';
    case 'password_change':
      return '🔑';
    case 'permission_change':
      return '⚙️';
    case 'device_registered':
      return '📱';
    case 'security_alert':
      return '⚠️';
    default:
      return '•';
  }
};

const LoginHistoryScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const { events } = useSecurityCenter();

  const renderItem = ({ item }: { item: SecurityEvent }) => (
    <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
      <View style={[styles.iconWrap, { backgroundColor: eventColor(item.type) + '1A' }]}>
        <Text style={styles.icon}>{eventIcon(item.type)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.description, { color: theme.text }]}>{item.description}</Text>
        <Text style={[styles.meta, { color: theme.textSecondary }]}>
          {new Date(item.occurredAt).toLocaleString()}
          {item.location ? ` · ${item.location}` : ''}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={events}
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
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.card, padding: Spacing.md, marginBottom: Spacing.md },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  icon: { fontSize: FontSize.base },
  info: { flex: 1 },
  description: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  meta: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginTop: 2 },
});

export default LoginHistoryScreen;
