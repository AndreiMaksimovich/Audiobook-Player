import 'tsx/cjs';

module.exports = () => {
    const environment = process.env.environment ?? "development"

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
            plugins: [
                "expo-router"
            ],
            experiments: {
                "typedRoutes": true,
                "reactCompiler": true,
            },
            extra: {
                API_URL: process.env[`API_URL_${environment.toUpperCase()}`],
            }
        }
    }
}
