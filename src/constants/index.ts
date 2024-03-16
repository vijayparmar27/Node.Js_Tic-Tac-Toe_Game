import { CONFIG } from "./config"
import { GLOBLE } from "./globle"
import STATUS_CODE from "./statueCode";
import SUCCESS_MESSAGES from "./successMessages";
import ERROR_MESSAGES from "./errorMessages";
import MESSAGES from "./messages";
import NUMERICAL from "./numerical";
import SOCKET from "./socket";
import REDIS from "./redis";
import { PLAYER_STATE } from "./playerState";
import { EVENTS } from "./events";
import { BULL_TIMER } from "./bullTimer";

const CONSTANTS = {
    CONFIG,
    GLOBLE,
    STATUS_CODE,
    SUCCESS_MESSAGES,
    ERROR_MESSAGES,
    MESSAGES,
    NUMERICAL,
    SOCKET,
    REDIS,
    PLAYER_STATE,
    EVENTS,
    BULL_TIMER
}

export = CONSTANTS;
