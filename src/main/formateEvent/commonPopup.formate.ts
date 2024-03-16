import { PopupTooltipDataIF, commonPopupFormatResIf } from "../../@types/formateRes";
import { MESSAGES } from "../../constants";

export function commonPopupFormat(
    message: string,
    buttonCounts = 0,
    button_text: string[] = [],
    button_color: string[] = [],
    button_methods: string[] = [],
    title = "Alert",
    showLoader = false
) {

    const data: commonPopupFormatResIf = {
        popupType: MESSAGES.ALERT.TYPE.COMMON_POPUP,
        message,
        title,
        buttonCounts: buttonCounts || 0,
        button_text: button_text || [],
        button_color: button_color || [],
        button_methods: button_methods || [],
        showLoader: showLoader
    };


    return {
        en: "POPUP",
        data
    };
}

export function centerToastPopupFormat(
    message: string,
    type = MESSAGES.ALERT.TYPE.TOST_POPUP,
    time = 0
) {
    const data: PopupTooltipDataIF = {
        popupType: type,
        message,
        title: "Alert",
        time,
        isTimer: !!time
    };

    return {
        en: "POPUP",
        data
    };
}
