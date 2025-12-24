import {View} from "react-native";



export default function ScreenAnchor({id}: {id?: string}) {
    return (<View style={{width: 0, height: 0}} testID={id}/> )
}
