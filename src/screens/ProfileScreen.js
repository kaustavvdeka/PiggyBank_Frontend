import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { apiGet } from '../api/client';
import { colors } from '../../src/theme';

export default function ProfileScreen({ route }) {
  const animal = route?.params?.animal || 'Pig';
  const [streak, setStreak] = useState([]);
  useEffect(() => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 6);
    const d = weekStart.toISOString().slice(0, 10);
    apiGet(
      `/api/tasks/streaks?animal=${encodeURIComponent(animal)}&weekStart=${d}`,
    )
      .then(setStreak)
      .catch(() => {});
  }, [animal]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={{ marginBottom: 8, color: colors.text }}>
        Streak for {animal}
      </Text>
      <View style={styles.streakRow}>
        {[...Array(7)].map((_, i) => {
          const day = new Date();
          day.setDate(day.getDate() - (6 - i));
          const key = day.toISOString().slice(0, 10);
          const done = streak.some((t) => t.date === key);
          return (
            <View key={i} style={[styles.streakDot, done && styles.streakOn]} />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: colors.text,
  },
  streakRow: { flexDirection: 'row', gap: 6 },
  streakDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#eee',
  },
  streakOn: { backgroundColor: colors.primary },
});
