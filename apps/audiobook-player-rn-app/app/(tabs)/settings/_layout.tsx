import {Stack} from "expo-router"

export const unstable_settings = {
    initialRouteName: 'index',
};

export default function Layout() {
    return (
        <Stack initialRouteName="index">
            <Stack.Screen name={"index"} options={{headerShown: false}}/>
        </Stack>
    );
}
