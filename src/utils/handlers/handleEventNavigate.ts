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

        if (service.nextState({type: option}).value === previousState.value) {
            return;
        }

        const nextState = service.send({type: option});

        if (nextState.hasTag("split")) {
            const {name, basicMessage} = nextState.context.splits.filter(split => split.name === nextState.value)[0];

            const activeQuestions = nextState.context.questions.filter(question => question.split === name && question.active)
            const baseMessage = `${name}

${basicMessage}
Availible questions`;
            
            const message = baseMessage.concat(...activeQuestions.map(question => `\n/navigate ${question.name}`))

            await kv.hset(`user:${user.id}`, {userState: JSON.stringify(nextState)})
            await sendMessage({message: message, chatId: user.id})

            return;
        };
        
        const {name, body} = nextState.context.questions.filter(question => question.name === nextState.value)[0]
        const message = `${name}
${body}

To go back enter
/navigate goBack`
        await kv.hset(`user:${user.id}`, {userState: JSON.stringify(nextState)})
        await sendMessage({message: message, chatId: user.id})
        
    } catch (e) {
        console.log(e)
    }
}

export default handleEventNavigate;
