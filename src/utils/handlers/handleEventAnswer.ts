import { kv } from "@vercel/kv";
import { User } from "../types";
import { State, StateFrom, interpret } from "xstate";
import sendMessage from "../sendMessage";
import eventMachine from "../eventMachine";

const handleEventAnswer = async ({user, answer}: {user: User, answer: string}) => {
    if (!user.username) {
        return;
    };

    try {
        const stateDefinition = await kv.hget(`user:${user.id}`, "userState") as StateFrom<typeof eventMachine>;
        if (!stateDefinition) {
            await sendMessage({message: "You are not registered yet", chatId: user.id});
            return;
        };

        const previousState = State.create(stateDefinition);
        const service = interpret(eventMachine).start(previousState);
        console.log(previousState.value)

        const nextStep = previousState.context.questions.filter(question => question.name === previousState.value)[0]

        if (service.nextState({type: `/answer ${previousState.value}`, answer: answer}).value === previousState.value) {
            return;
        }
        const nextState = service.send({type: `/answer ${previousState.value}`, answer: answer});
        
        if (nextState.hasTag("fin")) {
            await kv.hset(`user:${user.id}`, {userState: JSON.stringify(nextState)})
            await sendMessage({message: "Congrats", chatId: user.id})
            return;

        }

        if (nextState.hasTag("question")) {

            const {name, body} = nextState.context.questions.filter(question => question.name === nextState.value)[0]

            await kv.hset(`user:${user.id}`, {userState: JSON.stringify(nextState)});
            await sendMessage({message: `${name} ${body}`, chatId: user.id});
            return;
        }

        

        const {name, message} = nextState.context.choices.filter(choice => choice.name === nextState.value)[0];

        await kv.hset(`user:${user.id}`, {userState: JSON.stringify(nextState)})
        await sendMessage({message: `${name} ${message}`, chatId: user.id})

        return;
    } catch (e) {
        console.log(e)
    }
}

export default handleEventAnswer;
