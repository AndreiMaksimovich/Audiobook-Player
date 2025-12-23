export default {

    setupPlayer: jest.fn(async () => {}),
    updateOptions: jest.fn(async () => undefined),

    add: jest.fn(async () => undefined),
    remove: jest.fn(async () => undefined),
    reset: jest.fn(async () => undefined),

    play: jest.fn(async () => undefined),
    pause: jest.fn(async () => undefined),
    stop: jest.fn(async () => undefined),
    seekTo: jest.fn(async () => undefined),

    getQueue: jest.fn(async () => []),
    getTrack: jest.fn(async () => null),
    getActiveTrackIndex: jest.fn(async () => 0),
    getPosition: jest.fn(async () => 0),
    getDuration: jest.fn(async () => 0),
    getState: jest.fn(async () => 0),

    usePlaybackState: jest.fn(() => ({ state: 0 })),
    useProgress: jest.fn(() => ({ position: 0, duration: 0, buffered: 0 })),

    registerPlaybackService: jest.fn(() => {}),
};
