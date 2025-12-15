import {StyleSheet, View} from 'react-native';
import AppScreenView from "@/src/views/AppScreenView";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {setLocalizationLanguageCode} from "@/src/store/Settings";
import {SupportedLanguages} from "@/src/localization/Localization";
import {VStackView} from "@/src/views/VStackView";
import {HStackView} from "@/src/views/HStackView";
import {ThemedText} from "@/src/views/ThemedText";
import SpacerView from "@/src/views/SpacerView";
import SimplePickerView from "@/src/views/SimplePickerView";

export default function HomeScreen() {
    const {t} = useTranslation()
    const dispatch = useDispatch()
    const settings = useSelector((state: RootState) => state.settings)
    const languages = Array.from(SupportedLanguages.values()).map(language => {
        return {value: language.code, label: language.name}
    })

    return (
        <AppScreenView title={t("Settings")}>

            <SpacerView size={10}/>

            <VStackView>

                {/* Language */}
                <HStackView alignItems={"center"}>

                    <View style={{flex: 1}}>
                        <ThemedText type={"defaultSemiBold"}>{t("Language")}</ThemedText>
                    </View>

                    <View style={{flex: 1}}>
                        <SimplePickerView
                            items={languages}
                            selectedValue={settings.localizationLanguageCode}
                            onSelectionChanged={(code) => dispatch(setLocalizationLanguageCode(code))}/>
                    </View>

                </HStackView>

            </VStackView>

        </AppScreenView>
    );
}
