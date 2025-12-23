import {StyleSheet, Text, type TextProps} from 'react-native';

import {useThemeColor} from '@/src/hooks/use-theme-color';

export type ThemedTextType =
    'small'
    | 'default'
    | 'title'
    | 'defaultSemiBold'
    | 'subtitle'
    | 'link'
    | 'error'
    | 'navLink'
    | 'linkSemiBold'
    | 'linkSemiBoldInactive'
    | 'subtitleLink';

export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: ThemedTextType;
    center?: boolean;
};

export function ThemedText(
    {
        style,
        lightColor,
        darkColor,
        type = 'default',
        center = false,
        ...rest
    }: ThemedTextProps) {

    const color = useThemeColor({light: lightColor, dark: darkColor}, 'text');

    return (
        <Text
            style={[
                {color},
                getStyle(type),
                center ? styles.center : undefined,
                style
            ]}
            {...rest}
        />
    );
}

function getStyle(type: ThemedTextType) {
    switch (type) {
        case 'title':
            return styles.title;
        case 'defaultSemiBold':
            return styles.defaultSemiBold;
        case 'subtitle':
            return styles.subtitle;
        case 'link':
            return styles.link;
        case 'error':
            return styles.error;
        case 'navLink':
            return styles.navLink;
        case 'linkSemiBold':
            return styles.linkSemiBold;
        case 'linkSemiBoldInactive':
            return styles.linkSemiBoldInactive;
        case 'small':
            return styles.small;
        case 'default':
        default:
            return styles.default;
    }
}

const styles = StyleSheet.create({
    small: {
        fontSize: 12,
        lineHeight: 20,
    },
    default: {
        fontSize: 16,
        lineHeight: 24,
    },
    defaultSemiBold: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subtitleLink: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0a7ea4',
        textDecorationLine: 'underline',
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
        color: '#0a7ea4',
    },
    linkSemiBold: {
        lineHeight: 30,
        fontSize: 16,
        color: '#0a7ea4',
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    linkSemiBoldInactive: {
        lineHeight: 30,
        fontSize: 16,
        fontWeight: '600',
    },
    error: {
        fontSize: 16,
        lineHeight: 24,
        color: 'red',
    },
    navLink: {
        lineHeight: 30,
        fontSize: 16,
        color: '#0a7ea4',
        textDecorationLine: 'underline',
    },
    center: {
        textAlign: "center"
    }
});
