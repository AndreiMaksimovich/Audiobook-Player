import {ScrollView, ViewProps} from "react-native";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {ThemedText} from "@/src/views/ThemedText";
import {VStackView} from "@/src/views/VStackView";
import SpacerView from "@/src/views/SpacerView";

export interface AppScreenViewProps extends ViewProps {
    title?: string;
}

export default function AppScreenView(props: AppScreenViewProps) {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex: 1}}>
                <ScrollView horizontal={false}>
                    <VStackView style={{paddingLeft: 10, paddingRight: 10}}>
                        <SpacerView size={10}/>
                        {props.title && (<><ThemedText type={"title"}>{props.title}</ThemedText><SpacerView size={5}/></>)}
                        {props.children}
                    </VStackView>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
