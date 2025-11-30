import {VStackView} from "@/src/views/VStackView";
import {Author} from "shared";
import AuthorLinkView from "@/src/views/AuthorLinkView";

export interface AuthorListViewProps {
    authors: Author[]
}

export default function AuthorListView(props: AuthorListViewProps) {
    return (
        <VStackView>
            {props.authors.map(author => (
                <AuthorLinkView key={author.id} author={author}/>
            ))}
        </VStackView>
    )
}
