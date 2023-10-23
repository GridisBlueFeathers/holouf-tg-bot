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

        const currentSplit = previousState.context.splits.filter(split => split.active)[0].name

        if (service.nextState({type: currentSplit, answer: answer}).value === previousState.value) {
            return;
        }
        const nextState = service.send({type: currentSplit, answer: answer});
        
        if (nextState.hasTag("fin")) {
            await kv.hset(`user:${user.id}`, {userState: JSON.stringify(nextState)})
            await sendMessage({message: "Congrats", chatId: user.id})
            return;

        }

        const {name, basicMessage} = nextState.context.splits.filter(split => split.name === nextState.value)[0];

        const activeQuestions = nextState.context.questions.filter(question => question.split === name && question.active)
        const baseMessage = `${name}

${basicMessage}
Availible questions`;
        
        const message = baseMessage.concat(...activeQuestions.map(question => `\n/navigate ${question.name}`))

        await kv.hset(`user:${user.id}`, {userState: JSON.stringify(nextState)})
        await sendMessage({message: message, chatId: user.id})

        return;
    } catch (e) {
        console.log(e)
    }
}

export default handleEventAnswer;
