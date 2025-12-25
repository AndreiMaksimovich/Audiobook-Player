import {View} from 'react-native';
import AppScreen from "@/src/components/screens/AppScreen";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {setLocalizationLanguageCode} from "@/src/store/Settings";
import {SupportedLanguages} from "@/src/localization/Localization";
import {VStack} from "@/src/components/common/VStack";
import {HStack} from "@/src/components/common/HStack";
import {ThemedText} from "@/src/components/common/ThemedText";
import Spacer from "@/src/components/common/Spacer";
import SimplePicker from "@/src/components/common/SimplePicker";

export default function HomeScreen() {
    const {t} = useTranslation()
    const dispatch = useDispatch()
    const settings = useSelector((state: RootState) => state.settings)
    const languages = Array.from(SupportedLanguages.values()).map(language => {
        return {value: language.code, label: language.name}
    })

    return (
        <AppScreen title={t("Settings")} testID={'Screen.Settings'}>

            <Spacer size={10}/>

            <VStack>

                {/* Language */}
                <HStack alignItems={"center"}>

                    <View style={{flex: 1}}>
                        <ThemedText type={"defaultSemiBold"}>{t("Language")}</ThemedText>
                    </View>

                    <View testID={'LanguagePicker'} style={{flex: 1}}>
                        <SimplePicker
                            items={languages}
                            selectedValue={settings.localizationLanguageCode}
                            onSelectionChanged={(code) => dispatch(setLocalizationLanguageCode(code))}/>
                    </View>

                </HStack>

            </VStack>

        </AppScreen>
    );
}
