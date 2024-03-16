export const ALERT = Object.freeze({
    TYPE: {
        COMMON_POPUP: 'commonPopup',
        TOST_POPUP: 'TostPopUp',
        TOP_TOAST_POPUP: 'topToastPopup',
        MIDDLE_TOAST_POPUP: 'middleToastPopup',
        COMMON_TOAST_POPUP: 'commonToastPopup',
    },
    BUTTON_COLOR: {
        RED: 'red',
        GREEN: 'green',
        YELLOW: 'yellow',
        BLUE: 'blue',
    },
    BUTTON_TEXT: {
        OK: 'Okay',
        YES: 'Yes',
        NO: 'No',
        EXIT: 'Exit',
    },
    BUTTON_METHOD: {
        OK: 'OkBtn',
        YES: 'PlayAgainYes',
        NO: 'PlayAgainNo',
        FTUESkipYes: 'FTUESkipYes',
        FTUESkipNo: 'FTUESkipNo',
        EXIT: 'ExitBtnClick',
    },

    POPUP_TITLE: 'Alert',
    POPUP_TYPE: 'AcknowledgeEvent',
    //rejoin class
    REJOIN_POPUP_TYPE: 'Acknowledge Event',
    REJOIN_POPUP_MESSAGE: 'success',
    REJOIN_POPUP_TITLE: 'Alert',

    LOCK_IN_STATE: 'you are already in lock in state',
    JOIN_OLD_LOBBBY: "you already in table if you want to join click yes"
})