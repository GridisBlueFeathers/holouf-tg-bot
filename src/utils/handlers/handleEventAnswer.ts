import { kv } from "@vercel/kv";
import { User } from "../types";
import { State, StateFrom, interpret } from "xstate";
import sendMessage from "../sendMessage";
import eventMachine from "../eventMachine";
import sendPhoto from "../sendPhoto";

const handleEventAnswer = async ({user, answer}: {user: User, answer: string}) => {
    if (!user.username) {
        return;
    };

    try {
        const stateDefinition = await kv.hget(`user:${user.id}`, "userState") as StateFrom<typeof eventMachine>;
        if (!stateDefinition) {
            await sendMessage({
				message: {
					text: "You are not registered yet",
					chat_id: user.id,
				}
			});
            return;
        };

        const previousState = State.create(stateDefinition);
        const service = interpret(eventMachine).start(previousState);

        if (service.nextState({type: `/answer ${previousState.value}`, answer: answer.toLowerCase()}).value === previousState.value) {
			await sendMessage({
				message: {
					text: `user ${user.username}\nuser id ${user.id}\nstage ${previousState.value}\nanswer ${answer}`,
					chat_id: Number(process.env.EVENT_CHAT_ID)
				}
			})
            return;
        }
        const nextState = service.send({type: `/answer ${previousState.value}`, answer: answer.toLowerCase()});
        
        if (nextState.hasTag("fin")) {
            await kv.hset(`user:${user.id}`, {userState: JSON.stringify(nextState)})
			await sendPhoto({
				photoMessage: {
					chat_id: user.id,
					caption: "Вітаємо! Ви змогли дібратися до лігва безумного кролика! Для того, щоб продовжити гру та перейти на фінальний етап, напишіть їй особисто (повідомлення приймаються до 00:00).",
					photo: "AgACAgIAAxkBAAIDgmVAZfQ49B_P9_BberKKVIKai8k6AALz0zEbQ4YBSjoFNBjT4FtaAQADAgADcwADMwQ"
				}
			})
			await sendMessage({
				message: {
					text: `user @${user.username}\nuser id ${user.id}\nstage ${previousState.value}\nanswer ${answer}\nuser passed final question`,
					chat_id: Number(process.env.EVENT_CHAT_ID),
				}
			})
            return;

        }

        if (previousState.hasTag("trap")) {
            const { message } = nextState.context.choices.filter(choice => choice.name === nextState.value)[0]

            await kv.hset(`user:${user.id}`, {userState: JSON.stringify(nextState)});
			await sendPhoto({
				photoMessage: {
					caption: "Золоті двері відкриваються, але за ними стоїть суцільна пітьма. Ви робите пару кроків вперед, і тут двері за вами різко та гучно зачиняються. Ви відчуваєте, як підлога уходить з-під ваших ніг, ви падаєте вниз, а навколо вас звучить садистський кролячий сміх...",
					chat_id: user.id,
					photo: "AgACAgIAAxkBAAIDPmVAUIA9dPmSrmw-LjuHIDP_YCI8AAIB1DEbQ4YBSkKE6L--Z8tiAQADAgADcwADMAQ"
				}
			})
			await sendMessage({
				message: {
					chat_id: user.id,
					text: message
				}
			})
			await sendMessage({
				message: {
					chat_id: Number(process.env.EVENT_CHAT_ID),
					text: `user ${user.username}\nuser id ${user.id}\nstage ${previousState.value}\nanswer ${answer}`
				}
			})
            return;

        }

        if (nextState.hasTag("question")) {

            const {body, photoId} = nextState.context.questions.filter(question => question.id === nextState.value)[0]

            await kv.hset(`user:${user.id}`, {userState: JSON.stringify(nextState)});
            if (photoId) {
				await sendPhoto({
					photoMessage: {
						chat_id: user.id,
						photo: photoId,
						caption: body,
					}
				})

            }
			await sendMessage({
				message: {
					chat_id: Number(process.env.EVENT_CHAT_ID),
					text: `user ${user.username}\nuser id ${user.id}\nstage ${previousState.value}\nanswer ${answer}`
				}
			})
            return;
        }

        if (nextState.hasTag("split")) {

            const {basicMessage} = nextState.context.splits.filter(split => split.name === nextState.value)[0];

            const activeQuestions = nextState.context.questions.filter(question => question.active)
            const baseMessage = `${basicMessage}`;

            const message = baseMessage.concat(...activeQuestions.map(question => `\n/navigate ${question.name}`))

            await kv.hset(`user:${user.id}`, {userState: JSON.stringify(nextState)})
			await sendMessage({
				message: {
					chat_id: user.id,
					text: message
				}
			})
			await sendMessage({
				message: {
					chat_id: Number(process.env.EVENT_CHAT_ID),
					text: `user ${user.username}\nuser id ${user.id}\nstage ${previousState.value}\nanswer ${answer}`
				}
			})
            return;
        }

        const {message} = nextState.context.choices.filter(choice => choice.name === nextState.value)[0];

        await kv.hset(`user:${user.id}`, {userState: JSON.stringify(nextState)})
		await sendMessage({
			message: {
				chat_id: user.id,
				text: message
			}
		})
		await sendMessage({
			message: {
				chat_id: Number(process.env.EVENT_CHAT_ID),
				text: `user ${user.username}\nuser id ${user.id}\nstage ${previousState.value}\nanswer ${answer}`
			}
		})

        return;
    } catch (e) {
        console.log(e)
    }
}

export default handleEventAnswer;
