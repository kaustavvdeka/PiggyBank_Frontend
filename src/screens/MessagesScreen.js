import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { colors } from '../../src/theme';
import io from 'socket.io-client';
import { apiGet, apiPost, API_BASE_URL } from '../api/client';

export default function MessagesScreen() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [socket, setSocket] = useState(null);
  const me = 'demo-user-id';
  const peer = 'demo-peer-id';

  useEffect(() => {
    const s = io(API_BASE_URL, { transports: ['websocket'] });
    s.on('connect', () => s.emit('join', me));
    s.on('message', (payload) => {
      setMessages((prev) => [
        ...prev,
        {
          from: payload.fromUserId || peer,
          content: payload.message,
          ts: payload.ts,
        },
      ]);
    });
    setSocket(s);
    return () => s.disconnect();
  }, []);

  useEffect(() => {
    apiGet(`/api/messages/with/${peer}`)
      .then(setMessages)
      .catch(() => {});
  }, []);

  const send = async () => {
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { from: me, content: text, ts: Date.now() },
    ]);
    socket?.emit('message', { toUserId: peer, message: text, fromUserId: me });
    await apiPost('/api/messages', { to: peer, content: text }).catch(() => {});
    setText('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item, idx) => String(idx)}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.from === me ? styles.mine : styles.theirs,
            ]}
          >
            <Text>{item.content}</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
      <View style={styles.composer}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
          style={styles.input}
        />
        <TouchableOpacity onPress={send} style={styles.sendBtn}>
          <Text style={{ color: '#fff' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  bubble: { padding: 10, borderRadius: 8, marginVertical: 6, maxWidth: '70%' },
  mine: { backgroundColor: '#d1f7c4', alignSelf: 'flex-end' },
  theirs: { backgroundColor: colors.surface, alignSelf: 'flex-start' },
  composer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
});
