import {Audiobook} from "shared";
import {VStack} from "@/src/components/common/VStack";
import {HStack} from "@/src/components/common/HStack";
import {ThemedText} from "@/src/components/common/ThemedText";
import AudiobookIcon from "@/src/components/app/AudiobookIcon";
import AuthorLink from "@/src/components/app/AuthorLink";
import ReaderLink from "@/src/components/app/ReaderLink";
import {AudiobookLink} from "@/src/components/app/AudiobookLink";
import {useTranslation} from "react-i18next";
import {Pressable, StyleSheet, View} from "react-native";
import HSplitter from "@/src/components/common/HSplitter";
import {useState} from "react";
import OfflineAudiobookRemovalConfirmationModal from "./OfflineAudiobookRemovalConfirmationModal";
import {useDispatch} from "react-redux";
import {removeOfflineAudiobook} from "@/src/store/Actions";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export interface AudiobookListElementProps {
    audiobook: Audiobook,
    mode?: 'online' | 'offline';
}

export function AudiobookListElement(props: AudiobookListElementProps) {
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
        <VStack>
            <HStack alignItems={"center"} style={{padding: 5}}>
                <AudiobookLink mode={props.mode} audiobookId={audiobook.id}>
                    <View style={styles.audiobookIconContainer}>
                        <AudiobookIcon audiobook={audiobook} width={50} height={75}/>
                    </View>
                </AudiobookLink>
                <VStack style={{maxWidth: "80%"}}>
                    <AudiobookLink audiobookId={audiobook.id}>
                        <ThemedText type={"subtitle"}>{audiobook.title}</ThemedText>
                    </AudiobookLink>
                    {audiobook.authors && audiobook.authors.length > 0 && (
                        <HStack alignItems={"center"}>
                            <ThemedText type={"defaultSemiBold"}>{t("Author")}: </ThemedText>
                            {audiobook.authors.map(author => (<AuthorLink author={author} key={author.id}/>))}
                        </HStack>
                    )}
                    {audiobook.readers && audiobook.readers.length > 0 && (
                        <HStack alignItems={"center"}>
                            <ThemedText type={"defaultSemiBold"}>{t("Reader")}: </ThemedText>
                            {audiobook.readers.map(reader => (<ReaderLink reader={reader} key={reader.id}/>))}
                        </HStack>
                    )}
                </VStack>
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
            </HStack>
            <HSplitter/>
        </VStack>
    )
}

const styles = StyleSheet.create({
    audiobookIconContainer: {boxShadow: '3px 3px 5px rgba(0, 0, 0, 0.3)', margin: 5}
});
