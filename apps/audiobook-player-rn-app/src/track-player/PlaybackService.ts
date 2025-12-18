import TrackPlayer, {AppKilledPlaybackBehavior, Capability, Event} from "@/src/wrappers/react-native-track-player";
import {
    handleButtonFastBackward, handleButtonFastForward,
    handleButtonSkipBackward,
    handleButtonSkipForward,
    handleRemoteButtonPlay, handleTrackPlayerEventPlaybackActiveTrackChanged,
    handleTrackPlayerEventPlaybackError, handleTrackPlayerEventPlaybackQueueEnded, handleTrackPlayerStateChange
} from "@/src/store/CurrentlyPlaying";
import {appDispatch} from "@/src/store";

export async function trackPlayerPlaybackService() {
    await TrackPlayer.updateOptions({
        capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.JumpBackward,
            Capability.JumpForward
        ],
        notificationCapabilities: [
            Capability.Pause,
            Capability.Play,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.JumpBackward,
            Capability.JumpForward
        ],
        android: {
            appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification
        }
    })

    function handleTrackPlayerRemoteEvent(event: Event, data: any) {
        console.log('TrackPlayerRemoteEvent', event, data)

        switch (event) {
            case Event.RemotePause:
                appDispatch(handleRemoteButtonPlay(false));
                break;
            case Event.RemotePlay:
                appDispatch(handleRemoteButtonPlay(true));
                break;

            case Event.RemoteNext:
                appDispatch(handleButtonSkipForward());
                break;
            case Event.RemotePrevious:
                appDispatch(handleButtonSkipBackward());
                break;

            case Event.RemoteJumpBackward:
                appDispatch(handleButtonFastBackward());
                break;
            case Event.RemoteJumpForward:
                appDispatch(handleButtonFastForward());
                break;
        }
    }

    TrackPlayer.addEventListener(Event.PlaybackQueueEnded, (data) => {
        console.log('PlaybackQueueEnded', data)
        appDispatch(handleTrackPlayerEventPlaybackQueueEnded(data))
    })

    TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, (data) => {
        console.log('PlaybackActiveTrackChanged', data)
        appDispatch(handleTrackPlayerEventPlaybackActiveTrackChanged(data))
    })

    TrackPlayer.addEventListener(Event.PlaybackError, (data) => {
        console.log('PlaybackError', data)
        appDispatch(handleTrackPlayerEventPlaybackError(data))
    })

    for (const eventType of [Event.RemotePause, Event.RemotePlay, Event.RemoteNext, Event.RemotePrevious, Event.RemoteJumpBackward, Event.RemoteJumpForward,]) {
        TrackPlayer.addEventListener(eventType, (data) => handleTrackPlayerRemoteEvent(eventType, data))
    }

    TrackPlayer.addEventListener(Event.PlaybackState, (data) => {
        console.log('PlaybackState', data)
        appDispatch(handleTrackPlayerStateChange(data))
    })
}
