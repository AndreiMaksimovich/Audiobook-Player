import {Stack} from "expo-router"
import {useTranslation} from "react-i18next";

export const unstable_settings = {
    initialRouteName: 'index',
};

export default function Layout() {
    const {t} = useTranslation();

    return (
        <Stack initialRouteName="index">
            <Stack.Screen name={"index"} options={{title: t('Tab.Search'), headerShown: false}}/>
        </Stack>
    );
}
