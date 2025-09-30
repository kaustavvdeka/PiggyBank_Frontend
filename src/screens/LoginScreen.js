import React, { useState } from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../src/theme';
import { useAuth } from '../context/AuthContext';
import { TextInput, Button, Text } from 'react-native-paper';

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
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={loginDemo} style={styles.button}>
        Login (Demo)
      </Button>
      <Button mode="text" onPress={() => navigation.navigate('Register')} style={styles.button}>
        Create an account
      </Button>
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
    marginBottom: 12,
  },
  button: {
    marginTop: 12,
  },
});
