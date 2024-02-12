import { kv } from "@vercel/kv";
import { User } from "../types";
import { State, StateFrom, interpret } from "xstate";
import sendMessage from "../sendMessage";
import eventMachine from "../eventMachine";
import sendPhoto from "../sendPhoto";

const handleEventNavigate = async ({user, option}: {user: User, option: string}) => {
    if (!user.username) {
        return;
    };

    try {
        const stateDefinition = await kv.hget(`user:${user.id}`, "userState") as StateFrom<typeof eventMachine>;
        if (!stateDefinition) {
			await sendMessage({
				message: {
					text: "Ви ще не зареєстровані на участь в евенті",
					chat_id: user.id,
				}
			});
            return;
        };

        const previousState = State.create(stateDefinition);
        const service = interpret(eventMachine).start(previousState);

        if (option === "back" && previousState.hasTag("splitQuestion")) {
            const { basicMessage } = previousState.context.splits.filter(split => split.name === "s 5")[0];

            const activeQuestions = previousState.context.questions.filter(question => question.active);
            const baseMessage = `${basicMessage}`;

            const message = baseMessage.concat(...activeQuestions.map(question => `\n/navigate ${question.name}`));

            const nextState = service.send({type: `/navigate s 5`});
            await kv.hset(`user:${user.id}`, {userState: JSON.stringify(nextState)});
			await sendMessage({
				message: {
					chat_id: user.id,
					text: message,
				}
			});
            return;
        }

        if (option === "back") {
            const choiceName = previousState.context.choices.filter(choice => choice.active)[0].name;

            const nextState = service.send({type: `/navigate ${choiceName}`});

            const { message } = nextState.context.choices.filter(choice => choice.name === nextState.value)[0];

            await kv.hset(`user:${user.id}`, {userState: JSON.stringify(nextState)})
			await sendMessage({
				message: {
					chat_id: user.id,
					text: message,
				}
			})
            return
        }
        
        const optionId = previousState.context.questions.filter(question => question.name === option.toLowerCase())[0].id

        if (service.nextState({type: `/navigate ${optionId}`}).value === previousState.value) {
            return;
        }

        const nextState = service.send({type: `/navigate ${optionId}`});

        const {body, photoId} = nextState.context.questions.filter(question => question.id === nextState.value)[0];

        await kv.hset(`user:${user.id}`, {userState: JSON.stringify(nextState)})
        if (photoId) {
			await sendPhoto({
				photoMessage: {
					chat_id: user.id,
					photo: photoId,
					caption: body,
				}
			})
            return;

        }
		await sendMessage({
			message: {
				chat_id: user.id,
				text: body,
			}
		})
        
    } catch (e) {
        console.log(e)
    }
}

export default handleEventNavigate;
