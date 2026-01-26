import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { useLogout } from '../../hooks/api/auth/useAuth';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const { user } = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutMutation.mutateAsync();
            } catch (error) {
              console.error('Logout error:', error);
            }
          },
        },
      ]
    );
  };

  const ProfileItem = ({ icon, label, value, onPress }) => (
    <TouchableOpacity
      style={styles.profileItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.itemLeft}>
        <Ionicons name={icon} size={24} color="#007AFF" />
        <View style={styles.itemContent}>
          <Text style={styles.itemLabel}>{label}</Text>
          {value && <Text style={styles.itemValue}>{value}</Text>}
        </View>
      </View>
      {onPress && (
        <Ionicons name="chevron-forward" size={24} color="#999" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.firstName?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={styles.name}>
            {user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.username || 'User'}
          </Text>
          <Text style={styles.email}>{user?.email || 'No email'}</Text>
          {user?.level && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{user.level.toUpperCase()}</Text>
            </View>
          )}
        </View>

        {/* Profile Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <ProfileItem
            icon="person-outline"
            label="Username"
            value={user?.username || 'Not set'}
          />
          
          <ProfileItem
            icon="person-outline"
            label="Full Name"
            value={user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Not set'}
          />
          
          <ProfileItem
            icon="mail-outline"
            label="Email"
            value={user?.email || 'Not set'}
          />
          
          <ProfileItem
            icon="finger-print-outline"
            label="User ID"
            value={user?.id?.toString() || 'Not set'}
          />
          
          {user?.level && (
            <ProfileItem
              icon="shield-outline"
              label="Level"
              value={user.level.charAt(0).toUpperCase() + user.level.slice(1)}
            />
          )}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <ProfileItem
            icon="language-outline"
            label="Language"
            value="English"
            onPress={() => Alert.alert('Coming Soon', 'Language settings will be available soon')}
          />
          
          <ProfileItem
            icon="notifications-outline"
            label="Notifications"
            onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon')}
          />
          
          <ProfileItem
            icon="lock-closed-outline"
            label="Change Password"
            onPress={() => Alert.alert('Coming Soon', 'Password change will be available soon')}
          />
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <ProfileItem
            icon="information-circle-outline"
            label="App Version"
            value="1.0.0"
          />
          
          <ProfileItem
            icon="document-text-outline"
            label="Terms & Conditions"
            onPress={() => Alert.alert('Coming Soon', 'Terms & Conditions will be available soon')}
          />
          
          <ProfileItem
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            onPress={() => Alert.alert('Coming Soon', 'Privacy Policy will be available soon')}
          />
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginTop: 20,
    backgroundColor: '#fff',
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemContent: {
    marginLeft: 12,
    flex: 1,
  },
  itemLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  itemValue: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  badge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#007AFF',
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ProfileScreen;