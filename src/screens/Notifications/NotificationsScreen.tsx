import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';
import { useNotifications } from '@hooks/useNotifications';
import { AppNotification, NOTIFICATION_ICON } from '@models/Notification';

const NotificationsScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const renderItem = ({ item }: { item: AppNotification }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: item.read ? theme.surface : Colors.primary + '0F' },
        Shadow.soft,
      ]}
      onPress={() => markAsRead(item.id)}
      activeOpacity={0.85}>
      <Text style={styles.icon}>{NOTIFICATION_ICON[item.type]}</Text>
      <View style={styles.info}>
        <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.body, { color: theme.textSecondary }]}>{item.body}</Text>
        <Text style={[styles.time, { color: theme.textSecondary }]}>
          {new Date(item.occurredAt).toLocaleString()}
        </Text>
      </View>
      {!item.read ? <View style={[styles.dot, { backgroundColor: Colors.primary }]} /> : null}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Notifications{unreadCount > 0 ? ` (${unreadCount})` : ''}
        </Text>
        {unreadCount > 0 ? (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAll}>Mark all read</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  headerTitle: { fontFamily: FontFamily.bold, fontSize: FontSize.xl },
  markAll: { color: Colors.primary, fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  list: { paddingBottom: Spacing.xxl },
  card: { flexDirection: 'row', alignItems: 'flex-start', borderRadius: Radius.card, padding: Spacing.md, marginBottom: Spacing.md },
  icon: { fontSize: FontSize.lg, marginRight: Spacing.md },
  info: { flex: 1 },
  title: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm },
  body: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginTop: 2 },
  time: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: Radius.full, marginLeft: Spacing.sm, marginTop: 4 },
});

export default NotificationsScreen;
