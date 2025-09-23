import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function CategoryScreen() {
  const navigation = useNavigation();
  
  const animals = [
    { 
      name: 'Pig', 
      icon: '🐷', 
      color: '#FFB6C1',
      gradient: ['#FFB6C1', '#FF69B4'],
      count: '15 breeds'
    },
    { 
      name: 'Dog', 
      icon: '🐶', 
      color: '#FFD700',
      gradient: ['#FFD700', '#FFA500'],
      count: '25 breeds'
    },
    { 
      name: 'Cock', 
      icon: '🐔', 
      color: '#FFA07A',
      gradient: ['#FFA07A', '#FF6347'],
      count: '12 breeds'
    },
    { 
      name: 'Duck', 
      icon: '🦆', 
      color: '#87CEEB',
      gradient: ['#87CEEB', '#4682B4'],
      count: '8 breeds'
    },
    { 
      name: 'Cow', 
      icon: '🐮', 
      color: '#D2B48C',
      gradient: ['#D2B48C', '#A0522D'],
      count: '10 breeds'
    },
    { 
      name: 'Goat', 
      icon: '🐐', 
      color: '#98FB98',
      gradient: ['#98FB98', '#32CD32'],
      count: '6 breeds'
    },
    { 
      name: 'Sheep', 
      icon: '🐑', 
      color: '#F5F5F5',
      gradient: ['#F5F5F5', '#D3D3D3'],
      count: '9 breeds'
    },
    { 
      name: 'Horse', 
      icon: '🐴', 
      color: '#DEB887',
      gradient: ['#DEB887', '#8B4513'],
      count: '7 breeds'
    },
    { 
      name: 'Rabbit', 
      icon: '🐰', 
      color: '#FFF0F5',
      gradient: ['#FFF0F5', '#DDA0DD'],
      count: '5 breeds'
    }
  ];

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
        <Text style={styles.headerTitle}>Select Animal</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <Text style={styles.icon}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Text style={styles.icon}>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>Choose Your Animal</Text>
            <Text style={styles.welcomeSubtitle}>
              Select from {animals.length} different animal categories to explore veterinary services, products, and care tips.
            </Text>
          </View>
          <View style={styles.welcomeIcon}>
            <Text style={styles.welcomeEmoji}>🐾</Text>
          </View>
        </View>

        {/* Animal Grid */}
        <View style={styles.gridContainer}>
          <Text style={styles.sectionTitle}>Animal Categories</Text>
          <View style={styles.grid}>
            {animals.map((animal, index) => (
              <TouchableOpacity
                key={animal.name}
                style={[
                  styles.animalCard,
                  { 
                    backgroundColor: animal.color,
                    borderLeftWidth: 4,
                    borderLeftColor: animal.gradient[1]
                  }
                ]}
                onPress={() => navigation.navigate('Profile', { animal: animal.name })}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.animalIcon}>{animal.icon}</Text>
                  <Text style={styles.animalName}>{animal.name}</Text>
                  <Text style={styles.animalCount}>{animal.count}</Text>
                </View>
                <View style={styles.cardArrow}>
                  <Text style={styles.arrowIcon}>→</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Services Section */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>Popular Services</Text>
          <View style={styles.servicesGrid}>
            <TouchableOpacity style={styles.serviceCard}>
              <Text style={styles.serviceIcon}>💉</Text>
              <Text style={styles.serviceText}>Vaccination</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.serviceCard}>
              <Text style={styles.serviceIcon}>🩺</Text>
              <Text style={styles.serviceText}>Health Check</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.serviceCard}>
              <Text style={styles.serviceIcon}>✂️</Text>
              <Text style={styles.serviceText}>Grooming</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.serviceCard}>
              <Text style={styles.serviceIcon}>🍼</Text>
              <Text style={styles.serviceText}>Nutrition</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>🚑</Text>
              <Text style={styles.actionText}>Emergency</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📞</Text>
              <Text style={styles.actionText}>Call Vet</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionText}>Chat Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA' 
  },
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  headerIcon: {
    padding: 5,
  },
  icon: {
    fontSize: 18,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  welcomeCard: {
    flexDirection: 'row',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundColor: '#4A90E2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeText: {
    flex: 1,
    marginRight: 15,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  welcomeIcon: {
    justifyContent: 'center',
  },
  welcomeEmoji: {
    fontSize: 40,
  },
  gridContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  animalCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  cardContent: {
    flex: 1,
  },
  animalIcon: {
    fontSize: 28,
    marginBottom: 5,
  },
  animalName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  animalCount: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  cardArrow: {
    paddingLeft: 10,
  },
  arrowIcon: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  servicesSection: {
    marginBottom: 30,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  serviceCard: {
    width: '23%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  serviceIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  serviceText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  quickActions: {
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});