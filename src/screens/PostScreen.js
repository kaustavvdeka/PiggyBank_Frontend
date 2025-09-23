import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { colors, shadow } from '../../src/theme';
import { apiGet, apiPost } from '../api/client';

export default function PostScreen() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    apiGet('/api/posts')
      .then(setPosts)
      .catch(() => {});
  }, []);

  const submit = async () => {
    if (!text) return;
    const created = await apiPost('/api/posts', { content: text }).catch(
      () => null,
    );
    if (created) setPosts((prev) => [created, ...prev]);
    setText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          placeholder="Share an update"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.postBtn} onPress={submit}>
          <Text style={{ color: '#fff' }}>Post</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={{ fontWeight: '600' }}>
              {item.author?.name || 'Anonymous'}
            </Text>
            <Text>{item.content}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  composer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 8,
  },
  postBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  card: {
    margin: 12,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 12,
    ...shadow.card,
  },
});
