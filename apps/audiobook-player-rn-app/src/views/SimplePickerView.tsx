import React from "react";
import {ActionSheetIOS, Button, Platform, TextStyle, ViewProps} from "react-native";
import {Picker} from "@react-native-picker/picker";
import {useTranslation} from "react-i18next";

export interface SimplePickerItem<T> {
    value: T,
    label: string
}

export interface SimplePickerProps<T> extends ViewProps {
    items: SimplePickerItem<T>[],
    selectedValue: T,
    onSelectionChanged: (value: T) => void,
    pickerStyle?: TextStyle | undefined,
    testId?: string
}

function getLabelArray<T>(props: SimplePickerProps<T>) {
    const result: string[] = [];
    for (const item of props.items) {
        result.push(item.label);
    }
    return result;
}

export default function SimplePickerView<T>(props: SimplePickerProps<T>) {
    const { t } = useTranslation();

    const selectedItem = props.items.filter((item) => item.value === props.selectedValue)[0];

    // iOS
    if (Platform.OS == 'ios') {
        const labels = getLabelArray(props);
        return (
            <Button
                title={selectedItem.label}
                testID={props.testId}
                onPress={() => {
                    ActionSheetIOS.showActionSheetWithOptions(
                        {
                            options: [...labels, t("cancel")],
                            cancelButtonIndex: labels.length
                        },

                        (index) => {
                            if (index === labels.length) return;
                            props.onSelectionChanged(props.items[index].value);
                        }
                    )
                }
                }/>
        );
    }

    // Web / Android
    return (
        <Picker testID={props.testId} style={props.pickerStyle} mode={"dialog"} selectedValue={props.selectedValue} onValueChange={(value, index) => {props.onSelectionChanged(value)}}>
            {props.items.map((item) => <Picker.Item label={item.label} value={item.value} key={item.label}/>)}
        </Picker>
    );
}
