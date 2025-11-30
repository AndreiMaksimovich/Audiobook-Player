import {FlexAlignType, View, ViewProps} from "react-native";

export interface HStackProps extends ViewProps{
    alignContent?: | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly' | undefined;
    justifyContent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly"
    alignItems?: FlexAlignType | undefined,
    flexWrap?:  "wrap" | "nowrap" | "wrap-reverse" | undefined
}

export function HStackView(props: HStackProps) {
    return (
        <View style={[
            {
                flexDirection: "row",
                alignContent: props.alignContent,
                justifyContent: props.justifyContent,
                alignItems: props.alignItems,
                flexWrap: props.flexWrap
            },
            props.style
        ]}>
            {props.children}
        </View>
    )
}
