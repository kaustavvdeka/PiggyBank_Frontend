import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  RefreshControl,
  Image
} from 'react-native';
import { colors, shadow } from '../../src/theme';
import { apiGet } from '../api/client';

export default function NotificationsScreen() {
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Demo notifications data
  const demoNotifications = [
    {
      id: 1,
      title: "🚨 Disease Alert",
      body: "Avian influenza reported in your area. Check biosecurity measures.",
      time: "2 hours ago",
      type: "alert",
      read: false,
      priority: "high"
    },
    {
      id: 2,
      title: "📢 Weather Update",
      body: "Heavy rainfall expected tomorrow. Secure your livestock shelters.",
      time: "5 hours ago",
      type: "info",
      read: false,
      priority: "medium"
    },
    {
      id: 3,
      title: "💰 Market Price Update",
      body: "Poultry prices have increased by 15% this week.",
      time: "1 day ago",
      type: "market",
      read: true,
      priority: "medium"
    },
    {
      id: 4,
      title: "👥 Community Event",
      body: "Farmers meetup scheduled for Saturday at Community Center.",
      time: "2 days ago",
      type: "event",
      read: true,
      priority: "low"
    },
    {
      id: 5,
      title: "🔬 New Research",
      body: "New feed formula study shows 20% better growth rates.",
      time: "3 days ago",
      type: "research",
      read: true,
      priority: "medium"
    }
  ];

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    setRefreshing(true);
    // Simulate API call with demo data
    setTimeout(() => {
      apiGet('/api/map/alerts')
        .then((res) => {
          // Use demo data if API returns empty or fails
          const notifications = res.notifications && res.notifications.length > 0 
            ? res.notifications 
            : demoNotifications;
          setItems(notifications);
        })
        .catch(() => {
          // Fallback to demo data if API fails
          setItems(demoNotifications);
        })
        .finally(() => {
          setRefreshing(false);
        });
    }, 1000);
  };

  const markAsRead = (id) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, read: true } : item
      )
    );
  };

  const deleteNotification = (id) => {
    Alert.alert(
      "Delete Notification",
      "Are you sure you want to delete this notification?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            setItems(prevItems => prevItems.filter(item => item.id !== id));
          }
        }
      ]
    );
  };

  const clearAllNotifications = () => {
    if (items.length === 0) return;
    
    Alert.alert(
      "Clear All Notifications",
      "Are you sure you want to clear all notifications?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear All", 
          style: "destructive",
          onPress: () => {
            setItems([]);
          }
        }
      ]
    );
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF4444';
      case 'medium': return '#FFAA00';
      case 'low': return '#4CAF50';
      default: return colors.primary;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert': return '🚨';
      case 'info': return '📢';
      case 'market': return '💰';
      case 'event': return '👥';
      case 'research': return '🔬';
      default: return '📋';
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.card, 
        !item.read && styles.unreadCard,
        { borderLeftWidth: 4, borderLeftColor: getPriorityColor(item.priority) }
      ]}
      onPress={() => markAsRead(item.id)}
      onLongPress={() => deleteNotification(item.id)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.icon}>{getNotificationIcon(item.type)}</Text>
          <Text style={[styles.title, !item.read && styles.unreadTitle]}>
            {item.title}
          </Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </View>
      
      <Text style={styles.body}>{item.body}</Text>
      
      <View style={styles.footer}>
        <Text style={styles.time}>{item.time}</Text>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteNotification(item.id)}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {items.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearAllNotifications}
          >
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptyText}>You're all caught up!</Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={loadNotifications}
          >
            <Text style={styles.refreshText}>Reload Notifications</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderNotificationItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={loadNotifications}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <View style={styles.stats}>
        <Text style={styles.statsText}>
          {items.filter(item => !item.read).length} unread • {items.length} total
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.error,
    borderRadius: 16,
  },
  clearText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...shadow.card,
  },
  unreadCard: {
    backgroundColor: '#F8F9FF',
    borderLeftWidth: 4,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  title: {
    fontWeight: '700',
    color: colors.text,
    fontSize: 16,
    flex: 1,
  },
  unreadTitle: {
    color: colors.primary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  body: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    color: colors.textMuted,
    fontSize: 12,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#FFEBEE',
    borderRadius: 12,
  },
  deleteText: {
    color: colors.error,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 20,
  },
  refreshButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  refreshText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  stats: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  statsText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
});