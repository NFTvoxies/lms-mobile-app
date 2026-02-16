import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useOnboarding } from '../../contexts/OnboardingContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const onboardingData = [
    {
        id: '1',
        title: 'Search Online Course',
        description: 'Search for More Online School Courses Results and See What You May Be Massing',
        // Placeholder - you can replace with actual image path once available
        image: require('../../../assets/icon.png'),
    },
    {
        id: '2',
        title: 'Set Your Goal',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing facilisis, sed do eiusmod tempor',
        image: require('../../../assets/icon.png'),
    },
    {
        id: '3',
        title: 'Complete Course',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing Facilisis , sed do eiusmod tempor incididunt ut labore et dolore elieentum',
        image: require('../../../assets/icon.png'),
    },
];

const OnboardingScreen = () => {
    const router = useRouter();
    const { completeOnboarding } = useOnboarding();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);

    const handleSkip = async () => {
        await completeOnboarding();
        router.replace('/login');
    };

    const handleNext = () => {
        if (currentIndex < onboardingData.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        }
    };

    const handleGetStarted = async () => {
        await completeOnboarding();
        router.replace('/login');
    };

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 50,
    }).current;

    const renderItem = ({ item }) => (
        <View style={styles.slide}>
            <MotiView
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'timing', duration: 600 }}
                style={styles.imageContainer}
            >
                <Image source={item.image} style={styles.image} resizeMode="contain" />
            </MotiView>

            <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 600, delay: 200 }}
                style={styles.textContainer}
            >
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
            </MotiView>
        </View>
    );

    const renderPagination = () => (
        <View style={styles.paginationContainer}>
            {onboardingData.map((_, index) => (
                <MotiView
                    key={index}
                    animate={{
                        width: currentIndex === index ? 24 : 8,
                        backgroundColor: currentIndex === index ? '#6366F1' : '#D1D5DB',
                    }}
                    transition={{ type: 'timing', duration: 300 }}
                    style={styles.dot}
                />
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Skip Button */}
            {currentIndex < onboardingData.length - 1 && (
                <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>
            )}

            {/* Onboarding Slides */}
            <FlatList
                ref={flatListRef}
                data={onboardingData}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                bounces={false}
            />

            {/* Pagination Dots */}
            {renderPagination()}

            {/* Action Button */}
            <View style={styles.buttonContainer}>
                {currentIndex === onboardingData.length - 1 ? (
                    <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <MotiView
                            from={{ scale: 1 }}
                            animate={{ scale: 1.1 }}
                            transition={{
                                type: 'timing',
                                duration: 1000,
                                loop: true,
                            }}
                        >
                            <Text style={styles.nextButtonText}>→</Text>
                        </MotiView>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    skipButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        zIndex: 10,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    skipText: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },
    slide: {
        width: SCREEN_WIDTH,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingTop: 100,
    },
    imageContainer: {
        width: SCREEN_WIDTH * 0.7,
        height: SCREEN_HEIGHT * 0.4,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    buttonContainer: {
        paddingHorizontal: 30,
        paddingBottom: 50,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#6366F1',
        paddingVertical: 16,
        paddingHorizontal: 60,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    nextButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#6366F1',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
    },
});

export default OnboardingScreen;
