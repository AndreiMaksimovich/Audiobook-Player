import {Stack} from "expo-router"
import {useTranslation} from "react-i18next";

export const unstable_settings = {
    initialRouteName: 'index',
};

export default function Layout() {

    const { t } = useTranslation();

    return (
        <Stack initialRouteName="index">
            <Stack.Screen name={"index"} options={{headerShown: false}}/>
            <Stack.Screen name={"authors"} options={{title: t("Authors"), headerShown: true}}/>
            <Stack.Screen name={"readers"} options={{title: t("Readers"), headerShown: true}}/>
            <Stack.Screen name={"audiobooks"} options={{title: t("Audiobooks"), headerShown: true}}/>
            <Stack.Screen name={"author/[author_id]"} options={{title: "", headerShown: true}}/>
            <Stack.Screen name={"reader/[reader_id]"} options={{title: "", headerShown: true}}/>
            <Stack.Screen name={"category/[category_id]"} options={{title: "", headerShown: true}}/>
            <Stack.Screen name={"tag/[tag_id]"} options={{title: "", headerShown: true}}/>
            <Stack.Screen name={"audiobook/[audiobook_id]"} options={{title: "", headerShown: true}}/>
        </Stack>
    );
}
