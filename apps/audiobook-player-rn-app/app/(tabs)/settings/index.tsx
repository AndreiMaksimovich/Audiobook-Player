import {StyleSheet, View} from 'react-native';
import AppScreenView from "@/src/views/AppScreenView";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/src/store";
import {setLocalizationLanguageCode} from "@/src/store/Settings";
import {Picker} from "@react-native-picker/picker";
import {SupportedLanguages} from "@/src/localization/Localization";
import {VStackView} from "@/src/views/VStackView";
import {HStackView} from "@/src/views/HStackView";
import {ThemedText} from "@/src/views/ThemedText";
import SpacerView from "@/src/views/SpacerView";

export default function HomeScreen() {
    const {t} = useTranslation()
    const dispatch = useDispatch()
    const settings = useSelector((state: RootState)=> state.settings)

    const languages = Array.from(SupportedLanguages.values())

    return (
        <AppScreenView title={t("Settings")}>

            <SpacerView size={10}/>

            <VStackView>
                <HStackView alignItems={"center"}>
                    <View style={{flex: 1}}>
                        <ThemedText type={"defaultSemiBold"}>{t("Language")}</ThemedText>
                    </View>
                    <View style={{flex: 1}}>
                        <Picker
                            selectedValue={settings.localizationLanguageCode}
                            onValueChange={(itemValue, itemIndex) => {
                                dispatch(setLocalizationLanguageCode(itemValue))
                            }}
                        >
                            {languages.map(language => (
                                <Picker.Item key={language.code} label={language.name} value={language.code}/>
                            ))}
                        </Picker>
                    </View>

                </HStackView>

            </VStackView>

        </AppScreenView>
    );
}

const styles = StyleSheet.create({

});
