import 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // If using Expo
// If not using Expo, you can use: import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';
import ShopScreen from './src/screens/ShopScreen';
import PostScreen from './src/screens/PostScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import MedicalConnectScreen from './src/screens/MedicalConnectScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#FFFFFF',
      primary: '#6B8E23',
      card: '#FFFFFF',
      text: '#0B1F0E',
      border: '#E6EBD6',
      notification: '#FF3B30',
    },
  };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          headerStyle: {
            backgroundColor: '#6B8E23',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '600',
          }
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen 
          name="Messages" 
          component={MessagesScreen}
          options={{
            headerShown: true,
            title: 'Messages',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen 
          name="Category" 
          component={CategoryScreen}
          options={{
            headerShown: true,
            title: 'Categories',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen 
          name="Notifications" 
          component={NotificationsScreen}
          options={{
            headerShown: true,
            title: 'Notifications',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen 
          name="MedicalConnect" 
          component={MedicalConnectScreen}
          options={{
            headerShown: true,
            title: 'Medical Connect',
            headerBackTitle: 'Back',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#6B8E23',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={focused ? styles.iconContainerActive : styles.iconContainer}>
              <Ionicons 
                name={focused ? "home" : "home-outline"} 
                size={24} 
                color={color} 
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Map" 
        component={MapScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={focused ? styles.iconContainerActive : styles.iconContainer}>
              <Ionicons 
                name={focused ? "map" : "map-outline"} 
                size={24} 
                color={color} 
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
          tabBarLabel: 'Map',
        }}
      />
      <Tab.Screen 
        name="Post" 
        component={PostScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={styles.centerIcon}>
              <View style={[styles.addButton, focused && styles.addButtonActive]}>
                <Ionicons 
                  name="add" 
                  size={28} 
                  color={focused ? "#FFFFFF" : "#6B8E23"} 
                />
              </View>
            </View>
          ),
          tabBarLabel: 'Post',
        }}
      />
      <Tab.Screen 
        name="Shop" 
        component={ShopScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={focused ? styles.iconContainerActive : styles.iconContainer}>
              <Ionicons 
                name={focused ? "cart" : "cart-outline"} 
                size={24} 
                color={color} 
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
          tabBarLabel: 'Shop',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={focused ? styles.iconContainerActive : styles.iconContainer}>
              <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={24} 
                color={color} 
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E6EBD6',
    height: 85,
    paddingBottom: 10,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
  },
  iconContainerActive: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
  },
  activeDot: {
    position: 'absolute',
    top: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6B8E23',
  },
  centerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    top: -18,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6B8E23',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#6B8E23',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonActive: {
    backgroundColor: '#8BA862',
    transform: [{ scale: 1.05 }],
  },
});

// Alternative if you don't have Ionicons, use this simple icon component:
const SimpleIcon = ({ name, focused, color }) => {
  const icons = {
    home: focused ? '🏠' : '🏠',
    map: focused ? '🗺️' : '🗺️',
    cart: focused ? '🛒' : '🛒',
    person: focused ? '👤' : '👤',
    add: '➕',
  };

  return <Text style={{ fontSize: 24 }}>{icons[name]}</Text>;
};