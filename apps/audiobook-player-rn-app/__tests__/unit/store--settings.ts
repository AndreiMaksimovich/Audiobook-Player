import {settingsStateSlice} from "@/src/store/Settings";
import {LanguageCode} from "@/src/localization";
import {delay} from "@/src/utils";
import i18next from "@/src/localization";

describe('Redux -- Settings Slice', () => {

    it('Set Code Language', async () => {
        const state = settingsStateSlice.getInitialState()
        const languageCode = LanguageCode.Polish
        const nextState = settingsStateSlice.reducer(state, settingsStateSlice.actions.setLocalizationLanguageCode(languageCode))
        expect(nextState.localizationLanguageCode).toBe(languageCode)
        await delay(5)
        expect(nextState.localizationLanguageCode).toBe(i18next.language)
    });

})
