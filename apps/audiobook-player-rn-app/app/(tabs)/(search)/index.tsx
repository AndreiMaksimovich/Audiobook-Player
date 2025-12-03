import {Button, Pressable, StyleSheet, TextInput} from 'react-native';
import '@/src/localization'
import {useTranslation} from 'react-i18next'
import {GetAudiobooksRequest, GetAuthorsRequest, GetReadersRequest} from "shared";
import {ThemedText} from "@/src/views/ThemedText";
import {useEffect, useState} from "react";
import {HStackView} from "@/src/views/HStackView";
import {AudiobooksPerPage, AuthorsPerPage, ReadersPerPage} from "@/src/config";
import AudiobookDynamicListView from "@/src/views/AudiobookDynamicListView";
import SpacerView from "@/src/views/SpacerView";
import AuthorDynamicListView from "@/src/views/AuthorDynamicListView";
import ReaderDynamicListView from "@/src/views/ReaderDynamicListView";
import {useLocalSearchParams, useNavigation} from "expo-router";
import {SearchSource} from "@/src/navigation/Search";
import AppScreenView from "@/src/views/AppScreenView";

const initialGetAudiobooksRequest: GetAudiobooksRequest = {
    offset: 0,
    limit: AudiobooksPerPage,
    searchFor: ""
}

const initialGetAuthorsRequest: GetAuthorsRequest = {
    offset: 0,
    limit: AuthorsPerPage,
    searchFor: null,
    nameStartWith: null
}

const initialGetReadersRequest: GetReadersRequest = {
    offset: 0,
    limit: ReadersPerPage,
    searchFor: null,
    nameStartWith: null
}

export default function SearchScreen() {
    const {t} = useTranslation();

    const {query: paramsQuery, time: paramsTime, source: paramsSource} = useLocalSearchParams();

    const [searchQuery, setSearchQuery] = useState<string>(paramsQuery as string ?? "")
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [audiobooksRequest, setAudiobooksRequest] = useState<GetAudiobooksRequest | null>(null)
    const [authorsRequest, setAuthorsRequest] = useState<GetAuthorsRequest | null>(null)
    const [readersRequest, setReadersRequest] = useState<GetReadersRequest | null>(null)

    const [source, setSource] = useState<SearchSource>(SearchSource.Audiobooks)
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!paramsTime) return;
        const pQuery = paramsQuery as string ?? ""
        const pSource = parseInt(paramsSource as string) as SearchSource ?? SearchSource.Audiobooks
        setSearchQuery(pQuery)
        if (pSource != source) {
            setSource(pSource)
        } else {
            search(pQuery, false)
        }
    }, [paramsTime]);

    useEffect(() => {
        clearRequests()
        search(searchQuery, false)
    }, [source]);

    function onSearchQueryTextChange(text: string) {
        setSearchQuery(text)
    }

    function clearRequests() {
        setAudiobooksRequest(null)
        setAuthorsRequest(null)
        setReadersRequest(null)
    }

    function search(searchFor: string, showError: boolean = true): void {
        searchFor = searchFor.trim()
        if (searchFor === "") {
            if (showError) setErrorMessage(t("Error.SearchQueryIsEmpty"))
            clearRequests()
        } else {
            setErrorMessage("")
            clearRequests()

            if (source == SearchSource.Audiobooks) {
                const request = {...initialGetAudiobooksRequest}
                request.searchFor = searchFor
                setAudiobooksRequest(request)
            } else if (source == SearchSource.Authors) {
                const request = {...initialGetAuthorsRequest}
                request.searchFor = searchFor
                setAuthorsRequest(request)
            } else if (source == SearchSource.Readers) {
                const request = {...initialGetReadersRequest}
                request.searchFor = searchFor
                setReadersRequest(request)
            }

        }
    }

    function onModeChange(newValue: SearchSource) {
        if (source == newValue) return
        setSource(newValue)
    }

    return (
        <AppScreenView title={t("Search")}>
            <SpacerView size={10}/>
            <HStackView>
                <TextInput id={"searchQuery"} style={styles.searchField}  value={searchQuery}
                           onChangeText={onSearchQueryTextChange}/>
                <SpacerView size={5}/>
                <Button title={t("Search")} onPress={() => search(searchQuery)}/>
            </HStackView>
            <SearchModesView onChangeMode={onModeChange} selectedMode={source}/>
            <SpacerView size={10}/>

            {errorMessage.length>0 && (<ThemedText type={"error"}>{errorMessage}</ThemedText>)}

            {audiobooksRequest && (
                <AudiobookDynamicListView
                    baseRequest={audiobooksRequest}
                    onQueryStateChanged={(response, error, isLoading) => {
                        setIsLoading(isLoading)
                    }}
                />
            )}

            {authorsRequest && (
                <AuthorDynamicListView
                    baseRequest={authorsRequest}
                    onQueryStateChanged={(response, error, isLoading) => {
                        setIsLoading(isLoading)
                    }}
                />
            )}

            {readersRequest && (
                <ReaderDynamicListView
                    baseRequest={readersRequest}
                    onQueryStateChanged={(response, error, isLoading) => {
                        setIsLoading(isLoading)
                    }}
                />
            )}

        </AppScreenView>
    );
}

interface SearchModesViewProps {
    selectedMode: SearchSource;
    onChangeMode: (mode: SearchSource) => void;
}

function SearchModesView(props: SearchModesViewProps) {
    const {t} = useTranslation()

    return (
        <HStackView justifyContent={"space-around"}>
            {[t('Audiobooks'), t('Authors'), t('Readers')].map((name, index) => (
                <Pressable key={index} onPress={() => {
                    if (props.selectedMode !== index) {
                        props.onChangeMode(index)
                    }
                }}>
                    <ThemedText type={index == props.selectedMode ? "linkSemiBoldInactive" : "linkSemiBold"}>{name}</ThemedText>
                </Pressable>
            ))}
        </HStackView>
    )
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    searchModeSelected: {
        color: "black",
        textDecorationLine: "underline"
    },
    searchMode: {
        color: "blue"
    },
    searchField: {
        fontSize: 16,
        padding: 5,
        borderWidth: 1,
        borderRadius: 6,
        flexGrow: 1
    },
});
