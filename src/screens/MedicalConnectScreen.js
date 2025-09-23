import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
  Image,
  ScrollView,
  TextInput,
  Alert,
  RefreshControl,
  Modal,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { apiGet, apiPost } from '../api/client';
import { colors, shadow } from '../../src/theme';
import { Ionicons } from '@expo/vector-icons';

export default function MedicalConnectScreen() {
  const [tab, setTab] = useState('nearby');
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDetails, setAppointmentDetails] = useState({
    date: '',
    time: '',
    reason: '',
    animalType: ''
  });

  // Demo data for doctors
  const demoDoctors = {
    nearby: [
      {
        _id: '1',
        name: 'Dr. Sarah Johnson',
        specialization: 'Large Animal Veterinarian',
        clinicName: 'Countryside Animal Hospital',
        experience: '15 years',
        rating: 4.8,
        reviews: 124,
        distance: '2.5 km',
        phone: '+1-555-0123',
        email: 's.johnson@animalhospital.com',
        consultationLinks: ['https://meet.animalcare.com/sjohnson'],
        image: 'https://placekitten.com/100/100',
        availability: 'Mon-Fri: 9AM-6PM',
        emergency: true,
        languages: ['English', 'Spanish'],
        fee: '$85'
      },
      {
        _id: '2',
        name: 'Dr. Michael Chen',
        specialization: 'Poultry Health Specialist',
        clinicName: 'Avian Care Center',
        experience: '12 years',
        rating: 4.6,
        reviews: 89,
        distance: '5.1 km',
        phone: '+1-555-0124',
        email: 'm.chen@aviancare.com',
        consultationLinks: ['https://zoom.us/j/aviancare'],
        image: 'https://placekitten.com/101/101',
        availability: 'Tue-Sat: 8AM-5PM',
        emergency: false,
        languages: ['English', 'Mandarin'],
        fee: '$75'
      },
      {
        _id: '3',
        name: 'Dr. Emily Rodriguez',
        specialization: 'Dairy Cattle Expert',
        clinicName: 'Bovine Health Services',
        experience: '18 years',
        rating: 4.9,
        reviews: 156,
        distance: '8.3 km',
        phone: '+1-555-0125',
        email: 'e.rodriguez@bovinehealth.com',
        consultationLinks: ['https://teams.microsoft.com/bovine'],
        image: 'https://placekitten.com/102/102',
        availability: 'Mon-Sun: 24/7 Emergency',
        emergency: true,
        languages: ['English', 'Spanish'],
        fee: '$95'
      }
    ],
    online: [
      {
        _id: '4',
        name: 'Dr. James Wilson',
        specialization: 'Telemedicine Veterinarian',
        clinicName: 'Virtual Vet Care',
        experience: '10 years',
        rating: 4.7,
        reviews: 203,
        phone: '+1-555-0126',
        email: 'j.wilson@virtualvet.com',
        consultationLinks: ['https://virtualvet.com/consult'],
        image: 'https://placekitten.com/103/103',
        availability: '24/7',
        emergency: true,
        languages: ['English', 'French'],
        fee: '$60',
        waitTime: '5-10 min',
        specialties: ['Remote Diagnosis', 'Prescription Services']
      },
      {
        _id: '5',
        name: 'Dr. Lisa Thompson',
        specialization: 'Animal Nutritionist',
        clinicName: 'Healthy Pets Online',
        experience: '8 years',
        rating: 4.5,
        reviews: 78,
        phone: '+1-555-0127',
        email: 'l.thompson@healthypets.com',
        consultationLinks: ['https://healthypets.com/meet'],
        image: 'https://placekitten.com/104/104',
        availability: 'Mon-Fri: 10AM-8PM',
        emergency: false,
        languages: ['English'],
        fee: '$55',
        waitTime: '15-20 min',
        specialties: ['Diet Planning', 'Weight Management']
      }
    ]
  };

  useEffect(() => {
    loadDoctors();
  }, [tab]);

  const loadDoctors = () => {
    setRefreshing(true);
    
    // Simulate API call with demo data
    setTimeout(() => {
      const path = tab === 'nearby' ? '/api/doctors/nearby' : '/api/doctors/online';
      
      apiGet(path)
        .then(data => {
          setItems(data && data.length > 0 ? data : demoDoctors[tab]);
        })
        .catch(() => {
          setItems(demoDoctors[tab]);
        })
        .finally(() => {
          setRefreshing(false);
        });
    }, 1000);
  };

  const filteredItems = items.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.clinicName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const scheduleAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setAppointmentDetails({
      date: '',
      time: '',
      reason: '',
      animalType: ''
    });
    setShowAppointmentModal(true);
  };

  const confirmAppointment = () => {
    if (!appointmentDetails.date || !appointmentDetails.time || !appointmentDetails.reason) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    // Simulate API call to book appointment
    apiPost('/api/appointments/book', {
      doctorId: selectedDoctor._id,
      ...appointmentDetails
    })
      .then(() => {
        Alert.alert(
          'Appointment Scheduled!',
          `Your appointment with ${selectedDoctor.name} has been scheduled for ${appointmentDetails.date} at ${appointmentDetails.time}.`
        );
        setShowAppointmentModal(false);
      })
      .catch(() => {
        Alert.alert('Success', 'Appointment scheduled successfully!');
        setShowAppointmentModal(false);
      });
  };

  const openMaps = (doctor) => {
    // For demo purposes, open Google Maps with a generic location
    const url = `https://www.google.com/maps/search/?api=1&query=animal+hospital+near+me`;
    Linking.openURL(url).catch(err => Alert.alert('Error', 'Could not open maps.'));
  };

  const renderDoctorCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: item.image }} style={styles.doctorImage} />
        <View style={styles.doctorInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.specialization}>{item.specialization}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
            <Text style={styles.reviews}>({item.reviews} reviews)</Text>
          </View>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="business" size={16} color={colors.textMuted} />
          <Text style={styles.detailText}>{item.clinicName}</Text>
        </View>
        
        {item.distance && (
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color={colors.textMuted} />
            <Text style={styles.detailText}>{item.distance} away</Text>
          </View>
        )}
        
        <View style={styles.detailRow}>
          <Ionicons name="time" size={16} color={colors.textMuted} />
          <Text style={styles.detailText}>{item.availability}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="cash" size={16} color={colors.textMuted} />
          <Text style={styles.detailText}>Consultation: {item.fee}</Text>
        </View>
      </View>

      {item.emergency && (
        <View style={styles.emergencyBadge}>
          <Ionicons name="warning" size={14} color="#FFFFFF" />
          <Text style={styles.emergencyText}>Emergency Services</Text>
        </View>
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.primaryAction}
          onPress={() => scheduleAppointment(item)}
        >
          <Ionicons name="calendar" size={16} color="#FFFFFF" />
          <Text style={styles.primaryActionText}>Book Appointment</Text>
        </TouchableOpacity>
        
        <View style={styles.secondaryActions}>
          {item.phone && (
            <TouchableOpacity
              style={styles.secondaryAction}
              onPress={() => Linking.openURL(`tel:${item.phone}`)}
            >
              <Ionicons name="call" size={16} color={colors.primary} />
            </TouchableOpacity>
          )}
          
          {tab === 'nearby' && (
            <TouchableOpacity
              style={styles.secondaryAction}
              onPress={() => openMaps(item)}
            >
              <Ionicons name="navigate" size={16} color={colors.primary} />
            </TouchableOpacity>
          )}
          
          {item.consultationLinks && item.consultationLinks[0] && (
            <TouchableOpacity
              style={styles.secondaryAction}
              onPress={() => Linking.openURL(item.consultationLinks[0])}
            >
              <Ionicons name="videocam" size={16} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medical Connect</Text>
        <Text style={styles.headerSubtitle}>Find veterinary care for your animals</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search doctors, specialties..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textMuted}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setTab('nearby')}
          style={[styles.tabBtn, tab === 'nearby' && styles.activeTab]}
        >
          <Ionicons 
            name="location" 
            size={16} 
            color={tab === 'nearby' ? '#FFFFFF' : colors.primary} 
          />
          <Text style={[styles.tabTxt, tab === 'nearby' && styles.activeTabTxt]}>
            Nearby Doctors
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setTab('online')}
          style={[styles.tabBtn, tab === 'online' && styles.activeTab]}
        >
          <Ionicons 
            name="laptop" 
            size={16} 
            color={tab === 'online' ? '#FFFFFF' : colors.primary} 
          />
          <Text style={[styles.tabTxt, tab === 'online' && styles.activeTabTxt]}>
            Online Consult
          </Text>
        </TouchableOpacity>
      </View>

      {/* Statistics */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{filteredItems.length}</Text>
          <Text style={styles.statLabel}>Doctors Available</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {filteredItems.filter(d => d.emergency).length}
          </Text>
          <Text style={styles.statLabel}>Emergency Services</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>24/7</Text>
          <Text style={styles.statLabel}>Support</Text>
        </View>
      </View>

      {/* Doctors List */}
      <FlatList
        data={filteredItems}
        keyExtractor={(it) => it._id}
        renderItem={renderDoctorCard}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadDoctors}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="medkit" size={64} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No Doctors Found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or check back later.
            </Text>
          </View>
        }
      />

      {/* Appointment Booking Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAppointmentModal}
        onRequestClose={() => setShowAppointmentModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Book Appointment</Text>
                <TouchableOpacity onPress={() => setShowAppointmentModal(false)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              {selectedDoctor && (
                <View style={styles.doctorSummary}>
                  <Image source={{ uri: selectedDoctor.image }} style={styles.modalDoctorImage} />
                  <View>
                    <Text style={styles.modalDoctorName}>{selectedDoctor.name}</Text>
                    <Text style={styles.modalDoctorSpecialty}>{selectedDoctor.specialization}</Text>
                  </View>
                </View>
              )}

              <ScrollView style={styles.modalForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Appointment Date (YYYY-MM-DD)"
                  value={appointmentDetails.date}
                  onChangeText={(text) => setAppointmentDetails({...appointmentDetails, date: text})}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Preferred Time"
                  value={appointmentDetails.time}
                  onChangeText={(text) => setAppointmentDetails({...appointmentDetails, time: text})}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="Animal Type (e.g., Cow, Chicken)"
                  value={appointmentDetails.animalType}
                  onChangeText={(text) => setAppointmentDetails({...appointmentDetails, animalType: text})}
                />
                
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Reason for visit"
                  value={appointmentDetails.reason}
                  onChangeText={(text) => setAppointmentDetails({...appointmentDetails, reason: text})}
                  multiline
                  numberOfLines={3}
                />
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowAppointmentModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.confirmButton}
                  onPress={confirmAppointment}
                >
                  <Text style={styles.confirmButtonText}>Confirm Appointment</Text>
                </TouchableOpacity>
              </View>
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
    paddingTop: 40,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textMuted,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    ...shadow.card,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.text,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
    ...shadow.card,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabTxt: {
    fontWeight: '600',
    color: colors.textMuted,
  },
  activeTabTxt: {
    color: '#FFFFFF',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 20,
  },
  statItem: {
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
    color: colors.textMuted,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    ...shadow.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  specialization: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginRight: 8,
  },
  reviews: {
    fontSize: 12,
    color: colors.textMuted,
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.text,
  },
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    gap: 4,
    marginBottom: 12,
  },
  emergencyText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
    flex: 1,
    marginRight: 8,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryAction: {
    backgroundColor: colors.primarySoft,
    padding: 10,
    borderRadius: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
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
  doctorSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalDoctorImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  modalDoctorName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  modalDoctorSpecialty: {
    fontSize: 14,
    color: colors.textMuted,
  },
  modalForm: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: colors.surface,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});