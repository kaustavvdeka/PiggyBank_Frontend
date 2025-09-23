import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  ActivityIndicator,
  Dimensions 
} from 'react-native';
import { apiGet } from '../api/client';
import { colors, shadow } from '../../src/theme';

const { width } = Dimensions.get('window');

export default function ProfileScreen({ route }) {
  const animal = route?.params?.animal || 'Pig';
  const [profile, setProfile] = useState(null);
  const [streak, setStreak] = useState([]);
  const [contributionData, setContributionData] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('3months');
  const [loading, setLoading] = useState(true);

  // Demo profile data
  const demoProfile = {
    name: 'John Farmer',
    username: '@john_farmer',
    avatar: 'https://placekitten.com/120/120',
    bio: 'Poultry and crop farmer with 5 years experience. Passionate about sustainable farming.',
    location: 'Rural County, Farm State',
    joinDate: '2023-01-15',
    stats: {
      tasksCompleted: 156,
      currentStreak: 7,
      longestStreak: 24,
      animalsCared: 3,
      communityPosts: 45
    }
  };

  // Demo contribution data for different timeframes
  const demoContributionData = {
    '3months': generateDemoContributions(90),
    '6months': generateDemoContributions(180),
    '1year': generateDemoContributions(365)
  };

  function generateDemoContributions(days) {
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().slice(0, 10);
      
      // Randomize completion (more likely to have recent activity)
      const daysAgo = i;
      const completionChance = daysAgo < 7 ? 0.8 : daysAgo < 30 ? 0.6 : 0.3;
      const completed = Math.random() < completionChance;
      const level = completed ? (Math.random() < 0.2 ? 2 : 1) : 0;
      
      data.push({
        date: dateString,
        count: completed ? Math.floor(Math.random() * 5) + 1 : 0,
        level: level
      });
    }
    
    return data;
  }

  useEffect(() => {
    loadProfileData();
  }, [animal, selectedTimeframe]);

  const loadProfileData = async () => {
    setLoading(true);
    
    try {
      // Simulate API calls with demo data
      await Promise.all([
        // Profile data
        new Promise(resolve => setTimeout(() => {
          setProfile(demoProfile);
          resolve();
        }, 500)),
        
        // Streak data
        new Promise(resolve => setTimeout(() => {
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - 6);
          const demoStreak = [];
          for (let i = 0; i < 7; i++) {
            const day = new Date();
            day.setDate(day.getDate() - (6 - i));
            const key = day.toISOString().slice(0, 10);
            demoStreak.push({
              date: key,
              completed: Math.random() < 0.7 // 70% chance of completion
            });
          }
          setStreak(demoStreak);
          resolve();
        }, 300)),
        
        // Contribution data
        new Promise(resolve => setTimeout(() => {
          setContributionData(demoContributionData[selectedTimeframe]);
          resolve();
        }, 400))
      ]);
    } catch (error) {
      console.error('Error loading profile data:', error);
      // Fallback to demo data
      setProfile(demoProfile);
      setContributionData(demoContributionData[selectedTimeframe]);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 0: return '#EBEDF0'; // No activity
      case 1: return '#9BE9A8'; // Low activity
      case 2: return '#40C463'; // Medium activity
      case 3: return '#30A14E'; // High activity
      case 4: return '#216E39'; // Very high activity
      default: return '#EBEDF0';
    }
  };

  const renderContributionChart = () => {
    if (!contributionData.length) return null;

    const weeks = [];
    const daysPerWeek = 7;
    const totalWeeks = Math.ceil(contributionData.length / daysPerWeek);

    for (let week = 0; week < totalWeeks; week++) {
      const weekData = contributionData.slice(week * daysPerWeek, (week + 1) * daysPerWeek);
      weeks.push(weekData);
    }

    const cellSize = (width - 60) / totalWeeks > 12 ? 12 : (width - 60) / totalWeeks;

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.weekColumn}>
              {week.map((day, dayIndex) => (
                <View
                  key={`${weekIndex}-${dayIndex}`}
                  style={[
                    styles.contributionCell,
                    {
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: getLevelColor(day.level)
                    }
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
        
        <View style={styles.chartLegend}>
          <Text style={styles.legendText}>Less</Text>
          {[0, 1, 2, 3, 4].map(level => (
            <View 
              key={level} 
              style={[
                styles.legendCell, 
                { backgroundColor: getLevelColor(level) }
              ]} 
            />
          ))}
          <Text style={styles.legendText}>More</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image source={{ uri: profile.avatar }} style={styles.avatar} />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.username}>{profile.username}</Text>
          <Text style={styles.bio}>{profile.bio}</Text>
          <Text style={styles.location}>📍 {profile.location}</Text>
          <Text style={styles.joinDate}>Joined {new Date(profile.joinDate).toLocaleDateString()}</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{profile.stats.tasksCompleted}</Text>
          <Text style={styles.statLabel}>Tasks Done</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{profile.stats.currentStreak}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{profile.stats.longestStreak}</Text>
          <Text style={styles.statLabel}>Longest Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{profile.stats.animalsCared}</Text>
          <Text style={styles.statLabel}>Animals</Text>
        </View>
      </View>

      {/* Weekly Streak */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weekly Streak - {animal}</Text>
        <View style={styles.streakRow}>
          {streak.map((day, index) => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en', { weekday: 'short' });
            return (
              <View key={index} style={styles.streakDay}>
                <Text style={styles.dayName}>{dayName}</Text>
                <View 
                  style={[
                    styles.streakDot, 
                    day.completed ? styles.streakOn : styles.streakOff
                  ]} 
                />
                <Text style={styles.dayDate}>{date.getDate()}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Contribution Chart */}
      <View style={styles.section}>
        <View style={styles.chartHeader}>
          <Text style={styles.sectionTitle}>Activity Overview</Text>
          <View style={styles.timeframeSelector}>
            {['3months', '6months', '1year'].map(timeframe => (
              <TouchableOpacity
                key={timeframe}
                style={[
                  styles.timeframeButton,
                  selectedTimeframe === timeframe && styles.timeframeButtonActive
                ]}
                onPress={() => setSelectedTimeframe(timeframe)}
              >
                <Text style={[
                  styles.timeframeText,
                  selectedTimeframe === timeframe && styles.timeframeTextActive
                ]}>
                  {timeframe === '3months' ? '3M' : timeframe === '6months' ? '6M' : '1Y'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {renderContributionChart()}
        
        <View style={styles.chartStats}>
          <Text style={styles.chartStat}>
            Total tasks: <Text style={styles.chartStatValue}>{profile.stats.tasksCompleted}</Text>
          </Text>
          <Text style={styles.chartStat}>
            Current streak: <Text style={styles.chartStatValue}>{profile.stats.currentStreak} days</Text>
          </Text>
        </View>
      </View>

      {/* Recent Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        <View style={styles.achievements}>
          {['🏆 7-Day Streak', '🌱 Crop Master', '🐔 Poultry Expert', '📚 Quick Learner'].map((achievement, index) => (
            <View key={index} style={styles.achievementBadge}>
              <Text style={styles.achievementText}>{achievement}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 20,
    marginTop: 40, // Add this line
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 12,
    color: colors.textMuted,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    ...shadow.card,
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
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streakDay: {
    alignItems: 'center',
  },
  dayName: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 8,
  },
  streakDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 4,
  },
  streakOn: {
    backgroundColor: colors.primary,
  },
  streakOff: {
    backgroundColor: '#EBEDF0',
  },
  dayDate: {
    fontSize: 12,
    color: colors.textMuted,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeframeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 4,
  },
  timeframeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  timeframeButtonActive: {
    backgroundColor: colors.primary,
  },
  timeframeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  timeframeTextActive: {
    color: '#FFFFFF',
  },
  chartContainer: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...shadow.card,
  },
  chart: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  weekColumn: {
    marginRight: 2,
  },
  contributionCell: {
    margin: 1,
    borderRadius: 2,
  },
  chartLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendCell: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  legendText: {
    fontSize: 10,
    color: colors.textMuted,
    marginHorizontal: 4,
  },
  chartStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  chartStat: {
    fontSize: 14,
    color: colors.textMuted,
  },
  chartStatValue: {
    fontWeight: '600',
    color: colors.text,
  },
  achievements: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  achievementBadge: {
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  achievementText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
});