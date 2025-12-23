import {Tag} from "shared";
import {View} from "react-native";
import TagLink from "@/src/components/app/TagLink";
import NavLinkWrapper from "@/src/components/common/NavLinkWrapper";

export interface TagsProps {
    tags: Tag[]
}

export default function Tags(props: TagsProps) {
    return (
        <View style={{flexDirection: "row", flexWrap: "wrap"}}>
            {props.tags.map((tag) => (<NavLinkWrapper key={tag.id}><TagLink tag={tag}/></NavLinkWrapper>))}
        </View>
    )
}
