import {FlexAlignType, View, ViewProps} from "react-native";

export interface VStackProps extends ViewProps{
    alignContent?:
        | 'flex-start'
        | 'flex-end'
        | 'center'
        | 'stretch'
        | 'space-between'
        | 'space-around'
        | 'space-evenly'
        | undefined;
    alignItems?: FlexAlignType | undefined;
    justifyContent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly" | undefined
}

export function VStackView(props: VStackProps) {
    return (
        <View
            style={[
                {
                    flexDirection: "column",
                    alignContent: props.alignContent,
                    alignItems: props.alignItems,
                    justifyContent: props.justifyContent
                },
                props.style
            ]}
        >
            {props.children}
        </View>
    )
}
