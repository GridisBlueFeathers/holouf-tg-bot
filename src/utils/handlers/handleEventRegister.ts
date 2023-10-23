import { kv } from "@vercel/kv";
import { User } from "../types";
import sendMessage from "../sendMessage";
import eventMachine from "../eventMachine";
import { interpret } from "xstate";

const sucessfulMessage = `
You have been registered for an event

Current questions
/navigate oneOne
/navigate oneTwo
/navigate oneThree
/navigate oneFour
`


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
