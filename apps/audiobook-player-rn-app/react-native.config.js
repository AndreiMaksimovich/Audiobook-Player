module.exports = {
    dependencies: {
        // Android/iOS TrackPlayer
        'react-native-track-player-v5': {
            platforms: {
                web: null, // Exclude from Web
            },
        },
        // Web TrackPlayer
        'react-native-track-player-v4': {
            platforms: {
                android: null, // Exclude from Android
                ios: null,     // Exclude from iOS
            },
        },

        // Web toasts messages
        'react-hot-toast': {
            platforms: {
                android: null,
                ios: null,
            }
        },
        // Android/iOS toast messages
        'react-native-toast-message': {
            platforms: {
                web: null,
            }
        }
    },
};
