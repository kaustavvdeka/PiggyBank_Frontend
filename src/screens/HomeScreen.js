import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { colors, shadow } from '../../src/theme';
import { useNavigation } from '@react-navigation/native';
import { Appbar, Avatar, Badge, Button, Card, Text, Title, Paragraph, FAB, IconButton } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const { width: screenWidth } = Dimensions.get('window');

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

  // DigiLocker Carousel Images
  const digilockerCarousel = [
    {
      id: 1,
      image: 'https://img1.digitallocker.gov.in/digilocker-landing-page/assets/img/banner/promotional-mobile-2.jpg',
      title: 'Drive hassle free with DigiLocker'
    },
    {
      id: 2,
      image: 'https://img1.digitallocker.gov.in/digilocker-landing-page/assets/img/banner/promotional-mobile-4.jpg',
      title: 'Document Wallet for Citizens'
    },
    {
      id: 3,
      image: 'https://img1.digitallocker.gov.in/digilocker-landing-page/assets/img/banner/promotional-mobile-5.jpg',
      title: 'Explore More Documents'
    },
    // {
    //   id: 4,
    //   image: { uri: '../../assets/framepromo.png' },
    //   title: 'Get Started Today'
    // }
    
  ];

  const [activeSlide, setActiveSlide] = React.useState(0);
  const scrollViewRef = useRef(null);


  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prevSlide => {
        const nextSlide = prevSlide === digilockerCarousel.length - 1 ? 0 : prevSlide + 1;
        scrollViewRef.current.scrollTo({
          x: nextSlide * (screenWidth - 20),
          animated: true,
        });
        return nextSlide;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

 
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.topBar}>
        <View style={styles.profileWrap}>
          <Image
            source={{ uri: 'https://avatars.githubusercontent.com/u/196813405?v=4' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.greeting}>Namaste,</Text>
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
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={styles.icon}>🔔</Text>
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* DigiLocker Carousel */}
        
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const slide = Math.round(event.nativeEvent.contentOffset.x / (screenWidth - 40));
              setActiveSlide(slide);
            }}
            scrollEventThrottle={16}
          >
            {digilockerCarousel.map((item) => (
              <View key={item.id} style={styles.carouselSlide}>
                <Image 
                  source={{ uri: item.image }} 
                  style={styles.carouselImage}
                  resizeMode="cover"
                />
               
                {/* <View style={styles.imageOverlay}>
                  <Text style={styles.imageTitle}>{item.title}</Text>
                </View> */}
              </View>
            ))}
          </ScrollView>
          
          {/* Pagination Dots */}
          <View style={styles.pagination}>
            {digilockerCarousel.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activeSlide ? styles.paginationDotActive : styles.paginationDotInactive
                ]}
              />
            ))}
          </View>
        </View>

        {/* Welcome Banner */}
        <Card style={styles.welcomeBanner}>
          <LinearGradient
            colors={[colors.primary, '#4a4ce0ff',]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <Card.Content style={styles.welcomeCardContent}>
              <View>
                <Title style={styles.welcomeTitle}>Welcome Back! 👋</Title>
                <Paragraph style={styles.welcomeSubtitle}>Ready to take care of your poultry today?</Paragraph>
              </View>
              <View style={styles.weatherWidget}>
                <Text style={styles.weatherIcon}>☀️</Text>
                <Text style={styles.weatherTemp}>28°C</Text>
              </View>
            </Card.Content>
          </LinearGradient>
        </Card>

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
          <Button onPress={() => {}}>See All</Button>
        </View>
        <View style={styles.postsContainer}>
          {nearbyPosts.map((post) => (
            <Card key={post.id} style={[styles.postCard, post.urgent && styles.urgentCard]}>
              <Card.Content>
                <Title style={[styles.postTitle, post.urgent && styles.urgentText]}>
                  {post.title}
                </Title>
                <Badge visible={post.urgent} style={styles.urgentBadge}>URGENT</Badge>
                <Paragraph style={styles.postDescription}>{post.description}</Paragraph>
                <Text style={styles.postTime}>2 hours ago</Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Tips Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Daily Tips</Text>
          <Button onPress={() => {}}>See All</Button>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tipsContainer}
        >
          {tips.map((tip) => (
            <Card key={tip.id} style={styles.tipCard}>
              <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
              <Card.Content>
                <Title style={styles.tipTitle}>{tip.title}</Title>
                <Paragraph style={styles.tipDescription}>{tip.description}</Paragraph>
              </Card.Content>
              <Card.Actions>
                <Button>Read More</Button>
              </Card.Actions>
            </Card>
          ))}
        </ScrollView>

        {/* Medical Connect Section */}
        <Text style={styles.sectionTitle}>Medical Connect</Text>
        <Card onPress={() => navigation.navigate('MedicalConnect')}>
          <Card.Title
            title="Emergency Help"
            subtitle="Connect with veterinarians instantly"
            left={(props) => <Avatar.Icon {...props} icon="medical-bag" />}
            right={(props) => <IconButton {...props} icon="arrow-right" onPress={() => navigation.navigate('MedicalConnect')} />}
          />
        </Card>

        {/* Quick Stats */}
        <Card style={styles.statsContainer}>
          <Card.Content style={styles.statsContent}>
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
          </Card.Content>
        </Card>
      </ScrollView>

      {/* FAB */}
      <FAB
        style={styles.fab}
        icon="robot"
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background 
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  
  // Carousel Styles
  carouselContainer: {
    marginBottom: 20,
  },
  carouselSlide: {
    width: screenWidth -40,
    marginRight: 20,
     borderRadius: 12,
    overflow: 'hidden',
    // ...shadow.card,
  },
  carouselImage: {
    width: '100%',
    height: 160,
     borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
    // borderBottomLeftRadius: 16,
    // borderBottomRightRadius: 16,
  },
  imageTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
  paginationDotInactive: {
    backgroundColor: colors.border,
  },

  gradient: {
    borderRadius: 12,
  },

  // Existing styles remain the same
  welcomeBanner: {
    backgroundColor: 'transparent',
    marginBottom: 10,
    
  },
  welcomeCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding:14
  },
  weatherWidget: {
    alignItems: 'center',
  },
  weatherIcon: {
    fontSize: 30,
  },
  weatherTemp: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
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
    borderRadius: 12,
    ...shadow.card,
  },
  urgentCard: {
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
  },
  postTitle: {
    fontWeight: '600',
    color: colors.text,
    fontSize: 16,
  },
  urgentText: {
    color: colors.danger,
  },
  urgentBadge: {
    backgroundColor: colors.danger,
    color: '#fff',
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
    width: 200,
    marginRight: 12,
    ...shadow.card,
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
  statsContainer: {
    borderRadius: 16,
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
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
});