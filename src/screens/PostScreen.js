import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { colors, shadow } from '../../src/theme';
import { apiGet, apiPost } from '../api/client';
import * as ImagePicker from 'expo-image-picker';

export default function PostScreen() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [postType, setPostType] = useState('text'); // 'text', 'photo', 'alert'

  // Demo posts data
  const demoPosts = [
    {
      _id: '1',
      content: 'Just harvested my corn crop! Yield looks better than expected this season. 🌽',
      author: { name: 'John Farmer', avatar: 'https://placekitten.com/50/50' },
      type: 'text',
      likes: 12,
      comments: 5,
      timestamp: '2024-01-15T10:30:00Z',
      image: null
    },
    {
      _id: '2',
      content: 'New chicks arrived today! They look healthy and active. 🐥',
      author: { name: 'Sarah Agriculture', avatar: 'https://placekitten.com/51/51' },
      type: 'photo',
      likes: 24,
      comments: 8,
      timestamp: '2024-01-14T15:20:00Z',
      image: 'https://placekitten.com/300/200'
    },
    {
      _id: '3',
      content: '⚠️ IMPORTANT: Livestock disease alert in neighboring county. Increase biosecurity measures.',
      author: { name: 'Farm Safety Board', avatar: 'https://placekitten.com/52/52' },
      type: 'alert',
      likes: 45,
      comments: 15,
      timestamp: '2024-01-14T09:15:00Z',
      image: null
    },
    {
      _id: '4',
      content: 'Market prices for wheat are rising. Good time to consider selling stored grain.',
      author: { name: 'Mike Trader', avatar: 'https://placekitten.com/53/53' },
      type: 'text',
      likes: 18,
      comments: 7,
      timestamp: '2024-01-13T14:45:00Z',
      image: null
    }
  ];

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    setRefreshing(true);
    // Simulate API call with demo data
    setTimeout(() => {
      apiGet('/api/posts')
        .then((data) => {
          setPosts(data && data.length > 0 ? data : demoPosts);
        })
        .catch(() => {
          setPosts(demoPosts);
        })
        .finally(() => {
          setRefreshing(false);
        });
    }, 1000);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const submitPost = async () => {
    if (!text.trim() && !selectedImage) {
      Alert.alert('Empty Post', 'Please add some text or an image to your post.');
      return;
    }

    setLoading(true);
    
    try {
      const postData = {
        content: text.trim(),
        type: postType,
        image: selectedImage,
        timestamp: new Date().toISOString()
      };

      // Simulate API call
      const created = await apiPost('/api/posts', postData);
      
      if (created) {
        const newPost = {
          ...created,
          _id: Date.now().toString(),
          author: { name: 'You', avatar: 'https://placekitten.com/54/54' },
          likes: 0,
          comments: 0,
          timestamp: new Date().toISOString()
        };
        
        setPosts(prev => [newPost, ...prev]);
        setText('');
        setSelectedImage(null);
        setPostType('text');
        setModalVisible(false);
        Alert.alert('Success', 'Your post has been published!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to publish post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const likePost = (postId) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post._id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const renderPostItem = ({ item }) => (
    <View style={[
      styles.card,
      item.type === 'alert' && styles.alertCard
    ]}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.author.avatar }} style={styles.avatar} />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{item.author.name}</Text>
          <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
        </View>
        <View style={[styles.typeBadge, item.type === 'alert' && styles.alertBadge]}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
      </View>

      {item.image && (
        <Image source={{ uri: item.image }} style={styles.postImage} />
      )}

      <Text style={[
        styles.content,
        item.type === 'alert' && styles.alertText
      ]}>{item.content}</Text>

      <View style={styles.postFooter}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => likePost(item._id)}
        >
          <Text style={styles.actionIcon}>❤️</Text>
          <Text style={styles.actionCount}>{item.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionCount}>{item.comments}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>🔄</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Create Post Button */}
      <TouchableOpacity 
        style={styles.createPostButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.createPostText}>+ Create Post</Text>
      </TouchableOpacity>

      {/* Posts List */}
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={renderPostItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadPosts}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyTitle}>No Posts Yet</Text>
            <Text style={styles.emptyText}>Be the first to share an update!</Text>
          </View>
        }
      />

      {/* Create Post Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create Post</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                {/* Post Type Selection */}
                <View style={styles.typeSelector}>
                  <Text style={styles.selectorLabel}>Post Type:</Text>
                  <View style={styles.typeButtons}>
                    {['text', 'photo', 'alert'].map(type => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.typeButton,
                          postType === type && styles.typeButtonActive
                        ]}
                        onPress={() => setPostType(type)}
                      >
                        <Text style={[
                          styles.typeButtonText,
                          postType === type && styles.typeButtonTextActive
                        ]}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Text Input */}
                <TextInput
                  style={[
                    styles.modalInput,
                    postType === 'alert' && styles.alertInput
                  ]}
                  placeholder={
                    postType === 'alert' 
                      ? 'Share important alert or warning...' 
                      : 'What would you like to share?'
                  }
                  placeholderTextColor="#999"
                  value={text}
                  onChangeText={setText}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                {/* Image Preview */}
                {selectedImage && (
                  <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                    <TouchableOpacity 
                      style={styles.removeImageButton}
                      onPress={() => setSelectedImage(null)}
                    >
                      <Text style={styles.removeImageText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                    <Text style={styles.imageButtonText}>📷 Photo Library</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                    <Text style={styles.imageButtonText}>📸 Take Photo</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>

              {/* Submit Button */}
              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  (!text.trim() && !selectedImage) && styles.submitButtonDisabled
                ]}
                onPress={submitPost}
                disabled={!text.trim() && !selectedImage || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {postType === 'alert' ? 'Publish Alert' : 'Publish Post'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  createPostButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    width: '40%',
    marginHorizontal: 'auto',
    alignItems: 'center',
    marginVertical: 30,
    ...shadow.card,
  },
  createPostText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...shadow.card,
  },
  alertCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF4444',
    backgroundColor: '#FFF5F5',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontWeight: '700',
    fontSize: 16,
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  typeBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  alertBadge: {
    backgroundColor: '#FFEBEE',
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'uppercase',
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
    marginBottom: 12,
  },
  alertText: {
    color: '#D32F2F',
    fontWeight: '600',
  },
  postFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  actionCount: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    fontSize: 20,
    color: colors.textMuted,
  },
  modalBody: {
    padding: 20,
  },
  typeSelector: {
    marginBottom: 16,
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  typeButtonTextActive: {
    color: '#FFFFFF',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
    backgroundColor: colors.surface,
  },
  alertInput: {
    borderColor: '#FF4444',
    backgroundColor: '#FFF5F5',
  },
  imagePreviewContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  imageButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  imageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  submitButtonDisabled: {
    backgroundColor: colors.textMuted,
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});