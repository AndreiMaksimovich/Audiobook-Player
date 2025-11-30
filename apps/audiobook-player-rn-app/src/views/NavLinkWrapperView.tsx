import {View, ViewProps} from "react-native";

export interface NavLinkWrapperViewProps extends ViewProps {}

export default function NavLinkWrapperView(props: NavLinkWrapperViewProps) {
    return (
        <View style={{marginLeft: 3, marginRight: 3}}>
            {props.children}
        </View>
    )
}
