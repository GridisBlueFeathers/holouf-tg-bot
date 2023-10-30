import { kv } from "@vercel/kv";
import { User } from "../types";
import sendMessage from "../sendMessage";
import eventMachine from "../eventMachine";
import { interpret } from "xstate";

const sucessfulMessage = `Ви входите у темний коридор, освітлений лише слабким мерехтінням факелів на стінах. Варто було вам лише зробити пару кроків у ньому, як двері за вами голосно зачинилися. Вам трохи лячно, але ви впевнено крокуєте вперед.

Далі ви опиняєтеся перед двома дверима. На лівих намальована біла квіточка, на правих - блакитний черевичок. Яку ви відкриєте?

-----

/navigate квіточка
/navigate черевичок`
const handleEventRegister = async (user: User) => {
    try {
        const userDbState = await kv.hexists(`user:${user.id}`, "userState");
        if (userDbState) {
            await sendMessage({message: "You are already registered for an event", chatId: user.id});
            return;
        }
        if (user.username) {
            
            const startingState = interpret(eventMachine).getSnapshot();

            await kv.hset(`user:${user.id}`, {userTag: user.username, userState: JSON.stringify(startingState)});
            await sendMessage({message: sucessfulMessage, chatId: user.id});
        };
    } catch (e) {
        console.log(e);
    };
};

export default handleEventRegister;
