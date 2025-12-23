import {useTranslation} from "react-i18next";
import {Modal, Pressable, StyleSheet, View, Text} from "react-native";
import {ThemedText} from "@/src/components/common/ThemedText";

export interface ConfirmationModalProps {
    title?: string;
    message: string;
    yesButtonLabel?: string;
    noButtonLabel?: string;
    onResult: (result: ConfirmationModalResult) => void;
    isVisible: boolean;
}

export enum ConfirmationModalResult {
    YES = 'YES',
    NO = 'NO',
    CANCELED = 'CANCELED',
}

export default function ConfirmationModal(props: ConfirmationModalProps) {
    const {t} = useTranslation();

    function onButtonClick_Yes() {
        props.onResult(ConfirmationModalResult.YES)
    }

    function onButtonClick_No() {
        props.onResult(ConfirmationModalResult.NO)
    }

    return (
        <Modal
            transparent={true}
            visible={props.isVisible}
            animationType={"fade"}
            onRequestClose={() => props.onResult(ConfirmationModalResult.CANCELED)}>
            <View style={styles.container}>
                <View style={styles.modalView}>
                    {props.title && (<ThemedText type={"defaultSemiBold"}>{props.title}</ThemedText>)}
                    <ThemedText type={"default"}>{props.message}</ThemedText>
                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={[styles.button, styles.buttonYes]}
                            onPress={onButtonClick_Yes}>
                            <Text style={styles.textStyle}>{props.yesButtonLabel ?? t("Yes")}</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonNo]}
                            onPress={onButtonClick_No}>
                            <Text style={styles.textStyle}>{props.noButtonLabel ?? t("No")}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 15,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginHorizontal: 10,
        minWidth: 75
    },
    buttonYes: {
        backgroundColor: '#2196F3',
    },
    buttonNo: {
        backgroundColor: '#FF5733',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
