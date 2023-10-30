import { createMachine, assign } from "xstate";

interface Choice {
    name: string;
    message: string;
    active: boolean;
    photoId?: string;
}

interface Question {
    name: string;
    id: string;
    body: string;
    answer: string;
    photoId?: string;
}

interface Context {
    choices: Choice[];
    questions: Question[];
}

const eventMachine = createMachine<Context>({
    predictableActionArguments: true,
    id: "event",
    initial: "start",
    context: {
        choices: [
            {
                name: "start",
                message: `Ви входите у темний коридор, освітлений лише слабким мерехтінням факелів на стінах. Варто було вам лише зробити пару кроків у ньому, як двері за вами голосно зачинилися. Вам трохи лячно, але ви впевнено крокуєте вперед.

Далі ви опиняєтеся перед двома дверима. На лівих намальована біла квіточка, на правих - блакитний черевичок. Яку ви відкриєте?

-----

/navigate квіточка
/navigate черевичок`,
                active: true,
            },
            {
                name: "c 1-2",
                message: `Наступний коридор має розвилку. Ви можете або піти прямо до наступних дверей, або звернути направо. Перед поворотом висить табличка: “SHOTTOKATTO HIAA, HONTOU DA YO”. Куди ви прямуєте?

-----

/navigate зелені двері
/navigate поворот`,
                active: false,
            },
            {
                name: "c 2-2",
                message: `Наступний коридор має розвилку. Ви можете або піти прямо до наступних дверей рожевого кольору, або звернути наліво. Перед поворотом висить табличка: “SHOTTOKATTO HIAA, HONTOU DA YO”. Куди ви прямуєте?

-----

/navigate рожеві двері
/navigate поворот`,
                active: false,
            },
        ],
        questions: [
            {
                name: "квіточка",
                id: "q 1-1",
                body: `Ви у маленькій кімнаті, позбавленій будь-якого оформлення. Пекора очевидно не намагалася надати своєму лабіринтові естетичного вигляду, все суто функціонально і присвячено одній меті: розважити шалений розум кролика.

Перед вами знаходяться зачинені двері. Зліва на невеличкому постаменті стоїть ваза для квітів. Ви взяли її в руки, потрясли - всередині щось є. Ви висипаєте предмети із неї на постамент. На ньому якісь дивні дитячі іграшки, а саме маленькі фігурки з етикетками на них: вовчик (A), чортик (B), покоївка (C), лікар (D) та воїн-самурай у масці (E). Навпроти стоїть ще пʼять пустих постаментів, на кожному з яких намальований символ:

На який із постаментів ви покладете яку іграшку (постаменти пронумеровані зліва направо від 1 до 5)?

-----

/navigate back
/answer 1A2B`,
                answer: "1d2b3a4c5e",
                photoId: "AgACAgIAAxkBAAICdGVAK-Td5oy7CSfu5bdbHWNxTfILAALh0zEbQ4YBSrZ2EUrnl_e5AQADAgADcwADMAQ"
            },
            {
                name: "q 1-2 name",
                id: "q 1-2",
                body: `Знову двері за вами зачиняються, знову коридор з факелами… Цього разу двері були лише одні.

Ви їх відкриваєте - і там та сама картина: майже пуста кімната з голими стінами та замкнені двері. Коло них на цей раз панель для вводу паролю із літер, на її екранчику коротке запитання: “Who sang those?”

Перед дверима прям на підлозі лежить щоденник. Ви його відкриваєте, і там лише два записи на різних сторінках.

Перший із них:

“Я такий щасливий! Спочатку це був фанатський проект, пародія на Eizouken, але згодом мені довірили намалювати офіційну анімацію…”

Другий:

“Що ж, можливо, я дійсно перегнув палку цього разу із мемами. Це перший раз, коли офіційне відео для Голо-таланту довелося переробити…”

Імʼя якої дівчинки ви введете на панелі?

-----

/answer Name`,
                answer: "mumei",
            },
            {
                name: "зелені двері",
                id: "q 1-3",
                body: `У цій кімнаті лише одна коробка. На коробці є наступний напис: "М______. Від твоєї сестри за сміхом із Бельгії".

Ви відкриваєте коробку і дістаєте звідти зелене яблуко, блакитний чоловічий костюм і червону краватку.

Судячи з усього, для того, щоб пройти до наступної кімнати, потрібно заповнити пропущені літери. Але чому сестра за сміхом? Чому саме ці предмети? І чому з Бельгії?

-----

/navigate back
/answer Мабвгґд`,
                answer: "маґрітт",
            },
            {
                name: "q 1-4 name",
                id: "q 1-4",
                body: `Ви входите у наступну кімнату і бачите перед собою п'ять фресок. На першій написано "Невинний", на другій зображена кукурудза, на третій панда, на четвертій ковпак блазня, а п'ята фреска зламана. Біля дверей знаходиться електронний календар, на якому можна обрати рік та ледь освітлений зупинений годинник.

Який рік ви оберете на календарі?

-----

/answer 1234`,
                answer: "2003",
            },
            {
                name: "черевичок",
                id: "q 2-1",
                body: `Ви у маленькій кімнаті, позбавленій будь-якого оформлення. Пекора очевидно не намагалася надати своєму лабіринтові естетичного вигляду, все суто функціонально і присвячено одній меті: розважити шалений розум кролика.

Перед вами знаходяться зачинені двері. Над ними червоною фарбою написано “I am alone”. Зліва на постаменті стоїть коробка. Ви відкриваєте її та бачите всередині акрилові фігурки всіх дівчат із японської гілки Гололайву. Навпроти стоять інші два постаменти. На лівому написано наступне: “Я була там один раз, і зі мною було більше всього партнерів”. На правому написано наступне: “Я єдина, чиї партнери, що там були зі мною в один із разів, всі більше не з'являлися".

Яку акрилку ви поставите на який постамент?

-----

/navigate back
/answer 1Name2Name`,
                answer: "1choco2pekora",
            },
            {
                name: "q 2-2 name",
                id: "q 2-2",
                body: `Знову двері за вами зачиняються, знову коридор з факелами… Цього разу двері були лише одні.

Ви їх відкриваєте - і там та сама картина: майже пуста кімната з голими стінами та замкнені двері. Коло них на цей раз панель для вводу паролю із літер, на її екранчику коротке запитання: “Who am I?”

Під дверима стоїть невеличка картонна коробка. Всередині анонімні валентинки, без тексту повідомлень, але підписані:

“Від твого боса”
“Від твоєї єдиної законної жінки!”
“Від твого улюбленого обіду”
“Від твоєї подруги за духом шипперства”

Імʼя якої дівчинки ви введете на панелі?

-----

/answer Name`,
                answer: "botan",
            },
            {
                name: "рожеві двері",
                id: "q 2-3",
                body: `У цій кімнаті лише одна коробка. На коробці є наступний напис: "М___. Від твоєї сестри за сміхом із Франції".

Ви відкриваєте коробку і дістаєте звідти зелену парасольку, білий капелюшок і біле плаття.

Судячи з усього, для того, щоб пройти до наступної кімнати, потрібно заповнити пропущені літери. Але чому сестра за сміхом? Чому саме ці предмети? І чому з Франції?

-----

/navigate back
/answer Мабв`,
                answer: "моне",
            },
            {
                name: "q 2-4 name",
                id: "q 2-4",
                body: `Ви входите у наступну кімнату і бачите перед собою велику башту. На ній зображені такі символи: саке, комета, квітка вишні, кукурудза та фейєрверк. На вершині башти ви бачите місце під статуетку, а на підлозі стоїть скриня з фігурками дівчат.

Чию фігурку ви поставите на вершину башти?

-----

/answer Name`,
                answer: "sora",
            },
            {
                name: "поворот",
                id: "q 3-3",
                body: `“Шорткат” привів вас у дуже маленьку кімнатку із трьома дверима. Одні з них знаходяться прямо навпроти вас, тому ви робите висновок, що сюди можна було потрапити й альтернативним шляхом. Треті ж позолочені, а перед ними кодовий замок із паролем.

Перед дверима стоїть стіл, на якому лежить пергамент. На пергаменті ви бачите наступне:

Ім'я якої дівчинки ви введете на панелі?

-----

/navigate back
/answer Name`,
                answer: "luna",
                photoId: "AAMCAgADGQEAAgJ6ZUAzoBQMifnc3NE-BjPd2s0wNVgAAqpCAAJ4NgABSvIJVOdnsdG_AQAHbQADMAQ"
            },
            {
                name: "q 5 name",
                id: "q 5",
                body: `message 5
/answer 5`,
                answer: "5",
            },
            {
                name: "q 6 name",
                id: "q 6",
                body: `Трьох ключів вам дійсно було достатньо, щоб пройти далі. За дверима на цей раз відсутній коридор - вони відразу ведуть у... Гараж? Принаймні, виглядає це приміщення саме так, хоча в ньому і нема жодних транспортних засобів.

Цього разу вам пропонується доповнити табличку на моніторі. Єдине пояснення до загадки: "Вже два роки я не можу навіть наблизитися до вершини! Але є ті, хто вже там три роки поспіль..."

1-2-1 - ???
4-1-4 - ???
3-3-2 - ???
8-8-6 - ???

Імена яких чотирьох дівчат ви введете?

-----

/answer Name Name Name Name`,
                answer: "suisei okayu marine subaru",
            },
        ],
    },
    states: {
        start: {
            tags: ["choice"],
            on: {
                "/navigate q 1-1": {
                    target: "q 1-1",
                },
                "/navigate q 2-1": {
                    target: "q 2-1",
                },
            },
        },
        "q 1-1": {
            tags: ["question"],
            on: {
                "/navigate start": {
                    target: "start",
                },
                "/answer q 1-1": {
                    actions: assign((context) => {
                        return {
                            ...context,
                            choices: context.choices.map(choice => {
                                if (choice.name === "start") {
                                    return {
                                        ...choice,
                                        active: false,
                                    }
                                }

                                return choice
                            })

                        }
                    }),
                    target: "q 1-2",
                    cond: (context, event) =>
                        event.answer ===
                        context.questions.filter(
                            (question) => question.id === "q 1-1"
                        )[0].answer,
                },
            },
        },
        "q 1-2": {
            tags: ["question"],
            on: {
                "/answer q 1-2": {
                    actions: assign((context) => {
                        return {
                            ...context,
                            choices: context.choices.map((choice) => {
                                if (choice.name === "c 1-2") {
                                    return {
                                        ...choice,
                                        active: true,
                                    };
                                }
                                return choice;
                            }),
                        };
                    }),

                    target: "c 1-2",
                    cond: (context, event) =>
                        event.answer ===
                        context.questions.filter(
                            (question) => question.id === "q 1-2"
                        )[0].answer,
                },
            },
        },
        "c 1-2": {
            tags: ["choice"],
            on: {
                "/navigate q 1-3": {
                    target: "q 1-3",
                },
                "/navigate q 3-3": {
                    target: "q 3-3",
                },
            },
        },
        "q 1-3": {
            tags: ["question"],
            on: {
                "/answer q 1-3": {
                    target: "q 1-4",
                    cond: (context, event) =>
                        event.answer ===
                        context.questions.filter(
                            (question) => question.id === "q 1-3"
                        )[0].answer,
                },
                "/naviagte back": {
                    target: "c 1-2",
                },
            },
        },
        "q 1-4": {
            tags: ["question"],
            on: {
                "/answer q 1-4": {
                    target: "q 5",
                    cond: (context, event) =>
                        event.answer ===
                        context.questions.filter(
                            (question) => question.id === "q 1-4"
                        )[0].answer,
                },
            },
        },

        "q 2-1": {
            tags: ["question"],
            on: {
                "/navigate start": {
                    target: "start",
                },
                "/answer q 2-1": {
                    actions: assign((context) => {
                        return {
                            ...context,
                            choices: context.choices.map(choice => {
                                if (choice.name === "start") {
                                    return {
                                        ...choice,
                                        active: false,
                                    }
                                }

                                return choice
                            })

                        }
                    }),
                    target: "q 2-2",
                    cond: (context, event) =>
                        event.answer ===
                        context.questions.filter(
                            (question) => question.id === "q 2-1"
                        )[0].answer,
                },
            },
        },
        "q 2-2": {
            tags: ["question"],
            on: {
                "/answer q 2-2": {
                    actions: assign((context) => {
                        return {
                            ...context,
                            choices: context.choices.map((choice) => {
                                if (choice.name === "c 2-2") {
                                    return {
                                        ...choice,
                                        active: true,
                                    };
                                }
                                return choice;
                            }),
                        };
                    }),
                    target: "c 2-2",
                    cond: (context, event) =>
                        event.answer ===
                        context.questions.filter(
                            (question) => question.id === "q 2-2"
                        )[0].answer,
                },
            },
        },
        "c 2-2": {
            on: {
                "/navigate 2-3": {
                    target: "q 2-3",
                },
                "/navigate 3-3": {
                    target: "q 3-3",
                },
            },
        },
        "q 2-3": {
            tags: ["question"],
            on: {
                "/answer q 2-3": {
                    target: "q 2-4",
                    cond: (context, event) =>
                        event.answer ===
                        context.questions.filter(
                            (question) => question.id === "q 2-3"
                        )[0].answer,
                },
                "/naviagte back": {
                    target: "c 2-2",
                },
            },
        },
        "q 2-4": {
            tags: ["question"],
            on: {
                "/answer q 2-4": {
                    target: "q 5",
                    cond: (context, event) =>
                        event.answer ===
                        context.questions.filter(
                            (question) => question.id === "q 2-4"
                        )[0].answer,
                },
            },
        },
        "q 3-3": {
            tags: ["question"],
            on: {
                "/answer q 3-3": {
                    actions: ((context) => {
                        return {
                            ...context,
                            choices: context.choices.map(choice => {
                                if (choice.name === "c 1-2" || choice.name === "c 2-2") {
                                    return {
                                        ...choice,
                                        active: false
                                    }
                                }

                                if (choice.name === "start") {
                                    return {
                                        ...choice,
                                        active: true
                                    }
                                }

                                return choice
                            })
                        }
                    }),
                    target: "start",
                    cond: (context, event) =>
                        event.answer ===
                        context.questions.filter(
                            (question) => question.id === "q 3-3"
                        )[0].answer,
                },
                "/navigate back 1-2": {
                    target: "c 1-2",
                },
                "/navigate back 2-2": {
                    target: "c 2-2",
                },
            },
        },
        "q 5": {
            tags: ["question"],
            on: {
                "/answer q 5": {
                    target: "q 6",
                    cond: (context, event) =>
                        event.answer ===
                        context.questions.filter(
                            (question) => question.id === "q 5"
                        )[0].answer,
                },
            },
        },
        "q 6": {
            tags: ["question"],
            on: {
                "/answer q 6": {
                    target: "end",
                    cond: (context, event) =>
                        event.answer ===
                        context.questions.filter(
                            (question) => question.id === "q 6"
                        )[0].answer,
                },
            },
        },
        end: {
            tags: ["fin"],
            type: "final",
        },
    },
});

export default eventMachine;
