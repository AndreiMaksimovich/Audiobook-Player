import {Tag} from "shared";
import {View} from "react-native";
import TagLinkView from "@/src/views/TagLinkView";
import NavLinkWrapperView from "@/src/views/NavLinkWrapperView";

export interface TagsViewProps {
    tags: Tag[]
}

export default function TagsView(props: TagsViewProps) {
    return (
        <View style={{flexDirection: "row", flexWrap: "wrap"}}>
            {props.tags.map((tag) => (<NavLinkWrapperView key={tag.id}><TagLinkView tag={tag}/></NavLinkWrapperView>))}
        </View>
    )
}
