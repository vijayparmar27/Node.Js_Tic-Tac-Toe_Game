import cancelProcess from "./cancelTimer";
import { Queue } from "./queue";

const BullScheduler = {
    addJob: Queue,
    cancelJob : cancelProcess
}

export default BullScheduler;