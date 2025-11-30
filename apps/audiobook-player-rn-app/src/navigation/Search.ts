import {useRouter} from "expo-router";
import {DateTimeUtils} from "@/src/utils/DateTimeUtils";

export enum SearchSource {
    Audiobooks = 0,
    Authors = 1,
    Readers = 2
}

export function useOpenSearchTab() {
    const router = useRouter()
    return (source: SearchSource, query: string) => {
        router.navigate({
            pathname: "/(tabs)/(search)",
            params: {
                source: source,
                query: query,
                time: DateTimeUtils.now()
            }
        })
    }
}
