import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../src/theme';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { loginDemo } = useAuth();
  const navigation = useNavigation();
  const [email, setEmail] = useState('demo@piggybank.app');
  const [password, setPassword] = useState('demo1234');
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to PiggyBank</Text>
      <Text style={styles.subtitle}>
        Login with demo credentials or proceed to register.
      </Text>
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
      <TouchableOpacity style={styles.loginBtn} onPress={loginDemo}>
        <Text style={styles.loginTxt}>Login (Demo)</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Create an account</Text>
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
    marginBottom: 8,
  },
  subtitle: { color: colors.textMuted, marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  loginBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  loginTxt: { color: colors.secondary, fontWeight: '700' },
  link: {
    color: colors.primary,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '600',
  },
});
