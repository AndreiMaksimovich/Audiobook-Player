import {JSX, useLayoutEffect} from "react";
import {StyleSheet, View} from "react-native"
import {ThemedText} from "@/src/components/common/ThemedText";
import AudiobookIcon from "@/src/components/app/AudiobookIcon";
import AuthorLink from "@/src/components/app/AuthorLink";
import ReaderLink from "@/src/components/app/ReaderLink";
import TagLink from "@/src/components/app/TagLink";
import CategoryLink from "@/src/components/app/CategoryLink";
import AudiobookPlayerPanel from "@/src/components/app/AudiobookPlayerPanel";
import AudiobookAudioFileRow from "@/src/components/app/AudiobookAudioFileRow";
import {Audiobook} from "shared";
import AudiobookFavoriteButton from "@/src/components/app/AudiobookFavoriteButton";
import {addRecentlyViewAudiobook} from "@/src/store/AudiobookHistory";
import {useDispatch} from "react-redux";
import {DateTimeUtils} from "@/src/utils/DateTimeUtils";
import {VStack} from "@/src/components/common/VStack";
import {HStack} from "@/src/components/common/HStack";
import Spacer from "@/src/components/common/Spacer";
import {useTranslation} from "react-i18next";
import AudiobookOfflineVersionButton from "@/src/components/app/AudiobookOfflineVersionButton";
import {useAreOfflineAudiobooksAvailable} from "@/src/store/Hooks";

export interface AudiobookViewProps {
    audiobook: Audiobook;
    mode?: "offline" | "online"
}

export default function AudiobookView(props: AudiobookViewProps): JSX.Element {
    const {audiobook} = props;
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const areOfflineAudiobooksAvailable = useAreOfflineAudiobooksAvailable()

    useLayoutEffect(() => {
        dispatch(addRecentlyViewAudiobook(audiobook));
    }, [])

    return (
        <View>
            <View>
                <ThemedText type={"title"}>{audiobook.title}</ThemedText>
                <HStack alignItems={"flex-start"}>
                    <View style={styles.audiobookIconContainer}>
                        <AudiobookIcon audiobook={audiobook}/>
                    </View>
                    <View>
                        {/* Authors */}
                        {audiobook.authors && (
                            <HStack flexWrap={"wrap"} alignItems={"center"}>
                                <ThemedText type={"defaultSemiBold"}>{t("Author")}:</ThemedText>
                                <Spacer size={5}/>
                                <VStack>
                                    {audiobook.authors.map(author => (
                                        <AuthorLink key={author.id} author={author}/>))}
                                </VStack>
                            </HStack>
                        )}
                        {/* Readers */}
                        {audiobook.readers && audiobook.readers.length > 0 && (
                            <HStack flexWrap={"wrap"} alignItems={"center"}>
                                <ThemedText type={"defaultSemiBold"}>{t("Reader")}:</ThemedText>
                                <Spacer size={5}/>
                                <VStack>
                                    {audiobook.readers.map(reader => (
                                        <ReaderLink key={reader.id} reader={reader}/>))}
                                </VStack>
                            </HStack>
                        )}
                        <HStack flexWrap={"wrap"} alignItems={"center"}>
                            <ThemedText type={"defaultSemiBold"}>{t("Duration")}:</ThemedText>
                            <Spacer size={5}/>
                            <VStack>
                                <ThemedText
                                    type={"default"}>{DateTimeUtils.formatDuration(audiobook.totalDuration)}</ThemedText>
                            </VStack>
                        </HStack>
                        {/* Tags */}
                        {audiobook.tags && audiobook.tags.length > 0 && (
                            <HStack flexWrap={"wrap"} alignItems={"center"}>
                                <ThemedText type={"defaultSemiBold"}>{t("Tags")}:</ThemedText>
                                <Spacer size={5}/>
                                <VStack>
                                    {audiobook.tags.map(tag => (<TagLink key={tag.id} tag={tag}/>))}
                                </VStack>
                            </HStack>
                        )}
                        {/* Categories  */}
                        {audiobook.categories && audiobook.categories.length > 0 && (
                            <HStack alignItems={"center"}>
                                <ThemedText type={"defaultSemiBold"}>{t("Categories")}:</ThemedText>
                                <Spacer size={5}/>
                                <VStack>
                                    {audiobook.categories.map(category => (
                                        <CategoryLink key={category.id} category={category}/>))}
                                </VStack>
                            </HStack>
                        )}
                        <HStack>
                            {areOfflineAudiobooksAvailable && (<AudiobookOfflineVersionButton audiobook={audiobook}/>)}
                            <AudiobookFavoriteButton audiobook={audiobook}/>
                        </HStack>
                    </View>
                </HStack>

                {/* Description */}
                {audiobook.description && (
                    <ThemedText type={"default"}>{audiobook.description}</ThemedText>
                )}

                {/*  Audio audio-player panel  */}
                <Spacer size={10}/>
                <AudiobookPlayerPanel mode={props.mode} audiobook={audiobook}/>
                <Spacer size={10}/>

                {/* Audio files */}
                <View>
                    {(() => {
                        let duration = 0
                        return (
                            <>
                                {audiobook.audioFiles!.map((mediaFile, index) => {
                                        duration += mediaFile.duration
                                        return (<AudiobookAudioFileRow mode={props.mode} audioFile={mediaFile} key={mediaFile.id} audiobook={audiobook} startTime={duration-mediaFile.duration} audioFileIndex={index}/>)
                                    }
                                )}
                            </>
                        )
                    })()}
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    audiobookIconContainer: {boxShadow: '4px 4px 6px rgba(0, 0, 0, 0.3)', margin: 10}
})
