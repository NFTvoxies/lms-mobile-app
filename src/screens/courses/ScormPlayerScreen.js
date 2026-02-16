import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { useCoursePreview } from '../../hooks/api/courses/useCoursePreview';

const ScormPlayerScreen = () => {
    const router = useRouter();
    const { courseId, unitId, scoId } = useLocalSearchParams();
    const webViewRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    const { data: courseData } = useCoursePreview(courseId, true);

    const learningUnits = courseData?.learning_units || [];
    const currentUnitIndex = learningUnits.findIndex((u) => u.id.toString() === unitId);
    const currentUnit = learningUnits[currentUnitIndex];
    const currentSco = currentUnit?.scos?.find((s) => s.uuid === scoId) || currentUnit?.first_sco;

    const handleClose = () => {
        router.back();
    };

    const handlePrevious = () => {
        if (currentUnitIndex > 0) {
            const prevUnit = learningUnits[currentUnitIndex - 1];
            router.replace({
                pathname: `/courses/${courseId}/player`,
                params: {
                    unitId: prevUnit.id,
                    scoId: prevUnit.first_sco?.uuid,
                },
            });
        }
    };

    const handleNext = () => {
        if (currentUnitIndex < learningUnits.length - 1) {
            const nextUnit = learningUnits[currentUnitIndex + 1];
            router.replace({
                pathname: `/courses/${courseId}/player`,
                params: {
                    unitId: nextUnit.id,
                    scoId: nextUnit.first_sco?.uuid,
                },
            });
        }
    };

    // SCORM API Bridge - Inject JavaScript for SCORM communication
    const scormApiScript = `
    window.API = {
      LMSInitialize: function(param) {
        console.log('SCORM: LMSInitialize', param);
        return "true";
      },
      LMSFinish: function(param) {
        console.log('SCORM: LMSFinish', param);
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'scorm_finish',
          data: {}
        }));
        return "true";
      },
      LMSGetValue: function(element) {
        console.log('SCORM: LMSGetValue', element);
        
        // Return default values for common SCORM elements
        if (element === 'cmi.core.student_id') return '${courseData?.metadata?.user_authenticated ? 'user_id' : 'guest'}';
        if (element === 'cmi.core.student_name') return 'Student';
        if (element === 'cmi.core.lesson_status') return 'not attempted';
        if (element === 'cmi.core.lesson_mode') return 'normal';
        
        return "";
      },
      LMSSetValue: function(element, value) {
        console.log('SCORM: LMSSetValue', element, value);
        
        // Track important SCORM data changes
        if (element === 'cmi.core.lesson_status' || 
            element === 'cmi.core.score.raw' ||
            element === 'cmi.core.session_time') {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'scorm_set_value',
            element: element,
            value: value
          }));
        }
        
        return "true";
      },
      LMSCommit: function(param) {
        console.log('SCORM: LMSCommit', param);
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'scorm_commit',
          data: {}
        }));
        return "true";
      },
      LMSGetLastError: function() {
        return "0";
      },
      LMSGetErrorString: function(errorCode) {
        return "No error";
      },
      LMSGetDiagnostic: function(errorCode) {
        return "No error";
      }
    };
    
    // Also support SCORM 2004 API
    window.API_1484_11 = window.API;
    
    true; // Return true to indicate script executed successfully
  `;

    const handleMessage = (event) => {
        try {
            const message = JSON.parse(event.nativeEvent.data);
            console.log('SCORM Message:', message);

            if (message.type === 'scorm_set_value') {
                console.log(`SCORM Value Set: ${message.element} = ${message.value}`);

                // Update progress based on SCORM data
                if (message.element === 'cmi.core.score.raw') {
                    const score = parseInt(message.value, 10);
                    if (!isNaN(score)) {
                        setProgress(score);
                    }
                }
            }

            if (message.type === 'scorm_finish') {
                console.log('SCORM Content Finished');
                // Could auto-navigate to next unit here if desired
            }
        } catch (err) {
            console.error('Error parsing SCORM message:', err);
        }
    };

    const handleLoadEnd = () => {
        setLoading(false);
    };

    const handleError = (syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.error('WebView error:', nativeEvent);
        setError('Failed to load SCORM content');
        setLoading(false);
    };

    if (!currentSco || !currentSco.preview_data) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={64} color="#ccc" />
                <Text style={styles.errorText}>Content not available</Text>
                <TouchableOpacity onPress={handleClose} style={styles.backToCoursesButton}>
                    <Text style={styles.backToCoursesText}>Back to Course</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Build the SCORM player URL
    const previewTrackUrl = currentSco.preview_data.preview_track_url;
    const baseUrl = 'https://learn.ideo-cloud.ma';
    const scormUrl = baseUrl + previewTrackUrl;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Top Navigation Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <Ionicons name="close" size={25} color="#fff" />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                    <Text style={styles.topBarTitle} numberOfLines={1}>
                        {currentUnit?.title || 'Learning Unit'}
                    </Text>
                    <Text style={styles.topBarSubtitle}>
                        {currentUnitIndex + 1} / {learningUnits.length}
                    </Text>
                </View>

                <TouchableOpacity onPress={() => { }} style={styles.menuButton}>
                    <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Progress Indicator */}
            {progress > 0 && (
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { width: `${progress}%` }]} />
                </View>
            )}

            {/* SCORM WebView */}
            <View style={styles.webViewContainer}>
                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#E76F51" />
                        <Text style={styles.loadingText}>Loading content...</Text>
                    </View>
                )}

                {error ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle-outline" size={64} color="#E74C3C" />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity onPress={() => setError(null)} style={styles.retryButton}>
                            <Text style={styles.retryButtonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <WebView
                        ref={webViewRef}
                        source={{ uri: scormUrl }}
                        style={styles.webView}
                        injectedJavaScriptBeforeContentLoaded={scormApiScript}
                        onMessage={handleMessage}
                        onLoadEnd={handleLoadEnd}
                        onError={handleError}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        mixedContentMode="always"
                        allowFileAccess={true}
                        allowUniversalAccessFromFileURLs={true}
                        originWhitelist={['*']}
                        mediaPlaybackRequiresUserAction={false}
                    />
                )}
            </View>

            {/* Bottom Navigation */}
            {/* <View style={styles.bottomBar}>
                <TouchableOpacity
                    onPress={handlePrevious}
                    style={[styles.navButton, currentUnitIndex === 0 && styles.navButtonDisabled]}
                    disabled={currentUnitIndex === 0}
                >
                    <Ionicons
                        name="chevron-back"
                        size={24}
                        color={currentUnitIndex === 0 ? '#999' : '#fff'}
                    />
                    <Text
                        style={[styles.navButtonText, currentUnitIndex === 0 && styles.navButtonTextDisabled]}
                    >
                        Previous
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleNext}
                    style={[
                        styles.navButton,
                        currentUnitIndex === learningUnits.length - 1 && styles.navButtonDisabled,
                    ]}
                    disabled={currentUnitIndex === learningUnits.length - 1}
                >
                    <Text
                        style={[
                            styles.navButtonText,
                            currentUnitIndex === learningUnits.length - 1 && styles.navButtonTextDisabled,
                        ]}
                    >
                        Next
                    </Text>
                    <Ionicons
                        name="chevron-forward"
                        size={24}
                        color={currentUnitIndex === learningUnits.length - 1 ? '#999' : '#fff'}
                    />
                </TouchableOpacity>
            </View> */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#1A2A3A',
    },
    closeButton: {
        padding: 4,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 16,
    },
    topBarTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    topBarSubtitle: {
        fontSize: 12,
        color: '#B0B0B0',
        marginTop: 2,
    },
    menuButton: {
        padding: 4,
    },
    progressContainer: {
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#E76F51',
    },
    webViewContainer: {
        flex: 1,
        position: 'relative',
    },
    webView: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
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
        backgroundColor: '#fff',
        padding: 20,
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#E76F51',
        borderRadius: 24,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    backToCoursesButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#1A2A3A',
        borderRadius: 24,
    },
    backToCoursesText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#1A2A3A',
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    navButtonDisabled: {
        opacity: 0.4,
    },
    navButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    navButtonTextDisabled: {
        color: '#999',
    },
});

export default ScormPlayerScreen;
