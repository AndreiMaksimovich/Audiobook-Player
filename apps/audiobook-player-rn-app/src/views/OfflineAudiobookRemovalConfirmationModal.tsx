import {Audiobook} from "shared"
import ConfirmationModal, {ConfirmationModalResult} from "@/src/views/ConfirmationModal";
import {useTranslation} from "react-i18next";

export interface OfflineAudiobookRemovalConfirmationModalProps {
    isVisible: boolean;
    audiobook: Audiobook;
    onResult: (remove: boolean) => void;
}

export default function OfflineAudiobookRemovalConfirmationModal(props: OfflineAudiobookRemovalConfirmationModalProps) {
    const {t} = useTranslation();

    function onModalResult(result: ConfirmationModalResult) {
        props.onResult(
            result === 'YES'
        )
    }

    return (
        <ConfirmationModal
            message={t('RemoveOfflineAudiobookConfirmation.Message').replace('{title}', props.audiobook.title)}
            onResult={onModalResult}
            isVisible={props.isVisible}/>
    )
}
