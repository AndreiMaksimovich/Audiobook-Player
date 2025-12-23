import {Button, StyleSheet, TextInput} from "react-native";
import Spacer from "@/src/components/common/Spacer";
import {HStack} from "@/src/components/common/HStack";
import {useState} from "react";
import {SearchSource, useOpenSearchTab} from "@/src/navigation/Search";
import {useTranslation} from "react-i18next";

export interface SearchPanelLinkProps {
    searchQuery?: string;
    source?: SearchSource;
}

export default function SearchPanelLink(props: SearchPanelLinkProps) {
    const [searchQuery, setSearchQuery] = useState(props.searchQuery ?? "")
    const openSearchTab = useOpenSearchTab()
    const {t} = useTranslation()

    return (
        <HStack>
            <TextInput testID={'Search.TextInput'} style={styles.searchField} value={searchQuery} onChangeText={setSearchQuery} />
            <Spacer size={5}/>
            <Button title={t("Search")} testID={'Search.Button'} onPress={() => openSearchTab(props.source ?? SearchSource.Audiobooks, searchQuery)}/>
        </HStack>
    )
}

const styles = StyleSheet.create({
    searchField: {
        fontSize: 16,
        padding: 5,
        borderWidth: 1,
        borderRadius: 6,
        flexGrow: 1
    },
});
