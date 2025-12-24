module.exports = {
    preset: 'jest-expo',
    verbose: true,
    transformIgnorePatterns: [
        "node_modules/(?!(react-native" +
        "|@react-native" +
        "|expo(nent)?" +
        "|react-redux" +
        "|expo-router" +
        "|@expo" +
        "|@testing-library" +
        "|react-native-svg" +
        "|react-native-reanimated" +
        "|react-native-gesture-handler" +
        "|expo-modules-core" +
        "|immer" +
        "|expo-localization" +
        "|expo-constants" +
        "|@react-navigation" +
        "|expo-asset" +
        "|expo-linking" +
        "|react-native-toast-message" +
        "|react-native-track-player-v5" +
        "|react-native-track-player-v4" +
        "|expo-status-bar" +
        "|expo-font" +
        ")/)",
    ],
    setupFiles: ["<rootDir>/jestSetup.js"]
};
