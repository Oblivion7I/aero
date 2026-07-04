import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Shadow, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';
import { useEmergency } from '@hooks/useEmergency';

const EmergencyScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const { medicalInfo, updateField, emergencyContacts, triggerSOS } = useEmergency();

  const confirmSOS = () => {
    Alert.alert(
      'Send SOS?',
      'This will contact your emergency contacts and share your last known location.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send SOS', style: 'destructive', onPress: triggerSOS },
      ],
    );
  };

  return (
    <ScrollView style={{ backgroundColor: theme.background }} contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.sosButton} onPress={confirmSOS} activeOpacity={0.85}>
        <Text style={styles.sosText}>SOS</Text>
        <Text style={styles.sosSub}>Tap to alert emergency contacts</Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Emergency Contacts</Text>
      <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
        {emergencyContacts.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No emergency contacts set. Add them in Trusted Contacts.
          </Text>
        ) : (
          emergencyContacts.map(c => (
            <View key={c.id} style={styles.contactRow}>
              <Text style={[styles.contactName, { color: theme.text }]}>{c.name}</Text>
              <Text style={[styles.contactPhone, { color: theme.textSecondary }]}>{c.phone}</Text>
            </View>
          ))
        )}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Medical Information</Text>
      <View style={[styles.card, { backgroundColor: theme.surface }, Shadow.soft]}>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          placeholder="Blood group"
          placeholderTextColor={theme.textSecondary}
          value={medicalInfo.bloodGroup}
          onChangeText={t => updateField('bloodGroup', t)}
        />
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          placeholder="Allergies"
          placeholderTextColor={theme.textSecondary}
          value={medicalInfo.allergies}
          onChangeText={t => updateField('allergies', t)}
        />
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          placeholder="Existing conditions"
          placeholderTextColor={theme.textSecondary}
          value={medicalInfo.conditions}
          onChangeText={t => updateField('conditions', t)}
        />
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          placeholder="Current medications"
          placeholderTextColor={theme.textSecondary}
          value={medicalInfo.medications}
          onChangeText={t => updateField('medications', t)}
        />
        <TextInput
          style={[styles.textArea, { color: theme.text, borderColor: theme.border }]}
          placeholder="Additional notes for first responders"
          placeholderTextColor={theme.textSecondary}
          value={medicalInfo.notes}
          onChangeText={t => updateField('notes', t)}
          multiline
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  sosButton: {
    backgroundColor: Colors.danger,
    borderRadius: Radius.card,
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sosText: { color: '#FFFFFF', fontFamily: FontFamily.bold, fontSize: FontSize.display },
  sosSub: { color: '#FFFFFFDD', fontFamily: FontFamily.regular, fontSize: FontSize.sm, marginTop: Spacing.xs },
  sectionTitle: { fontFamily: FontFamily.semiBold, fontSize: FontSize.lg, marginBottom: Spacing.sm, marginTop: Spacing.md },
  card: { borderRadius: Radius.card, padding: Spacing.md, marginBottom: Spacing.md },
  emptyText: { fontFamily: FontFamily.regular, fontSize: FontSize.sm },
  contactRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.xs },
  contactName: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
  contactPhone: { fontFamily: FontFamily.regular, fontSize: FontSize.sm },
  input: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    marginBottom: Spacing.sm,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    minHeight: 70,
    textAlignVertical: 'top',
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
  },
});

export default EmergencyScreen;
