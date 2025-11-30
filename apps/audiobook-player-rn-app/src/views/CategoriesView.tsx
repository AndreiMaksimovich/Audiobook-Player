import {Category} from "shared";
import {View} from "react-native";
import CategoryLinkView from "@/src/views/CategoryLinkView";
import NavLinkWrapperView from "@/src/views/NavLinkWrapperView";

export interface CategoriesViewProps {
    categories: Category[]
}

export default function CategoriesView(props: CategoriesViewProps) {
    return (
        <View style={{flexDirection: "row", flexWrap: "wrap"}}>
            {props.categories.map((category) => (<NavLinkWrapperView key={category.id}><CategoryLinkView category={category}/></NavLinkWrapperView>))}
        </View>
    )
}
