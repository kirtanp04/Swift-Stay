import { Queue } from "..";
import { QueueName } from "../Constant";

Queue.processQueueData(QueueName.EmailQueue, (res) => {

}, (err) => {
    console.log(err)
})