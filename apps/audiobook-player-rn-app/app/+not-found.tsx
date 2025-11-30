import AppScreenView from "@/src/views/AppScreenView";
import {useTranslation} from "react-i18next";
import {ThemedText} from "@/src/views/ThemedText";
import {Link} from "expo-router";
import {HStackView} from "@/src/views/HStackView";
import SpacerView from "@/src/views/SpacerView";

export default function HomeScreen() {
    const {t} = useTranslation()

    return (
        <AppScreenView>
            <SpacerView size={50}/>
            <ThemedText type={"title"} style={{textAlign: "center"}}>{t("Error404")}</ThemedText>
            <ThemedText type={"subtitle"} style={{textAlign: "center"}}>{t("PageNotFound")}</ThemedText>
            <HStackView justifyContent={"center"}>
                <Link href={"/(tabs)/(catalog)"}>
                    <ThemedText type={"linkSemiBold"}>{t("HomePage")}</ThemedText>
                </Link>
            </HStackView>

        </AppScreenView>
    );
}
