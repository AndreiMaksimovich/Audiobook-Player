import {Audiobook} from "shared"
import ConfirmationModal, {ConfirmationModalResult} from "@/src/views/ConfirmationModal";
import {useTranslation} from "react-i18next";

export interface DownloadTaskRemovalConfirmationModalProps {
    isVisible: boolean;
    audiobook: Audiobook;
    onResult: (remove: boolean) => void;
}

export default function DownloadTaskRemovalConfirmationModal(props: DownloadTaskRemovalConfirmationModalProps) {
    const {t} = useTranslation();

    function onModalResult(result: ConfirmationModalResult) {
        props.onResult(
            result === 'YES'
        )
    }

    return (
        <>
            <ConfirmationModal
                message={t('CancelDownloadTaskConfirmation.Message').replace('{title}', props.audiobook.title)}
                onResult={onModalResult}
                isVisible={props.isVisible}/>
        </>
    )
}
