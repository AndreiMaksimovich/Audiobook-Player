import {Button, StyleSheet, View} from 'react-native';
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
import {appFileStorage, AppFileStorageFileType} from "@/src/app-file-storage";
import {useState} from "react";
import useIsStandaloneApp from "@/src/hooks/use-is-standalone-app";
import {toasts, ToastType} from "@/src/toasts";

async function debugPrintFileStorageTree() {
    async function print(path: string, prefix: string) {
        const contents = await appFileStorage.list(path);
        for (const file of contents) {
            // console.log(`${prefix}${file.name}`);
            console.log(`${file.path}`);
            if (file.type === AppFileStorageFileType.Directory) {
                await print(file.path, `${prefix} > `);
            }
        }
    }

    await print("", "--")
}

export default function HomeScreen() {
    const offlineAudiobooksState = useSelector((state: RootState) => state.offlineAudiobooks)
    const {t} = useTranslation()
    const dispatch = useDispatch()
    const settings = useSelector((state: RootState) => state.settings)
    const languages = Array.from(SupportedLanguages.values()).map(language => {
        return {value: language.code, label: language.name}
    })
    const [error, setError] = useState<any>(false);

    const isStandalone = useIsStandaloneApp()

    async function clearFileStorage() {
        await appFileStorage.clear();
    }

    async function test() {

    }

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

                <ThemedText>Is standalone: {isStandalone ? "true" : "false"}</ThemedText>

            </VStackView>

            <View style={styles.testButtonContainer}>
                <Button title={"Test Toast Info"}
                        onPress={() => toasts.show(ToastType.Info, 'Info Message Info Message Info Message Info Message')}/>
            </View>

            <View style={styles.testButtonContainer}>
                <Button title={"Test Toast Success"}
                        onPress={() => toasts.show(ToastType.Success, 'Success Message Success Message Success Message')}/>
            </View>

            <View style={styles.testButtonContainer}>
                <Button title={"Test Toast Error"}
                        onPress={() => toasts.show(ToastType.Error, 'Error Message Error Message Error Message Error Message')}/>
            </View>

            {/*<View style={styles.testButtonContainer}>*/}
            {/*    <Button title={"Test"} onPress={test}/>*/}
            {/*</View>*/}

            {/*<View style={styles.testButtonContainer}>*/}
            {/*    <Button title={"Print File Tree"} onPress={debugPrintFileStorageTree}/>*/}
            {/*</View>*/}

            {/*<View style={styles.testButtonContainer}>*/}
            {/*    <Button title={"Clear"} onPress={clearFileStorage}/>*/}
            {/*</View>*/}

            {/*{error && (<HumanReadableErrorView error={error} showRetryButton={true} onRetryButtonClick={test}/>)}*/}

            {/*<ThemedText type={"subtitle"}>Offline Audiobooks</ThemedText>*/}
            {/*{offlineAudiobooksState.offlineAudiobooks.map(offlineAudiobook => (<ThemedText key={offlineAudiobook.id} type={"default"}>{offlineAudiobook.title}</ThemedText>))}*/}

            {/*<ThemedText type={"subtitle"}>Download Tasks</ThemedText>*/}
            {/*{offlineAudiobooksState.downloadTasks.map(task => (<ThemedText key={task.audiobook.id} type={"default"}>{task.audiobook.title}</ThemedText>))}*/}

            {/*<ThemedText type={"subtitle"}>Active Download Task</ThemedText>*/}
            {/*{offlineAudiobooksState.activeDownloadTask && (<ThemedText type={"default"}>{offlineAudiobooksState.activeDownloadTask.audiobook.title} - {offlineAudiobooksState.activeDownloadTask.progress}</ThemedText>)}*/}

        </AppScreenView>
    );
}

const styles = StyleSheet.create({
    testButtonContainer: {
        padding: 5,
    }
});
