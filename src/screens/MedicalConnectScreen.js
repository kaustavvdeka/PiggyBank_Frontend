import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
} from 'react-native';
import { apiGet } from '../api/client';
import { colors, shadow } from '../../src/theme';

export default function MedicalConnectScreen() {
  const [tab, setTab] = useState('nearby');
  const [items, setItems] = useState([]);
  useEffect(() => {
    const path =
      tab === 'nearby' ? '/api/doctors/nearby' : '/api/doctors/online';
    apiGet(path)
      .then(setItems)
      .catch(() => {});
  }, [tab]);
  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setTab('nearby')}
          style={[styles.tabBtn, tab === 'nearby' && styles.active]}
        >
          <Text style={styles.tabTxt}>Nearby</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab('online')}
          style={[styles.tabBtn, tab === 'online' && styles.active]}
        >
          <Text style={styles.tabTxt}>Online</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={items}
        keyExtractor={(it) => it._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            {!!item.specialization && (
              <Text style={styles.meta}>{item.specialization}</Text>
            )}
            {!!item.clinicName && (
              <Text style={styles.meta}>{item.clinicName}</Text>
            )}
            <View style={styles.row}>
              {!!item.phone && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${item.phone}`)}
                  style={styles.action}
                >
                  <Text style={styles.actionTxt}>Call</Text>
                </TouchableOpacity>
              )}
              {!!item.email && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`mailto:${item.email}`)}
                  style={styles.action}
                >
                  <Text style={styles.actionTxt}>Email</Text>
                </TouchableOpacity>
              )}
              {Array.isArray(item.consultationLinks) &&
                item.consultationLinks[0] && (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(item.consultationLinks[0])}
                    style={styles.action}
                  >
                    <Text style={styles.actionTxt}>Consult</Text>
                  </TouchableOpacity>
                )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  tabs: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
  },
  active: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  tabTxt: { color: colors.text },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    ...shadow.card,
  },
  name: { fontWeight: '700', color: colors.text },
  meta: { color: colors.textMuted, marginTop: 2 },
  row: { flexDirection: 'row', gap: 10, marginTop: 10 },
  action: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionTxt: { color: colors.secondary, fontWeight: '600' },
});
