import {ScrollView, ViewProps} from "react-native";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {ThemedText} from "@/src/components/common/ThemedText";
import {VStack} from "@/src/components/common/VStack";
import Spacer from "@/src/components/common/Spacer";
import type * as React from "react";
import {RefreshControlProps} from "react-native/Libraries/Components/RefreshControl/RefreshControl";
import ScreenAnchor from "@/src/components/functional/ScreenAnchor";

export interface AppScreenViewProps extends ViewProps {
    title?: string;
    refreshControl?: React.ReactElement<RefreshControlProps> | undefined;
}

export default function AppScreen(props: AppScreenViewProps) {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{flex: 1}}>
                <ScrollView testID={props.testID} horizontal={false}
                    refreshControl={props.refreshControl}>
                    <VStack style={{paddingLeft: 10, paddingRight: 10}}>
                        <ScreenAnchor id={props.testID} />
                        <Spacer size={10}/>
                        {props.title && (<><ThemedText type={"title"}>{props.title}</ThemedText><Spacer size={5}/></>)}
                        {props.children}
                    </VStack>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
