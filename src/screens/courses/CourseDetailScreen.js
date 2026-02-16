import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useCoursePreview } from '../../hooks/api/courses/useCoursePreview';

const CourseDetailScreen = () => {
    const router = useRouter();
    const { courseId } = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState('playlist');
    const [isFavorite, setIsFavorite] = useState(false);

    const { data: courseData, isLoading, error } = useCoursePreview(courseId, true);

    const course = courseData?.course;
    const learningUnits = courseData?.learning_units || [];

    const getUnitStatusIcon = (unit) => {
        const status = unit?.user_status?.status;
        if (status === 'completed') {
            return { name: 'checkmark-circle', color: '#10B981' };
        }
        if (status === 'in_progress') {
            return { name: 'play-circle', color: '#F59E0B' };
        }
        return { name: 'play-circle-outline', color: '#9CA3AF' };
    };

    const handlePlayCourse = () => {
        if (learningUnits.length > 0) {
            const firstUnit = learningUnits[0];
            router.push({
                pathname: `/courses/${courseId}/player`,
                params: {
                    unitId: firstUnit.id,
                    scoId: firstUnit.first_sco?.uuid,
                },
            });
        }
    };

    const handlePlayUnit = (unit) => {
        router.push({
            pathname: `/courses/${courseId}/player`,
            params: {
                unitId: unit.id,
                scoId: unit.first_sco?.uuid,
            },
        });
    };

    const renderUnitItem = ({ item, index }) => {
        const statusIcon = getUnitStatusIcon(item);
        const progressPercentage = item.user_status?.progress_percentage || 0;

        return (
            <TouchableOpacity
                style={styles.unitItem}
                onPress={() => handlePlayUnit(item)}
                activeOpacity={0.7}
            >
                <View style={styles.unitNumber}>
                    <Text style={styles.unitNumberText}>{index + 1}</Text>
                </View>
                <View style={styles.unitInfo}>
                    <Text style={styles.unitTitle} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <View style={styles.unitMeta}>
                        <Ionicons name="time-outline" size={14} color="#666" />
                        <Text style={styles.unitMetaText}>{item.user_status?.time_spent || '00:00:00'}</Text>
                        {progressPercentage > 0 && (
                            <>
                                <View style={styles.metaDivider} />
                                <Text style={styles.progressText}>{progressPercentage}% complete</Text>
                            </>
                        )}
                    </View>
                </View>
                <Ionicons name={statusIcon.name} size={28} color={statusIcon.color} />
            </TouchableOpacity>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading course...</Text>
            </View>
        );
    }

    if (!course) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
                <Text style={styles.errorText}>Course not found</Text>
            </View>
        );
    }

    const progressPercentage = course.user_status?.progress_percentage || 0;
    const completedUnits = course.user_status?.completed_units || 0;
    const totalUnits = course.user_status?.total_units || learningUnits.length;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>
                    Course Overview
                </Text>
                <TouchableOpacity
                    onPress={() => setIsFavorite(!isFavorite)}
                    style={styles.favoriteButton}
                >
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={24}
                        color={isFavorite ? '#E76F51' : '#1A1A1A'}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Course Image and Player Controls */}
                <MotiView
                    from={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 400 }}
                    style={styles.playerSection}
                >
                    <View style={styles.imageContainer}>
                        {course.image ? (
                            <Image source={{ uri: course.image }} style={styles.courseImage} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Ionicons name="book-outline" size={64} color="#ccc" />
                            </View>
                        )}

                        {/* Play Overlay */}
                        <View style={styles.playOverlay}>
                            <TouchableOpacity style={styles.playButton} onPress={handlePlayCourse}>
                                <Ionicons name="play" size={32} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {/* Progress Bar */}
                        {progressPercentage > 0 && (
                            <View style={styles.progressBar}>
                                <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
                            </View>
                        )}
                    </View>

                    {/* Course Title */}
                    <Text style={styles.courseTitle}>{course.name}</Text>

                    {/* Course Meta */}
                    <View style={styles.courseMeta}>
                        <View style={styles.metaItem}>
                            <Ionicons name="bar-chart-outline" size={16} color="#666" />
                            <Text style={styles.metaText}>
                                {completedUnits}/{totalUnits} units
                            </Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="time-outline" size={16} color="#666" />
                            <Text style={styles.metaText}>{course.duration?.formatted || '0m'}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Ionicons name="language-outline" size={16} color="#666" />
                            <Text style={styles.metaText}>{course.language?.toUpperCase()}</Text>
                        </View>
                    </View>
                </MotiView>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'playlist' && styles.activeTab]}
                        onPress={() => setActiveTab('playlist')}
                    >
                        <Text style={[styles.tabText, activeTab === 'playlist' && styles.activeTabText]}>
                            Playlist
                        </Text>
                        <View style={styles.tabBadge}>
                            <Text style={styles.tabBadgeText}>{learningUnits.length}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'description' && styles.activeTab]}
                        onPress={() => setActiveTab('description')}
                    >
                        <Text style={[styles.tabText, activeTab === 'description' && styles.activeTabText]}>
                            Descriptions
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Tab Content */}
                {activeTab === 'playlist' ? (
                    <View style={styles.playlistContainer}>
                        {learningUnits.length > 0 ? (
                            <FlatList
                                data={learningUnits}
                                renderItem={renderUnitItem}
                                keyExtractor={(item) => item.id.toString()}
                                scrollEnabled={false}
                                contentContainerStyle={styles.unitsList}
                            />
                        ) : (
                            <View style={styles.emptyState}>
                                <Ionicons name="folder-open-outline" size={48} color="#ccc" />
                                <Text style={styles.emptyText}>No learning units available</Text>
                            </View>
                        )}
                    </View>
                ) : (
                    <View style={styles.descriptionContainer}>
                        {course.description ? (
                            <Text style={styles.descriptionText}>{course.description}</Text>
                        ) : (
                            <Text style={styles.emptyText}>No description available</Text>
                        )}

                        {/* Course Stats */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>{progressPercentage}%</Text>
                                <Text style={styles.statLabel}>Progress</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>{course.user_status?.score || '-'}</Text>
                                <Text style={styles.statLabel}>Score</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Text style={styles.statValue}>
                                    {course.user_status?.time_spent || '00:00:00'}
                                </Text>
                                <Text style={styles.statLabel}>Time Spent</Text>
                            </View>
                        </View>

                        {/* Additional Info */}
                        {course.prerequisites && (
                            <View style={styles.infoSection}>
                                <Text style={styles.infoTitle}>Prerequisites</Text>
                                <Text style={styles.infoText}>{course.prerequisites}</Text>
                            </View>
                        )}

                        {course.skills && course.skills.length > 0 && (
                            <View style={styles.infoSection}>
                                <Text style={styles.infoTitle}>Skills You'll Learn</Text>
                                <View style={styles.skillsContainer}>
                                    {course.skills.map((skill, index) => (
                                        <View key={index} style={styles.skillChip}>
                                            <Text style={styles.skillText}>{skill}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            {/* Floating Action Button */}
            {learningUnits.length > 0 && (
                <TouchableOpacity style={styles.fab} onPress={handlePlayCourse}>
                    <Ionicons name="play" size={24} color="#fff" />
                    <Text style={styles.fabText}>
                        {progressPercentage > 0 ? 'Resume' : 'Start'} Course
                    </Text>
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F4F2',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7F4F2',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7F4F2',
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
        textAlign: 'center',
        marginHorizontal: 16,
    },
    favoriteButton: {
        padding: 4,
    },
    scrollView: {
        flex: 1,
    },
    playerSection: {
        padding: 20,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 220,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#F0F0F0',
        marginBottom: 16,
    },
    courseImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(231, 111, 81, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    progressBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#E76F51',
    },
    courseTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 12,
        lineHeight: 32,
    },
    courseMeta: {
        flexDirection: 'row',
        gap: 20,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    tabsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 12,
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        backgroundColor: '#fff',
        gap: 8,
    },
    activeTab: {
        backgroundColor: '#1A2A3A',
    },
    tabText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#666',
    },
    activeTabText: {
        color: '#fff',
    },
    tabBadge: {
        backgroundColor: '#E76F51',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    tabBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },
    playlistContainer: {
        paddingHorizontal: 20,
        paddingBottom: 160, // Space for FAB (56px) + tab bar (70px) + spacing (34px)
    },
    unitsList: {
        gap: 12,
        paddingBottom: 5,
    },
    unitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    unitNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    unitNumberText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1976D2',
    },
    unitInfo: {
        flex: 1,
    },
    unitTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    unitMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    unitMetaText: {
        fontSize: 12,
        color: '#666',
    },
    metaDivider: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#ccc',
    },
    progressText: {
        fontSize: 12,
        color: '#10B981',
        fontWeight: '600',
    },
    descriptionContainer: {
        paddingHorizontal: 20,
        paddingBottom: 160, // Space for FAB (56px) + tab bar (70px) + spacing (34px)
    },
    descriptionText: {
        fontSize: 15,
        color: '#333',
        lineHeight: 24,
        marginBottom: 24,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1A2A3A',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    infoSection: {
        marginBottom: 24,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillChip: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    skillText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1976D2',
    },
    emptyState: {
        paddingVertical: 60,
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 12,
        fontSize: 14,
        color: '#999',
    },
    fab: {
        position: 'absolute',
        bottom: 94, // Tab bar height (70px) + extra spacing (24px)
        left: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E76F51',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 28,
        gap: 8,
        shadowColor: '#E76F51',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
    },
    fabText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});

export default CourseDetailScreen;
