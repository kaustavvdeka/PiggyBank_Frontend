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
  
  // Sample data for demonstration
  const nearbyPosts = [
    { id: 1, title: 'Local Disease Update', description: 'Avian flu reported in nearby area', urgent: true },
    { id: 2, title: 'Lost & Found Chicken', description: 'White leghorn found near market', urgent: false },
  ];

  const tips = [
    { id: 1, title: 'Feed Optimization', description: 'Best feeding practices for summer' },
    { id: 2, title: 'Webinar Schedule', description: 'Join our poultry care webinar' },
  ];

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.topBar}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.icon}>🔔</Text>
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.profileWrap}>
          <Image
            source={{ uri: 'https://placekitten.com/100/100' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.username}>Farmer John</Text>
          </View>
        </View>
        
        <View style={styles.headerIcons}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('Messages')}
          >
            <Text style={styles.icon}>💬</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('MedicalConnect')}
          >
            <Text style={styles.icon}>🩺</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Banner */}
        <View style={styles.welcomeBanner}>
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>Welcome Back! 👋</Text>
            <Text style={styles.welcomeSubtitle}>Ready to take care of your poultry today?</Text>
          </View>
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherIcon}>🌤️</Text>
            <Text style={styles.weatherText}>28°C</Text>
          </View>
        </View>

        {/* Categories Section */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categories}>
          {[
            { name: 'Veterinary', icon: '🐔', color: '#FF6B6B' },
            { name: 'Grooming', icon: '✂️', color: '#4ECDC4' },
            { name: 'Core Product', icon: '📦', color: '#45B7D1' }
          ].map((category) => (
            <TouchableOpacity
              key={category.name}
              style={[styles.categoryBtn, { backgroundColor: category.color }]}
              onPress={() => navigation.navigate('Category', { category: category.name })}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Nearby Posts Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Posts</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.postsContainer}>
          {nearbyPosts.map((post) => (
            <View key={post.id} style={[styles.postCard, post.urgent && styles.urgentCard]}>
              <View style={styles.postHeader}>
                <Text style={[styles.postTitle, post.urgent && styles.urgentText]}>
                  {post.title}
                </Text>
                {post.urgent && <Text style={styles.urgentBadge}>URGENT</Text>}
              </View>
              <Text style={styles.postDescription}>{post.description}</Text>
              <Text style={styles.postTime}>2 hours ago</Text>
            </View>
          ))}
        </View>

        {/* Tips Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Tips</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tipsContainer}
        >
          {tips.map((tip) => (
            <View key={tip.id} style={styles.tipCard}>
              <View style={styles.tipIcon}>💡</View>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDescription}>{tip.description}</Text>
              <TouchableOpacity style={styles.readMoreBtn}>
                <Text style={styles.readMoreText}>Read More</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Medical Connect Section */}
        <Text style={styles.sectionTitle}>Medical Connect</Text>
        <TouchableOpacity
          style={styles.medicalCard}
          onPress={() => navigation.navigate('MedicalConnect')}
        >
          <View style={styles.medicalContent}>
            <Text style={styles.medicalIcon}>🩺</Text>
            <View style={styles.medicalText}>
              <Text style={styles.medicalTitle}>Emergency Help</Text>
              <Text style={styles.medicalSubtitle}>Connect with veterinarians instantly</Text>
            </View>
          </View>
          <Text style={styles.medicalArrow}>→</Text>
        </TouchableOpacity>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Healthy Birds</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Pending Tasks</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>Feed Stock</Text>
          </View>
        </View>
      </ScrollView>

      {/* FAB */}
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
        <Text style={styles.fabIcon}>🤖</Text>
        <View style={styles.fabPulse} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  topBar: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadow.card,
  },
  iconButton: {
    padding: 8,
    position: 'relative',
  },
  icon: { 
    fontSize: 22,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF3B30',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileWrap: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  avatar: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    borderWidth: 2,
    borderColor: colors.primary,
  },
  greeting: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  username: { 
    fontWeight: '700', 
    fontSize: 16,
    color: colors.text,
  },
  headerIcons: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 16 
  },
  content: { 
    padding: 20,
    paddingBottom: 100,
  },
  welcomeBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundColor: colors.primary,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    ...shadow.card,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  weatherInfo: {
    alignItems: 'center',
  },
  weatherIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  weatherText: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  seeAllText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  categories: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  categoryBtn: {
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    minWidth: '30%',
    ...shadow.card,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryText: { 
    fontWeight: '600', 
    color: '#fff', 
    textAlign: 'center',
    fontSize: 12,
  },
  postsContainer: {
    gap: 12,
  },
  postCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    ...shadow.card,
  },
  urgentCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  postTitle: {
    fontWeight: '600',
    color: colors.text,
    fontSize: 16,
  },
  urgentText: {
    color: '#FF3B30',
  },
  urgentBadge: {
    backgroundColor: '#FF3B30',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: 10,
    fontWeight: 'bold',
  },
  postDescription: {
    color: colors.textSecondary,
    marginBottom: 8,
  },
  postTime: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  tipsContainer: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  tipCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    width: 200,
    marginRight: 12,
    ...shadow.card,
  },
  tipIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  tipTitle: {
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  tipDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 12,
    flex: 1,
  },
  readMoreBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  medicalCard: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadow.card,
  },
  medicalContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicalIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  medicalText: {
    flex: 1,
  },
  medicalTitle: {
    fontWeight: '700',
    color: colors.text,
    fontSize: 16,
    marginBottom: 4,
  },
  medicalSubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  medicalArrow: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    ...shadow.card,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.fab,
  },
  fabIcon: {
    fontSize: 24,
    color: '#fff',
  },
  fabPulse: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    opacity: 0.4,
    zIndex: -1,
  },
});