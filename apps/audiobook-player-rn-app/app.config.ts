import 'tsx/cjs';
import {config} from 'dotenv'
config()

module.exports = () => {
    const profile = process.env.PROFILE  ?? "development"
    const API_URL = process.env.API_URL ?? process.env[`API_URL_${profile.toUpperCase()}`]
    console.log(API_URL)
    return {
        expo: {
            name: "audiobook-player-rn-app",
            slug: "audiobook-player-rn-app",
            version: "0.1.0",
            orientation: "portrait",
            icon: "./assets/images/icon.png",
            scheme: "audiobook-player",
            userInterfaceStyle: "automatic",
            newArchEnabled: true,
            web: {
                output: "static",
                favicon: "./assets/images/favicon.png"
            },
            android: {
                package: "com.amaxsoftware.audiobookplayerdemo",
            },
            ios: {
                supportsTablet: true,
                bundleIdentifier: "com.amaxsoftware.audiobookplayerdemo",
                infoPlist: {
                    UIBackgroundModes: [
                        "audio"
                    ],
                    "ITSAppUsesNonExemptEncryption": false
                }
            },
            plugins: [
                "expo-router",
                "expo-localization",
                "expo-web-browser"
            ],
            experiments: {
                typedRoutes: true,
                reactCompiler: true,
            },
            extra: {
                API_URL: API_URL,
                eas: {
                    projectId: process.env.EAS_PROJECT_ID,
                },
            }
        }
    }
}
