import React from 'react';
import { FlatList, StyleSheet, Switch, Text, View } from 'react-native';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';
import { useSecurityCenter } from '@hooks/useSecurityCenter';
import { PermissionGrant } from '@models/Security';

const PermissionCenterScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const { permissions, togglePermission } = useSecurityCenter();

  const renderItem = ({ item }: { item: PermissionGrant }) => (
    <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>{item.title}</Text>
        <Switch
          value={item.granted}
          onValueChange={() => togglePermission(item.id)}
          trackColor={{ false: theme.border, true: Colors.primary }}
        />
      </View>
      <Text style={[styles.cardWhy, { color: theme.textSecondary }]}>{item.why}</Text>
      <Text style={[styles.cardFeatures, { color: item.granted ? Colors.primary : theme.textSecondary }]}>
        {item.granted ? 'Enables' : 'Disabled — would enable'}: {item.enabledFeatures}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.hint, { color: theme.textSecondary }]}>
        Revoke any permission at any time. Features that depend on it will be disabled until you
        grant it again.
      </Text>
      <FlatList
        data={permissions}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.xl },
  hint: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginBottom: Spacing.lg, lineHeight: 18 },
  list: { paddingBottom: Spacing.xxl },
  card: { borderRadius: Radius.card, padding: Spacing.md, marginBottom: Spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
  cardWhy: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, marginTop: Spacing.xs, lineHeight: 19 },
  cardFeatures: { fontFamily: FontFamily.medium, fontSize: FontSize.xs, marginTop: Spacing.sm },
});

export default PermissionCenterScreen;
