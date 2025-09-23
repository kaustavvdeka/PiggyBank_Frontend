import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { colors, shadow } from '../../src/theme';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text
          style={styles.icon}
          onPress={() => navigation.navigate('Notifications')}
        >
          🔔
        </Text>
        <View style={styles.profileWrap}>
          <Image
            source={{ uri: 'https://placekitten.com/100/100' }}
            style={styles.avatar}
          />
          <Text style={styles.username}>Hello, Farmer</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text
            style={styles.icon}
            onPress={() => navigation.navigate('Messages')}
          >
            💬
          </Text>
          <Text
            style={styles.icon}
            onPress={() => navigation.navigate('MedicalConnect')}
          >
            🩺
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categories}>
          {['Veterinary', 'Grooming', 'Core Product'].map((c) => (
            <TouchableOpacity
              key={c}
              style={styles.categoryBtn}
              onPress={() => navigation.navigate('Category', { category: c })}
            >
              <Text style={styles.categoryText}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Nearby Posts</Text>
        <View style={styles.card}>
          <Text>Local disease update...</Text>
        </View>
        <View style={styles.card}>
          <Text>Lost & found chicken...</Text>
        </View>

        <Text style={styles.sectionTitle}>Tips</Text>
        <View style={styles.card}>
          <Text>Feed information and webinar schedule</Text>
        </View>

        <Text style={styles.sectionTitle}>Medical Connect</Text>
        <TouchableOpacity
          style={[styles.categoryBtn, { paddingVertical: 16 }]}
          onPress={() => navigation.navigate('MedicalConnect')}
        >
          <Text style={[styles.categoryText, { fontSize: 16 }]}>
            Find Doctors (Nearby / Online)
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          fetch('http://localhost:4000/api/chatbot/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Hello AI' }),
          })
            .then((r) => r.json())
            .then(() => {})
            .catch(() => {})
        }
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>AI</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  icon: { fontSize: 20 },
  profileWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },
  username: { fontWeight: '600', color: colors.text },
  content: { padding: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
    color: colors.text,
  },
  categories: { flexDirection: 'row', gap: 12 },
  categoryBtn: {
    backgroundColor: colors.primarySoft,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  categoryText: { fontWeight: '600', color: colors.primary },
  card: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    ...shadow.card,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 40,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.fab,
  },
});
