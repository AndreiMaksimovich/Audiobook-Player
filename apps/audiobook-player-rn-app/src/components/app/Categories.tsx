import {Category} from "shared";
import {View} from "react-native";
import CategoryLink from "@/src/components/app/CategoryLink";
import NavLinkWrapper from "@/src/components/common/NavLinkWrapper";

export interface CategoriesProps {
    categories: Category[]
}

export default function Categories(props: CategoriesProps) {
    return (
        <View style={{flexDirection: "row", flexWrap: "wrap"}}>
            {props.categories.map((category) => (<NavLinkWrapper key={category.id}><CategoryLink category={category}/></NavLinkWrapper>))}
        </View>
    )
}
