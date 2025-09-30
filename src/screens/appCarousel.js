import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width: screenWidth } = Dimensions.get('window');

// Sample data for the carousel slides
const carouselData = [
  {
    title: 'Track Flock Health',
    text: 'Easily log and monitor the health records of your poultry.',
    image: 'https://img.icons8.com/plasticine/200/000000/document.png', // Replace with your own image/icon
    bgColor: '#45B7D1',
  },
  {
    title: 'Manage Feed Schedules',
    text: 'Optimize feeding times and inventory for healthier birds.',
    image: 'https://img.icons8.com/plasticine/200/000000/corn.png', // Replace with your own image/icon
    bgColor: '#FF6B6B',
  },
  {
    title: 'Connect With Vets',
    text: 'Get expert advice and instant help from veterinarians.',
    image: 'https://img.icons8.com/plasticine/200/000000/medical-doctor.png', // Replace with your own image/icon
    bgColor: '#4ECDC4',
  },
];


const AppCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const _renderItem = ({ item, index }) => {
    return (
      <View style={[styles.slide, { backgroundColor: item.bgColor }]}>
        <Image source={{ uri: item.image }} style={styles.slideImage} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        loop
        width={screenWidth - 60}
        height={180}
        autoPlay={true}
        data={carouselData}
        scrollAnimationDuration={1000}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={_renderItem}
      />
      {/* Custom pagination */}
      <View style={styles.paginationContainer}>
        {carouselData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeIndex ? styles.activeDot : styles.inactiveDot
            ]}
          />
        ))}
      </View>
    </View>
  );
};

// Add custom pagination styles
const styles = StyleSheet.create({
  // ... previous styles
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  inactiveDot: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
});
export default AppCarousel;