import {VStack} from "@/src/components/common/VStack";
import {ActivityIndicator} from "react-native";
import ScreenAnchor from "@/src/components/functional/ScreenAnchor";
import type * as React from "react";

export default function SplashScreen() {
    return(
        <VStack alignItems={"center"} justifyContent={"center"} style={{height: "100%", width: "100%"}}>
            <ScreenAnchor id={"Screen.SplashScreen"} />
            <ActivityIndicator size={"large"}/>
        </VStack>
    )
}
