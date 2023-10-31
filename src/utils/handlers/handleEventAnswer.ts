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
            await sendMessage({message: "You are not registered yet", chatId: user.id});
            return;
        };

        const previousState = State.create(stateDefinition);
        const service = interpret(eventMachine).start(previousState);

        if (service.nextState({type: `/answer ${previousState.value}`, answer: answer.toLowerCase()}).value === previousState.value) {
            return;
        }
        const nextState = service.send({type: `/answer ${previousState.value}`, answer: answer.toLowerCase()});
        
        if (nextState.hasTag("fin")) {
            await kv.hset(`user:${user.id}`, {userState: JSON.stringify(nextState)})
            await sendPhoto({
                message: `Вітаємо! Ви змогли дібратися до лігва безумного кролика! Для того, щоб продовжити гру та перейти на фінальний етап, напишіть їй особисто (повідомлення приймаються до 00:00).`,
                chatId: user.id,
                photoId: "AgACAgIAAxkBAAIDgmVAZfQ49B_P9_BberKKVIKai8k6AALz0zEbQ4YBSjoFNBjT4FtaAQADAgADcwADMwQ"
            })
            //await sendMessage({message: `user ${user.username}\nstage ${previousState.value}\nanswer ${answer}`, chatId})
            return;

        }

        if (previousState.hasTag("trap")) {
            const {message} = nextState.context.choices.filter(choice => choice.name === nextState.value)[0]

            await kv.hset(`user:${user.id}`, {userState: JSON.stringify(nextState)});
            await sendPhoto({
                message: `Золоті двері відкриваються, але за ними стоїть суцільна пітьма. Ви робите пару кроків вперед, і ту двері за вами різко та гучно зачиняються. Ви відчуваєте, як підлога уходить з-під ваших ніг, ви падаєте вниз, а навколо вас звучить садистський кролячий сміх...`,
                chatId: user.id,
                photoId: "AgACAgIAAxkBAAIDPmVAUIA9dPmSrmw-LjuHIDP_YCI8AAIB1DEbQ4YBSkKE6L--Z8tiAQADAgADcwADMAQ"
            });
            await sendMessage({message: message, chatId: user.id})
            return;

        }

        if (nextState.hasTag("question")) {

            const {body, photoId} = nextState.context.questions.filter(question => question.id === nextState.value)[0]

            await kv.hset(`user:${user.id}`, {userState: JSON.stringify(nextState)});
            if (photoId) {
                await sendPhoto({
                    message: body,
                    chatId: user.id,
                    photoId: photoId
                })
            }
            await sendMessage({message: body, chatId: user.id});
            return;
        }

        if (nextState.hasTag("split")) {

            const {basicMessage} = nextState.context.splits.filter(split => split.name === nextState.value)[0];

            const activeQuestions = nextState.context.questions.filter(question => question.active)
            const baseMessage = `${basicMessage}`;

            const message = baseMessage.concat(...activeQuestions.map(question => `\n/navigate ${question.name}`))

            await kv.hset(`user:${user.id}`, {userState: JSON.stringify(nextState)})
            await sendMessage({message: message, chatId: user.id})
            return;
        }

        const {message} = nextState.context.choices.filter(choice => choice.name === nextState.value)[0];

        await kv.hset(`user:${user.id}`, {userState: JSON.stringify(nextState)})
        await sendMessage({message: message, chatId: user.id})

        return;
    } catch (e) {
        console.log(e)
    }
}

export default handleEventAnswer;
