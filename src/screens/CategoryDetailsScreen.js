import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  FlatList,
  Image,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

export default function CategoryDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { animal } = route.params;
  
  const [activeTab, setActiveTab] = useState('grooming');
  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    postType: 'grooming',
    price: '',
    contactInfo: { phone: '', email: '', location: '' }
  });

  const tabs = [
    { id: 'grooming', name: 'Grooming', icon: '✂️' },
    { id: 'sale', name: 'For Sale', icon: '💰' },
    { id: 'health', name: 'Health', icon: '🩺' },
    { id: 'general', name: 'General', icon: '📝' }
  ];

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`http://your-api/posts/${animal}/${activeTab}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [animal, activeTab]);

  const handleCreatePost = async () => {
    try {
      const response = await fetch('http://your-api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}` // Add authentication
        },
        body: JSON.stringify({
          ...newPost,
          category: animal.toLowerCase(),
          price: activeTab === 'sale' ? parseFloat(newPost.price) : undefined
        })
      });

      if (response.ok) {
        setModalVisible(false);
        setNewPost({
          title: '',
          content: '',
          postType: 'grooming',
          price: '',
          contactInfo: { phone: '', email: '', location: '' }
        });
        fetchPosts(); // Refresh posts
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
    }
  };

  const renderPostItem = ({ item }) => (
    <View style={styles.postCard}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent}>{item.content}</Text>
      
      {item.postType === 'sale' && item.price && (
        <Text style={styles.postPrice}>Price: ${item.price}</Text>
      )}
      
      {item.contactInfo && (
        <View style={styles.contactInfo}>
          <Text style={styles.contactText}>{item.contactInfo.phone}</Text>
          <Text style={styles.contactText}>{item.contactInfo.location}</Text>
        </View>
      )}
      
      <Text style={styles.postDate}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{animal} Care</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Category Info */}
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryIcon}>{getAnimalIcon(animal)}</Text>
        <View style={styles.categoryText}>
          <Text style={styles.categoryName}>{animal}</Text>
          <Text style={styles.categoryDescription}>
            Explore {animal} grooming, sales, health tips and more
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Posts List */}
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item._id}
        style={styles.postsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubtext}>Be the first to share something!</Text>
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
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Post</Text>
            
            <Picker
              selectedValue={newPost.postType}
              onValueChange={(value) => setNewPost({...newPost, postType: value})}
              style={styles.picker}
            >
              <Picker.Item label="Grooming" value="grooming" />
              <Picker.Item label="For Sale" value="sale" />
              <Picker.Item label="Health" value="health" />
              <Picker.Item label="General" value="general" />
            </Picker>

            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newPost.title}
              onChangeText={(text) => setNewPost({...newPost, title: text})}
            />

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Content"
              multiline
              numberOfLines={4}
              value={newPost.content}
              onChangeText={(text) => setNewPost({...newPost, content: text})}
            />

            {newPost.postType === 'sale' && (
              <TextInput
                style={styles.input}
                placeholder="Price"
                keyboardType="numeric"
                value={newPost.price}
                onChangeText={(text) => setNewPost({...newPost, price: text})}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={newPost.contactInfo.phone}
              onChangeText={(text) => setNewPost({
                ...newPost, 
                contactInfo: {...newPost.contactInfo, phone: text}
              })}
            />

            <TextInput
              style={styles.input}
              placeholder="Location"
              value={newPost.contactInfo.location}
              onChangeText={(text) => setNewPost({
                ...newPost, 
                contactInfo: {...newPost.contactInfo, location: text}
              })}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleCreatePost}
              >
                <Text style={styles.submitButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Helper function to get animal icon
const getAnimalIcon = (animal) => {
  const icons = {
    'Pig': '🐷', 'Dog': '🐶', 'Cock': '🐔', 'Duck': '🦆',
    'Cow': '🐮', 'Goat': '🐐', 'Sheep': '🐑', 'Horse': '🐴', 'Rabbit': '🐰'
  };
  return icons[animal] || '🐾';
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: { padding: 8 },
  backIcon: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  addButton: { padding: 8 },
  addIcon: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: { fontSize: 40, marginRight: 15 },
  categoryName: { fontSize: 20, fontWeight: '700', color: '#333' },
  categoryDescription: { fontSize: 14, color: '#666', marginTop: 4 },
  
  tabContainer: { marginHorizontal: 20, marginBottom: 15 },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activeTab: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  tabIcon: { fontSize: 16, marginRight: 5 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#666' },
  activeTabText: { color: '#fff' },
  
  postsList: { flex: 1, marginHorizontal: 20 },
  postCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 5 },
  postContent: { fontSize: 14, color: '#666', marginBottom: 10 },
  postPrice: { fontSize: 16, fontWeight: '600', color: '#E91E63', marginBottom: 5 },
  contactInfo: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  contactText: { fontSize: 12, color: '#888' },
  postDate: { fontSize: 11, color: '#999', marginTop: 10 },
  
  emptyState: { alignItems: 'center', padding: 40 },
  emptyText: { fontSize: 16, color: '#666', marginBottom: 5 },
  emptySubtext: { fontSize: 14, color: '#999' },
  
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.5)' 
  },
  modalContent: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 20, 
    width: '90%', 
    maxHeight: '80%' 
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
  input: { 
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 10 
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  picker: { marginBottom: 10, borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  modalButton: { padding: 12, borderRadius: 8, flex: 1, marginHorizontal: 5 },
  cancelButton: { backgroundColor: '#F0F0F0' },
  submitButton: { backgroundColor: '#4A90E2' },
  cancelButtonText: { textAlign: 'center', color: '#666' },
  submitButtonText: { textAlign: 'center', color: '#fff' }
});