import { getLocales } from "expo-localization";

export enum LanguageCode {
    Unknown = "un",
    English = "en",
    Belarusian = "be",
    Polish = "pl",
}

export interface LanguageDescription {
    name: string;
    code: LanguageCode;
    icon: string | null;
}

export const SupportedLanguages = new Map<string, LanguageDescription>([
    [LanguageCode.English, {name: "English (EN)", code: LanguageCode.English, icon: null}],
    [LanguageCode.Belarusian, {name: "Беларуская (BE)", code: LanguageCode.Belarusian, icon: null}],
    [LanguageCode.Polish, {name: "Polski (PL)", code: LanguageCode.Polish, icon: null}],
]);

export const DefaultLanguageCode = LanguageCode.English;

export function getLocaleLanguageCodes(): string[] {
    const languageCodes: string[] = [];
    const locales = getLocales();
    for (const locale of locales) {
        if (locale.languageCode !== null && languageCodes.indexOf(locale.languageCode) !== -1) {
            languageCodes.push(locale.languageCode);
        }
    }
    return languageCodes;
}

export function getDefaultSupportedLanguageCode(): LanguageCode {
    for (const languageCode of getLocaleLanguageCodes()) {
        if (SupportedLanguages.has(languageCode)) {
            return SupportedLanguages.get(languageCode)!.code;
        }
    }
    return DefaultLanguageCode;
}
