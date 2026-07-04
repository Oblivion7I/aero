import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';

const FeedbackScreen: React.FC = () => {
  const { theme } = useAppTheme();
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!message.trim()) return;
    // TODO: send to a feedback endpoint / Firestore collection.
    Alert.alert('Thank you', 'Your feedback has been submitted.');
    setMessage('');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Send Feedback</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Tell us what's working well or what could be better.
      </Text>
      <TextInput
        style={[styles.textArea, { color: theme.text, borderColor: theme.border, backgroundColor: theme.surface }]}
        value={message}
        onChangeText={setMessage}
        placeholder="Type your feedback here..."
        placeholderTextColor={theme.textSecondary}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.xl },
  title: { fontFamily: FontFamily.bold, fontSize: FontSize.xxl, marginBottom: Spacing.xs },
  subtitle: { fontFamily: FontFamily.regular, fontSize: FontSize.sm, marginBottom: Spacing.lg },
  textArea: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: Spacing.md,
    minHeight: 140,
    textAlignVertical: 'top',
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    marginBottom: Spacing.lg,
  },
  button: { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingVertical: Spacing.md, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontFamily: FontFamily.semiBold, fontSize: FontSize.base },
});

export default FeedbackScreen;
