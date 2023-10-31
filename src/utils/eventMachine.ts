import { createMachine, assign } from "xstate";

interface Split {
    name: string;
    basicMessage: string;
    count: number;
}

interface Choice {
    name: string;
    message: string;
    active: boolean;
}

interface Question {
    name: string;
    id: string;
    body: string;
    answer: string;
    photoId?: string;
    active?: boolean;
}

interface Context {
    splits: Split[];
    choices: Choice[];
    questions: Question[];
}

const eventMachine = createMachine<Context>({
    predictableActionArguments: true,
    id: "event",
    initial: "start",
    context: {
        splits: [
            {
                name: "s 5",
                basicMessage: `Ви опинилися у великому круглому залі з високою стелею. Перед вами знову закриті двері, на яких замок із трьома отворами. У кімнаті стоять пʼять статуй, стилізованих під Майнкрафт. Ви впізнаєте у них працівниць Усада Кенсецу. Перед кожною фігурою невеличка вітрина із кодовим замком на 4 цифри, а усередині - золотий ключ. Усі ключі однакові, тому ви робите висновок, що вам треба зібрати лише 3 із них. До якої із статуй ви підійдете?

-----

`,
                count: 0
            }
        ],
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
/answer 1A2B...`,
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
                photoId: "AgACAgIAAxkBAAIDAAFlQEd7Ej5G9sF2DBUVPgvhNZ7gLQAC-dMxG0OGAUqxTDKPhAIBVgEAAwIAA3MAAzAE"
            },
            {
                name: "kiara",
                id: "q 5-1",
                body: `Як відомо, фенікси вміють відроджуватися із попелу. Скільки разів я “починала спочатку”?

-----

/navigate back
/answer 1234`,
                answer: "0003",
                active: true
            },
            {
                name: "botan",
                id: "q 5-2",
                body: `Як відомо, я лише один раз випускала пісню дуетом не з Ватаме. Якого року вийшов оригінал цієї пісні?

-----

/navigate back
/answer 1234`,
                answer: "2008",
                active: true
            },
            {
                name: "pekora",
                id: "q 5-3",
                body: `Як відомо, мені подобається милуватися собою. Особливо якщо моє обличчя на грошових купюрах, пеко! Навіть якщо це муляж, який був мій номінал?

-----

/navigate back
/answer 1234`,
                answer: "0112",
                active: true
            },
            {
                name: "towa",
                id: "q 5-4",
                body: `Як відомо, я дуже люблю співати разом із друзями. Саме стільки гостей було на моїх міксах?
-----

/navigate back
/answer 1234`,
                answer: "0018",
                active: true
            },
            {
                name: "moona",
                id: "q 5-5",
                body: `Як відомо, я обожнюю співати та грати в ігри. Саме в той день я поставила свій особистий рекорд: не всі частини були наживо, але все одно, сто є сто.

-----

/navigate back
/answer 1234`,
                answer: "2203",
                active: true
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
                "/navigate c 1-2": {
                    target: "c 1-2",
                },
            },
        },
        "q 1-4": {
            tags: ["question"],
            on: {
                "/answer q 1-4": {
                    target: "s 5",
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
                "/navigate q 2-3": {
                    target: "q 2-3",
                },
                "/navigate q 3-3": {
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
                "/navigate c 2-2": {
                    target: "c 2-2",
                },
            },
        },
        "q 2-4": {
            tags: ["question"],
            on: {
                "/answer q 2-4": {
                    target: "s 5",
                    cond: (context, event) =>
                        event.answer ===
                        context.questions.filter(
                            (question) => question.id === "q 2-4"
                        )[0].answer,
                },
            },
        },
        "q 3-3": {
            tags: ["question", "trap"],
            on: {
                "/answer q 3-3": {
                    actions: assign((context) => {
                        return {
                            ...context,
                            choices: context.choices.map(choice => {
                                if ((choice.name === "c 1-2") || (choice.name === "c 2-2")) {
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
                "/navigate c 1-2": {
                    target: "c 1-2",
                },
                "/navigate c 2-2": {
                    target: "c 2-2",
                },
            },
        },
        "s 5": {
            tags: ["split"],
            on: {
                "/navigate q 5-1": {
                    target: "q 5-1",
                    cond: (context) => context.questions.filter(question => question.id === "q 5-1")[0].active === true
                },
                "/navigate q 5-2": {
                    target: "q 5-2",
                    cond: (context) => context.questions.filter(question => question.id === "q 5-2")[0].active === true
                },
                "/navigate q 5-3": {
                    target: "q 5-3",
                    cond: (context) => context.questions.filter(question => question.id === "q 5-3")[0].active === true
                },
                "/navigate q 5-4": {
                    target: "q 5-4",
                    cond: (context) => context.questions.filter(question => question.id === "q 5-4")[0].active === true
                },
                "/navigate q 5-5": {
                    target: "q 5-5",
                    cond: (context) => context.questions.filter(question => question.id === "q 5-5")[0].active === true
                },
            },
            always: {
                target: "q 6",
                cond: (context) => context.splits.filter(split => split.name === "s 5")[0].count === 3
            }
        },
        "q 5-1": {
            tags: ["splitQuestion"],
            on: {
                "/answer q 5-1": {
                    target: "s 5",
                    cond: (context, event) => event.answer === context.questions.filter(question => question.id === "q 5-1")[0].answer,
                    actions: assign((context) => {
                        return {
                            ...context,
                            splits: context.splits.map(split => {
                                if (split.name === "s 5") {
                                    return {
                                        ...split,
                                        count: split.count + 1
                                    }
                                }

                                return split
                            }),
                            questions: context.questions.map(question => {
                                if (question.id === "q 5-1") {
                                    return {
                                        ...question,
                                        active: false,
                                    }
                                }

                                return question;
                            })
                        }
                    })
                },
                "/navigate s 5": {
                    target: "s 5"
                }
            }
        },
        "q 5-2": {
            tags: ["splitQuestion"],
            on: {
                "/answer q 5-2": {
                    target: "s 5",
                    cond: (context, event) => event.answer === context.questions.filter(question => question.id === "q 5-2")[0].answer,
                    actions: assign((context) => {
                        return {
                            ...context,
                            splits: context.splits.map(split => {
                                if (split.name === "s 5") {
                                    return {
                                        ...split,
                                        count: split.count + 1
                                    }
                                }

                                return split
                            }),
                            questions: context.questions.map(question => {
                                if (question.id === "q 5-2") {
                                    return {
                                        ...question,
                                        active: false,
                                    }
                                }

                                return question;
                            })
                        }
                    })
                },
                "/navigate s 5": {
                    target: "s 5"
                }
            }
        },
        "q 5-3": {
            tags: ["splitQuestion"],
            on: {
                "/answer q 5-3": {
                    target: "s 5",
                    cond: (context, event) => event.answer === context.questions.filter(question => question.id === "q 5-3")[0].answer,
                    actions: assign((context) => {
                        return {
                            ...context,
                            splits: context.splits.map(split => {
                                if (split.name === "s 5") {
                                    return {
                                        ...split,
                                        count: split.count + 1
                                    }
                                }

                                return split
                            }),
                            questions: context.questions.map(question => {
                                if (question.id === "q 5-3") {
                                    return {
                                        ...question,
                                        active: false,
                                    }
                                }

                                return question;
                            })
                        }
                    })
                },
                "/navigate s 5": {
                    target: "s 5"
                }
            }
        },
        "q 5-4": {
            tags: ["splitQuestion"],
            on: {
                "/answer q 5-4": {
                    target: "s 5",
                    cond: (context, event) => event.answer === context.questions.filter(question => question.id === "q 5-4")[0].answer,
                    actions: assign((context) => {
                        return {
                            ...context,
                            splits: context.splits.map(split => {
                                if (split.name === "s 5") {
                                    return {
                                        ...split,
                                        count: split.count + 1
                                    }
                                }

                                return split
                            }),
                            questions: context.questions.map(question => {
                                if (question.id === "q 5-4") {
                                    return {
                                        ...question,
                                        active: false,
                                    }
                                }

                                return question;
                            })
                        }
                    })
                },
                "/navigate s 5": {
                    target: "s 5"
                }
            }
        },
        "q 5-5": {
            tags: ["splitQuestion"],
            on: {
                "/answer q 5-5": {
                    target: "s 5",
                    cond: (context, event) => event.answer === context.questions.filter(question => question.id === "q 5-5")[0].answer,
                    actions: assign((context) => {
                        return {
                            ...context,
                            splits: context.splits.map(split => {
                                if (split.name === "s 5") {
                                    return {
                                        ...split,
                                        count: split.count + 1
                                    }
                                }

                                return split
                            }),
                            questions: context.questions.map(question => {
                                if (question.id === "q 5-5") {
                                    return {
                                        ...question,
                                        active: false,
                                    }
                                }

                                return question;
                            })
                        }
                    })
                },
                "/navigate s 5": {
                    target: "s 5"
                }
            }
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
