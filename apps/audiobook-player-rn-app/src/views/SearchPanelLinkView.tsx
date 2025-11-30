import {Button, StyleSheet, TextInput} from "react-native";
import SpacerView from "@/src/views/SpacerView";
import {HStackView} from "@/src/views/HStackView";
import {useState} from "react";
import {SearchSource, useOpenSearchTab} from "@/src/navigation/Search";
import {useTranslation} from "react-i18next";

export interface SearchPanelLinkViewProps {
    searchQuery?: string;
    source?: SearchSource;
}

export default function SearchPanelLinkView(props: SearchPanelLinkViewProps) {
    const [searchQuery, setSearchQuery] = useState(props.searchQuery ?? "")
    const openSearchTab = useOpenSearchTab()
    const {t} = useTranslation()

    return (
        <HStackView>
            <TextInput id={"searchQuery"} style={styles.searchField} value={searchQuery} onChangeText={setSearchQuery} />
            <SpacerView size={5}/>
            <Button title={t("Search")} onPress={() => openSearchTab(props.source ?? SearchSource.Audiobooks, searchQuery)}/>
        </HStackView>
    )
}

const styles = StyleSheet.create({
    searchField: {
        padding: 5,
        borderWidth: 1,
        borderRadius: 6,
        flexGrow: 1
    },
});
