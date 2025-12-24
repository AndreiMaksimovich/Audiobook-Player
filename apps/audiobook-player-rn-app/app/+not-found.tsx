import AppScreen from "@/src/components/screens/AppScreen";
import {useTranslation} from "react-i18next";
import {ThemedText} from "@/src/components/common/ThemedText";
import {Link} from "expo-router";
import {HStack} from "@/src/components/common/HStack";
import Spacer from "@/src/components/common/Spacer";

export default function HomeScreen() {
    const {t} = useTranslation()

    return (
        <AppScreen>
            <Spacer size={50}/>
            <ThemedText type={"title"} style={{textAlign: "center"}}>{t("Error404")}</ThemedText>
            <ThemedText type={"subtitle"} style={{textAlign: "center"}}>{t("PageNotFound")}</ThemedText>
            <HStack justifyContent={"center"}>
                <Link href={"/(tabs)/(catalog)"}>
                    <ThemedText type={"linkSemiBold"}>{t("HomePage")}</ThemedText>
                </Link>
            </HStack>

        </AppScreen>
    );
}
