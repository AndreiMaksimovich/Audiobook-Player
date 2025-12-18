export interface Message<T> {
    type: string,
    payload?: T
}

export type ServiceWorkerMessageBusMessageListener = (message: Message<any>) => void

class ServiceWorkerMessageBus {
    private readonly broadcastChannel: BroadcastChannel;
    private readonly listeners: Map<string, ServiceWorkerMessageBusMessageListener[]>;

    constructor(broadcastChanelName = 'ServiceWorkerMessageBus') {
        this.broadcastChannel = new BroadcastChannel(broadcastChanelName)
        this.listeners = new Map<string, ServiceWorkerMessageBusMessageListener[]>()
        this.broadcastChannel.onmessage = (event) => this.handleMessage(event)
    }

    handleMessage(event: MessageEvent<any>) {
        const message = event.data as Message<any>
        if (this.listeners.has(message.type)) {
            for (const listener of this.listeners.get(message.type)!) {
                listener(message)
            }
        }
    }

    post(type: string, payload?: any) {
        const message = {
            type: type,
            payload: payload
        }
        this.broadcastChannel.postMessage(message)
    }

    addMessageListener(type: string, listener: ServiceWorkerMessageBusMessageListener) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, [listener])
        } else {
            this.listeners.get(type)!.push(listener)
        }
    }
}

export const serviceWorkerMessageBus = new ServiceWorkerMessageBus()
