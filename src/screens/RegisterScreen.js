import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
} from 'react-native';
import { colors } from '../../src/theme';
import { apiPost } from '../api/client';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Text } from 'react-native-paper';

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
        label="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
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
      <Button
        mode="contained"
        style={styles.button}
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
        Register
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
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 12,
  },
});
