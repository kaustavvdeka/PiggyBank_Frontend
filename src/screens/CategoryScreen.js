import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CategoryScreen() {
  const navigation = useNavigation();
  const animals = ['Pig', 'Dog', 'Cock', 'Duck', 'Cow', 'Goat'];
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Animal</Text>
      <View style={styles.grid}>
        {animals.map((a) => (
          <TouchableOpacity
            key={a}
            style={styles.animalBtn}
            onPress={() => navigation.navigate('Profile', { animal: a })}
          >
            <Text style={{ fontWeight: '600' }}>{a}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  animalBtn: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
});
