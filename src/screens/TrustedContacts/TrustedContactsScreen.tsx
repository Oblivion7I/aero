import React, { useState } from 'react';
import { FlatList, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';
import { useTrustedContacts } from '@hooks/useTrustedContacts';
import { TrustedContact } from '@models/TrustedContacts';

const TrustedContactsScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const { contacts, addContact, removeContact, toggleField } = useTrustedContacts();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleAdd = () => {
    if (!name.trim() || !phone.trim()) return;
    addContact({ name: name.trim(), phone: phone.trim(), relationship: 'Contact', isEmergencyContact: false, canViewLocation: false });
    setName('');
    setPhone('');
  };

  const renderItem = ({ item }: { item: TrustedContact }) => (
    <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
          <Text style={[styles.meta, { color: theme.textSecondary }]}>{item.relationship} · {item.phone}</Text>
        </View>
        <TouchableOpacity onPress={() => removeContact(item.id)}>
          <Text style={styles.remove}>Remove</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.toggleRow}>
        <Text style={[styles.toggleLabel, { color: theme.text }]}>Emergency contact</Text>
        <Switch value={item.isEmergencyContact} onValueChange={() => toggleField(item.id, 'isEmergencyContact')} trackColor={{ false: theme.border, true: Colors.primary }} />
      </View>
      <View style={styles.toggleRow}>
        <Text style={[styles.toggleLabel, { color: theme.text }]}>Can view location</Text>
        <Switch value={item.canViewLocation} onValueChange={() => toggleField(item.id, 'canViewLocation')} trackColor={{ false: theme.border, true: Colors.primary }} />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.addRow}>
        <TextInput style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]} placeholder="Name" placeholderTextColor={theme.textSecondary} value={name} onChangeText={setName} />
        <TextInput style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]} placeholder="Phone" placeholderTextColor={theme.textSecondary} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd} activeOpacity={0.85}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList data={contacts} keyExtractor={item => item.id} renderItem={renderItem} contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={[styles.empty, { color: theme.textSecondary }]}>No trusted contacts yet.</Text>} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.xl },
  addRow: { marginBottom: Spacing.lg },
  input: { borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, fontFamily: FontFamily.regular, fontSize: FontSize.sm, marginBottom: Spacing.sm },
  addButton: { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: Spacing.sm, alignItems: 'center' },
  addButtonText: { color: '#FFFFFF', fontFamily: FontFamily.semiBold, fontSize: FontSize.sm },
  list: { paddingBottom: Spacing.xxl },
  card: { borderRadius: Radius.card, padding: Spacing.md, marginBottom: Spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  name: { fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
  meta: { fontFamily: FontFamily.regular, fontSize: FontSize.xs, marginTop: 2 },
  remove: { color: Colors.danger, fontFamily: FontFamily.medium, fontSize: FontSize.xs },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  toggleLabel: { fontFamily: FontFamily.regular, fontSize: FontSize.sm },
  empty: { textAlign: 'center', fontFamily: FontFamily.regular, fontSize: FontSize.sm, marginTop: Spacing.xl },
});

export default TrustedContactsScreen;
