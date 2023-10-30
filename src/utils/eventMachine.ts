import { createMachine, assign } from "xstate";

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
    nextStep: string;
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
                message: `ВИБІР 1

За дверима вас чекав темний коридор, освічений лише слабким мерехтінням факелів на стінах. Варто було вам лише зробити пару кроків у нього, як двері за вами голосно зачинилися. Вам було страшнувато, але ви впевнено покрокували вперед.

Далі ви опинилися перед двома дверима. На лівих була намальована біла квіточка, на правих - блакитний черевичок. Яку ви відкриєте?

/navigate квіточка
/navigate черевичок`,
                active: true,
            },
            {
                name: "c 1-2",
                message: `/naviagte q 1-3
/navigate q 3-3`,
                active: false,
            },
            {
                name: "c 2-2",
                message: `/naviagte q 2-3
/navigate q 3-3`,
                active: false,
            },
        ],
        questions: [
            {
                name: "квіточка",
                id: "q 1-1",
                body: `message 1-1
/navigate back
/answer 1-1`,
                answer: "1-1",
                nextStep: "q 1-2",
            },
            {
                name: "q 1-2 name",
                id: "q 1-2",
                body: `message 1-2
/answer 1-2`,
                answer: "1-2",
                nextStep: "c 1-2",
            },
            {
                name: "q 1-3 name",
                id: "q 1-3",
                body: `message 1-3
/navigate back
/answer 1-3`,
                answer: "1-3",
                nextStep: "q 1-4",
            },
            {
                name: "q 1-4 name",
                id: "q 1-4",
                body: `message 1-4
/answer 1-4`,
                answer: "1-4",
                nextStep: "q 5",
            },
            {
                name: "черевичок",
                id: "q 2-1",
                body: `message 2-1
/navigate back
/answer 2-1`,
                answer: "2-1",
                nextStep: "q 2-2",
            },
            {
                name: "q 2-2 name",
                id: "q 2-2",
                body: `message 2-2
/answer 2-2`,
                answer: "2-2",
                nextStep: "c 2-2",
            },
            {
                name: "q 2-3 name",
                id: "q 2-3",
                body: `message 2-3
/navigate back
/answer 2-3`,
                answer: "2-3",
                nextStep: "q 2-4",
            },
            {
                name: "q 2-4 name",
                id: "q 2-4",
                body: `message 2-4
/answer 2-4`,
                answer: "2-4",
                nextStep: "q 5",
            },
            {
                name: "q 3-3 name",
                id: "q 3-3",
                body: `message 3-3
/navigate back
/answer 3-3`,
                answer: "3-3",
                nextStep: "q 5",
            },
            {
                name: "q 5 name",
                id: "q 5",
                body: `message 5
/answer 5`,
                answer: "5",
                nextStep: "q 6",
            },
            {
                name: "q 6 name",
                id: "q 6",
                body: `message 6
/answer 6`,
                answer: "6",
                nextStep: "end",
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
                            (question) => question.name === "q 1-1"
                        ),
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
                            (question) => question.name === "q 1-2"
                        ),
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
                            (question) => question.name === "q 1-3"
                        ),
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
                            (question) => question.name === "q 1-4"
                        ),
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
                            (question) => question.name === "q 2-1"
                        ),
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
                            (question) => question.name === "q 2-2"
                        ),
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
                            (question) => question.name === "q 2-3"
                        ),
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
                            (question) => question.name === "q 2-4"
                        ),
                },
            },
        },
        "q 3-3": {
            tags: ["question"],
            on: {
                "/answer q 3-3": {
                    target: "q 5",
                    cond: (context, event) =>
                        event.answer ===
                        context.questions.filter(
                            (question) => question.name === "q 3-3"
                        ),
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
                            (question) => question.name === "q 5"
                        ),
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
                            (question) => question.name === "q 6"
                        ),
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
