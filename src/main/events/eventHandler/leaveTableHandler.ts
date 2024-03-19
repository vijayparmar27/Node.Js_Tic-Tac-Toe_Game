import { leaveTable } from "../../gamePlay/leaveTable/leaveTable";

export async function leaveTableHandler(
    { data }: any,
    socket: any,
    ack?: Function
): Promise<void> {
    try {
        console.log("----- leaveTableHandler :: ");

        const tableId: string = socket["tableId"];
        const userId: string = socket["userId"];
        const seatIndex: number = socket["seatIndex"];

        await leaveTable(tableId, userId, seatIndex);

    } catch (error) {
        console.log("------ leaveTableHandler :: ERROR :: ", error);
    }
}