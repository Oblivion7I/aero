import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@navigation/types';
import { useAppTheme } from '@context/ThemeContext';
import { FontFamily, FontSize, Radius, Spacing } from '@constants/typography';
import { Colors } from '@constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    title: 'Protect every device',
    body: 'Track battery, storage, and security status for all your devices in one place.',
  },
  {
    title: 'You stay in control',
    body: 'Aero only manages a device after you explicitly verify ownership and grant permissions.',
  },
  {
    title: 'Recover what matters',
    body: 'Lost Mode, location history, and emergency tools — ready when you need them.',
  },
];

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useAppTheme();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(newIndex);
  };

  const handleNext = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      navigation.replace('Login');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={item => item.title}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={[styles.iconPlaceholder, { backgroundColor: Colors.secondary + '22' }]} />
            <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
            <Text style={[styles.body, { color: theme.textSecondary }]}>{item.body}</Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {SLIDES.map((slide, i) => (
          <View
            key={slide.title}
            style={[
              styles.dot,
              { backgroundColor: i === index ? Colors.primary : theme.border },
            ]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.85}>
        <Text style={styles.buttonText}>{index === SLIDES.length - 1 ? 'Get Started' : 'Next'}</Text>
      </TouchableOpacity>

      {index < SLIDES.length - 1 && (
        <TouchableOpacity onPress={() => navigation.replace('Login')} style={styles.skip}>
          <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: { alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  iconPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: Radius.card,
    marginBottom: Spacing.xl,
  },
  title: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xxl,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  body: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    textAlign: 'center',
    lineHeight: 22,
  },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: Spacing.lg },
  dot: { width: 8, height: 8, borderRadius: Radius.full, marginHorizontal: 4 },
  button: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
  },
  skip: { alignItems: 'center', marginVertical: Spacing.lg },
  skipText: { fontFamily: FontFamily.medium, fontSize: FontSize.sm },
});

export default OnboardingScreen;
