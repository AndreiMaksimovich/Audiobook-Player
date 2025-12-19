import {Audiobook} from "shared";
import {VStackView} from "@/src/views/VStackView";
import {HStackView} from "@/src/views/HStackView";
import {ThemedText} from "@/src/views/ThemedText";
import AudiobookIconView from "@/src/views/AudiobookIconView";
import AuthorLinkView from "@/src/views/AuthorLinkView";
import ReaderLinkView from "@/src/views/ReaderLinkView";
import {AudiobookLinkView} from "@/src/views/AudiobookLinkView";
import {useTranslation} from "react-i18next";
import {Pressable, StyleSheet, View} from "react-native";
import HSplitterView from "@/src/views/HSplitterView";
import {useState} from "react";
import OfflineAudiobookRemovalConfirmationModal from "./OfflineAudiobookRemovalConfirmationModal";
import {useDispatch} from "react-redux";
import {removeOfflineAudiobook} from "@/src/store/Actions";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export interface AudiobookListElementViewProps {
    audiobook: Audiobook,
    mode?: 'online' | 'offline';
}

export function AudiobookListElementView(props: AudiobookListElementViewProps) {
    const {t} = useTranslation()
    const {audiobook} = props;
    const dispatch = useDispatch();

    const [isRemovalConfirmationVisible, setIsRemovalConfirmationVisible] = useState<boolean>(false);

    function handleRemovalConfirmation(remove: boolean) {
        setIsRemovalConfirmationVisible(false);
        if (remove) {
            dispatch(removeOfflineAudiobook(audiobook.id))
        }
    }

    function deleteOfflineAudiobook() {
        setIsRemovalConfirmationVisible(true);
    }

    return (
        <VStackView>
            <HStackView alignItems={"center"} style={{padding: 5}}>
                <AudiobookLinkView mode={props.mode} audiobookId={audiobook.id}>
                    <View style={styles.audiobookIconContainer}>
                        <AudiobookIconView audiobook={audiobook} width={50} height={75}/>
                    </View>
                </AudiobookLinkView>
                <VStackView style={{maxWidth: "80%"}}>
                    <AudiobookLinkView audiobookId={audiobook.id}>
                        <ThemedText type={"subtitle"}>{audiobook.title}</ThemedText>
                    </AudiobookLinkView>
                    {audiobook.authors && audiobook.authors.length > 0 && (
                        <HStackView alignItems={"center"}>
                            <ThemedText type={"defaultSemiBold"}>{t("Author")}: </ThemedText>
                            {audiobook.authors.map(author => (<AuthorLinkView author={author} key={author.id}/>))}
                        </HStackView>
                    )}
                    {audiobook.readers && audiobook.readers.length > 0 && (
                        <HStackView alignItems={"center"}>
                            <ThemedText type={"defaultSemiBold"}>{t("Reader")}: </ThemedText>
                            {audiobook.readers.map(reader => (<ReaderLinkView reader={reader} key={reader.id}/>))}
                        </HStackView>
                    )}
                </VStackView>
                {props.mode === 'offline' && (
                    <>
                        <View style={{position: 'absolute', top: 5, right: 5}}>
                            <Pressable onPress={deleteOfflineAudiobook}>
                                <MaterialIcons name="cancel" size={36} color="black"/>
                            </Pressable>
                        </View>
                        <OfflineAudiobookRemovalConfirmationModal audiobook={audiobook} isVisible={isRemovalConfirmationVisible} onResult={handleRemovalConfirmation} />
                    </>
                )}
            </HStackView>
            <HSplitterView/>
        </VStackView>
    )
}

const styles = StyleSheet.create({
    audiobookIconContainer: {boxShadow: '3px 3px 5px rgba(0, 0, 0, 0.3)', margin: 5}
});
