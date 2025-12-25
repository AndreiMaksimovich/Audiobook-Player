import {SharedStateHandlers} from "./Types";
import {OfflineAudiobooksState} from "../Types";
import {current} from "@reduxjs/toolkit";

const tabId = crypto.randomUUID()
const broadcastChannel = new BroadcastChannel('CrossBrowserTabsStateShareChanel')

let handlers: SharedStateHandlers | undefined = undefined

export function configureSharedStateHandlers(_handlers: SharedStateHandlers) {
    handlers = _handlers
}

broadcastChannel.onmessage = (event: MessageEvent) => {
    const message: Message<any> = JSON.parse(event.data)

    console.log('Received message', message)

    if (message.tabId === tabId) return

    switch (message.type) {
        case MessageType.SHARE_OFFLINE_AUDIOBOOKS_STATE:
            const state: OfflineAudiobooksState = message.payload
            handlers?.handleOfflineAudiobooks(state)
            break
    }
}

enum MessageType {
    SHARE_OFFLINE_AUDIOBOOKS_STATE = 'SHARE_OFFLINE_AUDIOBOOKS_STATE'
}

interface Message<T> {
    tabId: string;
    type: MessageType;
    payload?: T;
}

function sendMessage<T>(type: MessageType, payload?: T) {
    const message: Message<T> = {
        tabId: tabId,
        type: type,
        payload: payload
    }
    broadcastChannel.postMessage(JSON.stringify(message))
}

export function shareOfflineAudiobooksState(state: OfflineAudiobooksState) {
    sendMessage(MessageType.SHARE_OFFLINE_AUDIOBOOKS_STATE, current(state))
}
