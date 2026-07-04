import React, { useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';
import { useSecurityCenter } from '@hooks/useSecurityCenter';
import { useNotifications } from '@hooks/useNotifications';
import { Colors } from '@constants/colors';

interface TimelineItem {
  id: string;
  title: string;
  time: string;
  source: 'security' | 'notification';
}

const ActivityTimelineScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const { events } = useSecurityCenter();
  const { notifications } = useNotifications();

  const items: TimelineItem[] = useMemo(() => {
    const fromEvents: TimelineItem[] = events.map(e => ({
      id: `evt-${e.id}`,
      title: e.description,
      time: e.occurredAt,
      source: 'security',
    }));
    const fromNotifications: TimelineItem[] = notifications.map(n => ({
      id: `notif-${n.id}`,
      title: n.title,
      time: n.occurredAt,
      source: 'notification',
    }));
    return [...fromEvents, ...fromNotifications].sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
    );
  }, [events, notifications]);

  const renderItem = ({ item }: { item: TimelineItem }) => (
    <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
      <View
        style={[
          styles.tag,
          { backgroundColor: (item.source === 'security' ? Colors.warning : Colors.primary) + '1A' },
        ]}>
        <Text
          style={[
            styles.tagText,
            { color: item.source === 'security' ? Colors.warning : Colors.primary },
          ]}>
          {item.source === 'security' ? 'Security' : 'Device'}
        </Text>
      </View>
      <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
      <Text style={[styles.time, { color: theme.textSecondary }]}>
        {new Date(item.time).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={items}
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
  tag: { alignSelf: 'flex-start', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.full, marginBottom: Spacing.xs },
  tagText: { fontFamily: FontFamily.medium, fontSize: FontSize.xs },
  title: { fontFamily: FontFamily.semiBold, fontSize: FontSize.sm },
  time: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginTop: 2 },
});

export default ActivityTimelineScreen;
