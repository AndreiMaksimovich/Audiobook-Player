import {VStackView} from "@/src/views/VStackView";
import {ActivityIndicator} from "react-native";

export default function SplashScreenView() {
    return(
        <VStackView alignItems={"center"} justifyContent={"center"} style={{height: "100%", width: "100%"}}>
            <ActivityIndicator size={"large"}/>
        </VStackView>
    )
}
