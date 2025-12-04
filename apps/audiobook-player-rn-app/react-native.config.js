module.exports = {
    dependencies: {
        'react-native-track-player-v5': {
            platforms: {
                web: null, // Exclude from Web
            },
        },
        'react-native-track-player-v4': {
            platforms: {
                android: null, // Exclude from Android
                ios: null,     // Exclude from iOS
            },
        }
    },
};
