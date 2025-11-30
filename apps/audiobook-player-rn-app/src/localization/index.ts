import { initReactI18next } from "react-i18next";
import englishLocalization from "@/localization/English.json"
import belarusianLocalization from "@/localization/Belarusian.json"
import polishLocalization from "@/localization/Polish.json"

import i18next from "i18next";

i18next
    .use(initReactI18next)
    .init({
        lng: "en",
        fallbackLng: "en",
        debug: false,

        interpolation: {
            escapeValue: false,
        },

        resources: {
            "en": englishLocalization,
            "be": belarusianLocalization,
            "pl": polishLocalization,
        }
    });

export default i18next;
