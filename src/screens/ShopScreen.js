import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { colors, shadow } from '../../src/theme';
import { apiGet } from '../api/client';

export default function ShopScreen() {
  const [mode, setMode] = useState('buyer');
  const [products, setProducts] = useState([]);
  useEffect(() => {
    apiGet('/api/shop/products')
      .then(setProducts)
      .catch(() => {});
  }, [mode]);
  return (
    <View style={styles.container}>
      <View style={styles.switchRow}>
        <TouchableOpacity
          onPress={() => setMode('buyer')}
          style={[styles.modeBtn, mode === 'buyer' && styles.modeActive]}
        >
          <Text>Buyer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMode('seller')}
          style={[styles.modeBtn, mode === 'seller' && styles.modeActive]}
        >
          <Text>Seller</Text>
        </TouchableOpacity>
      </View>
      {mode === 'buyer' ? (
        <FlatList
          data={products}
          keyExtractor={(it) => it._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={{ fontWeight: '600' }}>{item.title}</Text>
              <Text>${item.price}</Text>
            </View>
          )}
        />
      ) : (
        <Text>List products and animals</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  switchRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  modeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
  },
  modeActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  card: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    ...shadow.card,
  },
});
