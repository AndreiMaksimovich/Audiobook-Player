import {Stack} from "expo-router"
import {useTranslation} from "react-i18next";

export const unstable_settings = {
    initialRouteName: 'index',
};

export default function Layout() {
    const {t} = useTranslation();

    return (
        <Stack initialRouteName="index">
            <Stack.Screen name={"index"} options={{title: t('Tab.Library'), headerShown: false}}/>
            <Stack.Screen name={"author/[author_id]"} options={{title: "", headerShown: true}}/>
            <Stack.Screen name={"reader/[reader_id]"} options={{title: "", headerShown: true}}/>
            <Stack.Screen name={"category/[category_id]"} options={{title: "", headerShown: true}}/>
            <Stack.Screen name={"tag/[tag_id]"} options={{title: "", headerShown: true}}/>
            <Stack.Screen name={"audiobook/[audiobook_id]"} options={{title: "", headerShown: true}}/>
        </Stack>
    );
}
