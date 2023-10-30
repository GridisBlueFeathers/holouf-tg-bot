import { kv } from "@vercel/kv";
import { User } from "../types";
import { State, StateFrom, interpret } from "xstate";
import sendMessage from "../sendMessage";
import eventMachine from "../eventMachine";

const handleEventNavigate = async ({user, option}: {user: User, option: string}) => {
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

        if (option === "back") {
            const choiceName = previousState.context.choices.filter(choice => choice.active)[0].name;

            const nextState = service.send({type: `/navigate ${choiceName}`});

            const { name, message } = nextState.context.choices.filter(choice => choice.name === nextState.value)[0];

            await kv.hset(`user:${user.id}`, {userState: JSON.stringify(nextState)})
            await sendMessage({message: `${name} ${message}`, chatId: user.id})
        }
        
        const optionId = previousState.context.questions.filter(question => question.name === option.toLowerCase())[0].id

        if (service.nextState({type: `/navigate ${optionId}`}).value === previousState.value) {
            return;
        }

        const nextState = service.send({type: `/navigate ${optionId}`});

        const {name, message} = nextState.context.choices.filter(choice => choice.name === nextState.value)[0];

        

        
        await kv.hset(`user:${user.id}`, {userState: JSON.stringify(nextState)})
        await sendMessage({message: `${name} ${message}`, chatId: user.id})
        
    } catch (e) {
        console.log(e)
    }
}

export default handleEventNavigate;
