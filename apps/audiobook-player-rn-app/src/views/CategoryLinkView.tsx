import {Category} from "shared";
import { Link } from 'expo-router';
import {ViewProps} from "react-native";
import {ThemedText} from "@/src/views/ThemedText";

export interface CategoryLinkViewProps extends ViewProps{
    category: Category
}

export default function CategoryLinkView(props: CategoryLinkViewProps) {
    return (
        <Link
            href={{
                pathname: `/category/[category_id]`,
                params: {category_id: props.category.id}
            }}
            withAnchor>
            {props.children ? props.children :(<ThemedText type={"navLink"}>{props.category.name}</ThemedText>)}
        </Link>
    )
}
