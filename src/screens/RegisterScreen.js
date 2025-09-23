import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { colors } from '../../src/theme';
import { apiPost } from '../api/client';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('Demo Farmer');
  const [email, setEmail] = useState(
    'demo+' + Math.floor(Math.random() * 1000) + '@piggybank.app',
  );
  const [password, setPassword] = useState('demo1234');
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity
        style={styles.btn}
        onPress={async () => {
          try {
            await apiPost('/api/auth/register', { name, email, password });
            Alert.alert('Registered', 'You can login now');
            navigation.navigate('Login');
          } catch (e) {
            Alert.alert('Error', 'Registration failed');
          }
        }}
      >
        <Text style={styles.btnTxt}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnTxt: { color: colors.secondary, fontWeight: '700' },
});
