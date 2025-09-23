import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { colors, shadow } from '../../src/theme';
import { apiGet } from '../api/client';

export default function NotificationsScreen() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    apiGet('/api/map/alerts')
      .then((res) => setItems(res.notifications || []))
      .catch(() => {});
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(it, idx) => String(idx)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={{ fontWeight: '700', color: colors.text }}>
              {item.title}
            </Text>
            <Text style={{ color: colors.textMuted }}>{item.body}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  card: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    ...shadow.card,
  },
});
