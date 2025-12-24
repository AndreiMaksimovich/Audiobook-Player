import {View} from "react-native";

export interface SpacerProps {
    width?: number
    height?: number
    size?: number,
    testID?: string
}

export default function Spacer(props: SpacerProps) {
    return (
        <View testID={props.testID} style={{width: props.width ?? props.size, height: props.height ?? props.size}}/>
    )
}
