export interface commonPopupFormatResIf {

    popupType: string;
    message: string;
    title: string;
    buttonCounts: number;
    button_text: string[];
    button_color: string[];
    button_methods: string[];
    showLoader?: boolean;
}

export interface  PopupTooltipDataIF{
    popupType: string;
    message: string;
    title: string;
    time: number;
    isTimer: boolean;

}