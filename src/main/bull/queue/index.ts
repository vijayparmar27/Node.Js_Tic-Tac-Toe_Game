import { roundTimerStartQueue } from "./roundTimerStart.queue"
import { collectBootTimerQueue } from "./collectBootTimer.queue"
import { dealerTimerQueue } from "./dealerTimer.queue"
import { turnTimerQueue } from "./turnTimer.queue"
import { scoreboardTimerQueue } from "./scoreboardTimer.queue";
import { rejoinTimerQueue } from "./rejoinTimer.queue";

export const Queue = {
    roundTimerStartQueue,
    collectBootTimerQueue,
    dealerTimerQueue,
    turnTimerQueue,
    scoreboardTimerQueue,
    rejoinTimerQueue
}