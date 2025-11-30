import {StyleSheet, Text, type TextProps} from 'react-native';

import {useThemeColor} from '@/src/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: 'small' | 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'error' | 'navLink' | 'linkSemiBold' | 'linkSemiBoldInactive';
    center?: boolean;
};

export function ThemedText({
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
                type === 'default' ? styles.default : undefined,
                type === 'title' ? styles.title : undefined,
                type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
                type === 'subtitle' ? styles.subtitle : undefined,
                type === 'link' ? styles.link : undefined,
                type === 'error' ? styles.error : undefined,
                type === 'navLink' ? styles.navLink : undefined,
                type === 'linkSemiBold' ? styles.linkSemiBold : undefined,
                type === 'linkSemiBoldInactive' ? styles.linkSemiBoldInactive : undefined,
                type === 'small' ? styles.small : undefined,
                center ? styles.center : undefined,
                style
            ]}
            {...rest}
        />
    );
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
