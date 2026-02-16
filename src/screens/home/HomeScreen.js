import React, { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text as RNText,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import {
  Button,
  Card,
  Text,
  XStack,
  YStack,
} from 'tamagui';
import { useAuth } from '../../contexts/AuthContext';
import { useChannelsWithContents } from '../../hooks/api/channels/useChannels';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 40;

const HomeScreen = () => {
  const { user } = useAuth();
  const router = useRouter();

  const {
    data: channelsData,
    isLoading: channelsLoading,
    refetch: refetchChannels,
    error,
  } = useChannelsWithContents('fr');

  const [refreshing, setRefreshing] = React.useState(false);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const bannerScrollRef = useRef(null);

  // Promotional banners data
  const banners = [
    {
      id: 1,
      title: 'Start Your Journey',
      subtitle: 'Explore new courses and skills',
      backgroundColor: ['#6366F1', '#8B5CF6'],
      icon: 'rocket-outline',
    },
    {
      id: 2,
      title: 'Learn Anytime',
      subtitle: 'Access courses on your schedule',
      backgroundColor: ['#EC4899', '#F43F5E'],
      icon: 'time-outline',
    },
    {
      id: 3,
      title: 'Track Progress',
      subtitle: 'Monitor your learning achievements',
      backgroundColor: ['#10B981', '#059669'],
      icon: 'stats-chart-outline',
    },
  ];

  // Auto-scroll banners
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBannerIndex((current) => {
        const next = current === banners.length - 1 ? 0 : current + 1;
        bannerScrollRef.current?.scrollToIndex({
          index: next,
          animated: true,
        });
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetchChannels();
    setRefreshing(false);
  }, [refetchChannels]);

  const channels = Array.isArray(channelsData?.data)
    ? channelsData.data
    : Array.isArray(channelsData)
      ? channelsData
      : [];

  const errorMessage =
    error?.response?.data?.message || error?.message || 'Unable to load content.';

  const getChannelIcon = (channel) => {
    const icon = channel?.thumbnail?.icon || '';
    const lower = icon.toLowerCase();

    if (lower.includes('alarm') || lower.includes('clock')) {
      return 'time-outline';
    }
    if (lower.includes('play')) {
      return 'play-circle-outline';
    }
    if (lower.includes('bookmark')) {
      return 'bookmark-outline';
    }
    return 'apps-outline';
  };

  const getStatusMeta = (content) => {
    const validityStatus =
      content?.enrollment?.enrollment_validity_status ||
      content?.time_options?.course_status;
    const enrollmentStatus = content?.enrollment?.enrollment_status;

    if (validityStatus === 'expired') {
      return { label: 'Expired', color: '#B00020', textColor: '#fff' };
    }

    if (enrollmentStatus === 'in_progress') {
      return { label: 'In progress', color: '#F5A623', textColor: '#1A1A1A' };
    }

    if (enrollmentStatus === 'completed') {
      return { label: 'Completed', color: '#2E7D32', textColor: '#fff' };
    }

    if (enrollmentStatus === 'enrolled') {
      return { label: 'Not started', color: '#D0021B', textColor: '#fff' };
    }

    return { label: 'New', color: '#4A90E2', textColor: '#fff' };
  };

  const renderBannerItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bannerContainer}
      activeOpacity={0.9}
      onPress={() => router.push('/courses')}
    >
      <View
        style={[
          styles.banner,
          {
            background: `linear-gradient(135deg, ${item.backgroundColor[0]}, ${item.backgroundColor[1]})`,
            backgroundColor: item.backgroundColor[0],
          },
        ]}
      >
        <View style={styles.bannerContent}>
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>{item.title}</Text>
            <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
            <View style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Explore Now</Text>
              <Ionicons name="arrow-forward" size={14} color="#fff" />
            </View>
          </View>
          <View style={styles.bannerIconContainer}>
            <Ionicons name={item.icon} size={80} color="rgba(255,255,255,0.3)" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderContentCard = ({ item, index }) => {
    const status = getStatusMeta(item);

    return (
      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 350, delay: index * 60 }}
      >
        <Card
          elevate
          bordered
          width={230}
          borderRadius={18}
          overflow="hidden"
          backgroundColor="#fff"
          marginRight={14}
          onPress={() => router.push(`/courses/${item.id}`)}
        >
          <View style={styles.cardImageWrapper}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.cardImage} />
            ) : (
              <View style={styles.cardImagePlaceholder}>
                <Ionicons name="image-outline" size={28} color="#8C8C8C" />
              </View>
            )}
            <View style={[styles.statusBadge, { backgroundColor: status.color }]}>

              <Text style={[styles.statusText, { color: status.textColor }]}>
                {status.label}
              </Text>
            </View>
          </View>

          <YStack padding={12} gap="$2">
            <Text fontSize={14} fontWeight="600" color="#1A1A1A" numberOfLines={2}>
              {item.name || item.title}
            </Text>
            {/* <Text fontSize={12} color="#8C8C8C" numberOfLines={1}>
              {item.code}
            </Text> */}
            <XStack alignItems="center" justifyContent="space-between">
              <XStack alignItems="center" gap="$1">
                <Ionicons name="book-outline" size={14} color="#6D6D6D" />
                <Text fontSize={11} color="#6D6D6D">Course</Text>
              </XStack>
              <XStack alignItems="center" gap="$1">
                <Ionicons name="time-outline" size={14} color="#6D6D6D" />
                <Text fontSize={11} color="#6D6D6D">
                  {item.formatted_duration || '0m'}
                </Text>
              </XStack>
            </XStack>
          </YStack>
        </Card>
      </MotiView>
    );
  };

  if (channelsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
          style={styles.header}
        >
          <View style={styles.headerGlow} />
          <YStack gap="$2">
            <Text style={styles.greeting}>
              Hello, {user?.firstName || user?.name || 'Learner'}
            </Text>
            <Text style={styles.subtitle}>Pick up where you left off</Text>
            <Button
              backgroundColor="#E76F51"
              color="#fff"
              borderRadius={18}
              size="$3"
              alignSelf="flex-start"
              onPress={() => router.push('/courses')}
              iconAfter={<Ionicons name="arrow-forward" size={16} color="#fff" />}
            >
              Browse all courses
            </Button>
          </YStack>
        </MotiView>

        {/* Promotional Banner Carousel */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 500, delay: 200 }}
          style={styles.carouselSection}
        >
          <FlatList
            ref={bannerScrollRef}
            data={banners}
            renderItem={renderBannerItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            snapToInterval={BANNER_WIDTH + 20}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / (BANNER_WIDTH + 20)
              );
              setActiveBannerIndex(index);
            }}
            getItemLayout={(data, index) => ({
              length: BANNER_WIDTH + 20,
              offset: (BANNER_WIDTH + 20) * index,
              index,
            })}
          />

          {/* Dot Indicators */}
          <View style={styles.dotContainer}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === activeBannerIndex && styles.activeDot,
                ]}
              />
            ))}
          </View>
        </MotiView>

        {error ? (
          <YStack style={styles.emptyState}>
            <Text style={styles.emptyTitle}>We could not load your channels</Text>
            <Text style={styles.emptyText}>{errorMessage}</Text>
            <Button
              marginTop="$3"
              backgroundColor="#1A2A3A"
              color="#fff"
              onPress={refetchChannels}
            >
              Try again
            </Button>
          </YStack>
        ) : channels.length === 0 ? (
          <YStack style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No courses yet</Text>
            <Text style={styles.emptyText}>
              Pull down to refresh or browse all courses.
            </Text>
            <Button
              marginTop="$3"
              backgroundColor="#1A2A3A"
              color="#fff"
              onPress={() => router.push('/courses')}
            >
              Browse courses
            </Button>
          </YStack>
        ) : (
          <YStack paddingVertical={20} gap="$5">
            {channels.map((channel) => (
              <YStack key={channel.id} gap="$2">
                <XStack alignItems="center" gap="$3" paddingHorizontal={20}>
                  <View
                    style={[
                      styles.channelIcon,
                      {
                        backgroundColor:
                          channel?.thumbnail?.background_code_color || '#5B5B5B',
                      },
                    ]}
                  >
                    <Ionicons
                      name={getChannelIcon(channel)}
                      size={18}
                      color={channel?.thumbnail?.icon_code_color || '#fff'}
                    />
                  </View>
                  <YStack flex={1}>
                    <Text style={styles.channelTitle}>{channel.name}</Text>
                    <Text style={styles.channelSubtitle}>
                      {channel.description}
                    </Text>
                  </YStack>
                </XStack>

                <FlatList
                  data={channel.contents || []}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={renderContentCard}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.channelList}
                  ListEmptyComponent={
                    <View style={styles.channelEmpty}>
                      <RNText style={styles.channelEmptyText}>
                        No courses in this channel.
                      </RNText>
                    </View>
                  }
                />
              </YStack>
            ))}
          </YStack>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F4F2',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 90, // Tab bar height (70px) + spacing (20px)
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#1A2A3A',
    paddingBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    overflow: 'hidden',
  },
  headerGlow: {
    position: 'absolute',
    top: -90,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#284A6D',
    opacity: 0.6,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F7F4F2',
  },
  subtitle: {
    fontSize: 15,
    color: '#D0D7DE',
  },
  carouselSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  carouselContent: {
    paddingHorizontal: 20,
  },
  bannerContainer: {
    width: BANNER_WIDTH,
    marginRight: 20,
  },
  banner: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  bannerContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  bannerTextContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  bannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 6,
  },
  bannerButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  bannerIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D0D7DE',
  },
  activeDot: {
    width: 20,
    backgroundColor: '#1A2A3A',
  },
  channelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  channelSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: '#6D6D6D',
  },
  channelIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  channelList: {
    paddingLeft: 20,
    paddingRight: 8,
    paddingTop: 12,
  },
  channelEmpty: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  channelEmptyText: {
    fontSize: 13,
    color: '#9B9B9B',
  },
  cardImageWrapper: {
    position: 'relative',
    height: 120,
    backgroundColor: '#E9E4DF',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardImagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  emptyState: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#6D6D6D',
    textAlign: 'center',
  },
});

export default HomeScreen;