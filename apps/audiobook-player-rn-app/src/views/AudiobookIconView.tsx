import {Audiobook, MediaFileType} from "shared";
import {StyleSheet, Image, ImageSourcePropType, ViewProps, StyleProp} from 'react-native';
import {ImageStyle} from "expo-image";

export interface AudiobookIconViewProps extends ViewProps{
    audiobook: Audiobook,
    width?: number,
    height?: number,
    style?: StyleProp<ImageStyle>
}

function getIconSource(audiobook: Audiobook): ImageSourcePropType {
    if (!audiobook.icon) return require("@/assets/images/audiobook-no-icon.jpg");
    return { uri: audiobook.icon.url }
}

export default function AudiobookIconView(props: AudiobookIconViewProps) {
    return (
        <Image
            style={[
                styles.audiobookIcon,
                props.width ? {width: props.width} : null,
                props.height ? {height: props.height} : null,
                props.style,
            ]}
            source={getIconSource(props.audiobook)}
        />
    )
}

const styles = StyleSheet.create({
    audiobookIcon: {
        width: 128,
        height: 196,
    }
});
