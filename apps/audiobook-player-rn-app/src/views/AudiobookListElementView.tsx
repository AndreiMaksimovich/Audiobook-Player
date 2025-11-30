import {Audiobook} from "shared";
import {VStackView} from "@/src/views/VStackView";
import {HStackView} from "@/src/views/HStackView";
import {ThemedText} from "@/src/views/ThemedText";
import AudiobookIconView from "@/src/views/AudiobookIconView";
import AuthorLinkView from "@/src/views/AuthorLinkView";
import ReaderLinkView from "@/src/views/ReaderLinkView";
import {AudiobookLinkView} from "@/src/views/AudiobookLinkView";
import {useTranslation} from "react-i18next";
import {StyleSheet, View} from "react-native";
import HSplitterView from "@/src/views/HSplitterView";

export interface AudiobookListElementViewProps {
    audiobook: Audiobook
}

export function AudiobookListElementView(props: AudiobookListElementViewProps) {
    const {t} = useTranslation()
    const {audiobook} = props;

    return (
        <VStackView>
            <HStackView alignItems={"center"} style={{padding: 5}}>
                <AudiobookLinkView audiobookId={audiobook.id}>
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
            </HStackView>
            <HSplitterView/>
        </VStackView>
    )
}

const styles = StyleSheet.create({
    audiobookIconContainer: {boxShadow: '3px 3px 5px rgba(0, 0, 0, 0.3)', margin: 5}
});
