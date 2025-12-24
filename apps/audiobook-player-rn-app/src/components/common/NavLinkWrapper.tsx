import {View, ViewProps} from "react-native";

export interface NavLinkWrapperProps extends ViewProps {}

export default function NavLinkWrapper(props: NavLinkWrapperProps) {
    return (
        <View style={{marginLeft: 3, marginRight: 3}}>
            {props.children}
        </View>
    )
}
