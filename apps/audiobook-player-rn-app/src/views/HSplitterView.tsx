import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";

export interface HStackViewProps {
    size?: number,
    color?: string,
    style?: StyleProp<ViewStyle>
}

export default function HSplitterView(props: HStackViewProps) {

    return (
        <View
            style={[
                styles.splitter,
                props.size ? { height: props.size } : undefined,
                props.color ? { backgroundColor: props.color } : undefined,
                props.style,
            ]}
        />
    )
}


const styles = StyleSheet.create({
    splitter: {
        height: 1,
        width: '100%',
        backgroundColor: "rgba(0, 0, 0, 0.3)"
    }
});
