import {JSX, useLayoutEffect} from "react";
import {StyleSheet, View} from "react-native"
import {ThemedText} from "@/src/views/ThemedText";
import AudiobookIconView from "@/src/views/AudiobookIconView";
import AuthorLinkView from "@/src/views/AuthorLinkView";
import ReaderLinkView from "@/src/views/ReaderLinkView";
import TagLinkView from "@/src/views/TagLinkView";
import CategoryLinkView from "@/src/views/CategoryLinkView";
import AudiobookPlayerPanelView from "@/src/views/AudiobookPlayerPanelView";
import AudiobookAudioFileRowView from "@/src/views/AudiobookAudioFileRowView";
import {Audiobook} from "shared";
import AudiobookFavoriteButtonView from "@/src/views/AudiobookFavoriteButtonView";
import {addRecentlyViewAudiobook} from "@/src/store/AudiobookHistory";
import {useDispatch} from "react-redux";
import {DateTimeUtils} from "@/src/utils/DateTimeUtils";
import {VStackView} from "@/src/views/VStackView";
import {HStackView} from "@/src/views/HStackView";
import SpacerView from "@/src/views/SpacerView";
import {useTranslation} from "react-i18next";
import AudiobookOfflineVersionButtonView from "@/src/views/AudiobookOfflineVersionButtonView";
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
                <HStackView alignItems={"flex-start"}>
                    <View style={styles.audiobookIconContainer}>
                        <AudiobookIconView audiobook={audiobook}/>
                    </View>
                    <View>
                        {/* Authors */}
                        {audiobook.authors && (
                            <HStackView flexWrap={"wrap"} alignItems={"center"}>
                                <ThemedText type={"defaultSemiBold"}>{t("Author")}:</ThemedText>
                                <SpacerView size={5}/>
                                <VStackView>
                                    {audiobook.authors.map(author => (
                                        <AuthorLinkView key={author.id} author={author}/>))}
                                </VStackView>
                            </HStackView>
                        )}
                        {/* Readers */}
                        {audiobook.readers && audiobook.readers.length > 0 && (
                            <HStackView flexWrap={"wrap"} alignItems={"center"}>
                                <ThemedText type={"defaultSemiBold"}>{t("Reader")}:</ThemedText>
                                <SpacerView size={5}/>
                                <VStackView>
                                    {audiobook.readers.map(reader => (
                                        <ReaderLinkView key={reader.id} reader={reader}/>))}
                                </VStackView>
                            </HStackView>
                        )}
                        <HStackView flexWrap={"wrap"} alignItems={"center"}>
                            <ThemedText type={"defaultSemiBold"}>{t("Duration")}:</ThemedText>
                            <SpacerView size={5}/>
                            <VStackView>
                                <ThemedText
                                    type={"default"}>{DateTimeUtils.formatDuration(audiobook.totalDuration)}</ThemedText>
                            </VStackView>
                        </HStackView>
                        {/* Tags */}
                        {audiobook.tags && audiobook.tags.length > 0 && (
                            <HStackView flexWrap={"wrap"} alignItems={"center"}>
                                <ThemedText type={"defaultSemiBold"}>{t("Tags")}:</ThemedText>
                                <SpacerView size={5}/>
                                <VStackView>
                                    {audiobook.tags.map(tag => (<TagLinkView key={tag.id} tag={tag}/>))}
                                </VStackView>
                            </HStackView>
                        )}
                        {/* Categories  */}
                        {audiobook.categories && audiobook.categories.length > 0 && (
                            <HStackView alignItems={"center"}>
                                <ThemedText type={"defaultSemiBold"}>{t("Categories")}:</ThemedText>
                                <SpacerView size={5}/>
                                <VStackView>
                                    {audiobook.categories.map(category => (
                                        <CategoryLinkView key={category.id} category={category}/>))}
                                </VStackView>
                            </HStackView>
                        )}
                        <HStackView>
                            {areOfflineAudiobooksAvailable && (<AudiobookOfflineVersionButtonView audiobook={audiobook}/>)}
                            <AudiobookFavoriteButtonView audiobook={audiobook}/>
                        </HStackView>
                    </View>
                </HStackView>

                {/* Description */}
                {audiobook.description && (
                    <ThemedText type={"default"}>{audiobook.description}</ThemedText>
                )}

                {/*  Audio audio-player panel  */}
                <SpacerView size={10}/>
                <AudiobookPlayerPanelView mode={props.mode} audiobook={audiobook}/>
                <SpacerView size={10}/>

                {/* Audio files */}
                <View>
                    {(() => {
                        let duration = 0
                        return (
                            <>
                                {audiobook.audioFiles!.map((mediaFile, index) => {
                                        duration += mediaFile.duration
                                        return (<AudiobookAudioFileRowView mode={props.mode} audioFile={mediaFile} key={mediaFile.id} audiobook={audiobook} startTime={duration-mediaFile.duration} audioFileIndex={index}/>)
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
