import {screen, waitFor} from '@testing-library/react-native'
import {getMockAudiobook, renderWithReduxStore} from "@/src/test";
import {initializeApplicationDataAndServices} from "@/src/initialization"
import {setupStore} from "@/src/store";
import AudiobookView from "@/src/components/app/AudiobookView"

test('AudiobookView', async () => {

    const store = setupStore()

    await initializeApplicationDataAndServices({
        dispatch: store.dispatch,
        initializeOfflineAudiobooks: true
    })

    const audiobook = getMockAudiobook()

    const renderResult = renderWithReduxStore(
        <AudiobookView audiobook={audiobook} />,
        {
            store: store
        }
    );

    await waitFor(async () => {
        screen.getByText('Hamlet')
    })

})
