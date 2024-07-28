
export const default_json = {
    // Temporary Data
    count: 0,
    previousUrl: '',
    timerStarted: false,
    intervalId: -1,
    timeElapsed: 0,
    downTime: 0,
    injected: false,
    initialRun: true,
    countInjected: false,
    currentlyPaused: false,
    countdown: 0,
    // Persistent Settings
    timeLimit: 5,
    countLimit: 5,
    countdownMax: 5,
    timeSelected: true,
    countSelected: true,
    // Stats
    shortsWatched: 0
}

// default_json with only the persistant settings and stats
export const default_global_json = {
    shortsWatched: 0,
}