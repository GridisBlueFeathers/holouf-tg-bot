import { createMachine, assign } from "xstate";

interface Split {
    name: string;
    basicMessage: string;
    count: number;
    active: boolean;
}

interface Question {
    split: string;
    name: string;
    body: string;
    answer: string;
    active: boolean;
}

interface Context {
    splits: Split[];
    questions: Question[];
}

const eventMachine = createMachine<Context>({
    predictableActionArguments: true,
    id: "event",
    initial: "oneSplit",
    context: {
        splits: [
            {
                name: "oneSplit",
                basicMessage: "This is split one",
                count: 0,
                active: true,
            },
            {
                name: "twoSplit",
                basicMessage: "This is split two",
                count: 0,
                active: false,
            },
        ],
        questions: [
            {
                split: "oneSplit",
                name: "oneOne",
                body: `Body of the first question of the first section
to pass enter
/answer oneOne`,
                answer: "oneOne",
                active: true,
            },
            {
                split: "oneSplit",
                name: "oneTwo",
                body: `Body of the second question of the first section
to pass enter
/answer oneTwo`,
                answer: "oneTwo",
                active: true,
            },
            {
                split: "oneSplit",
                name: "oneThree",
                body: `Body of the third question of the first section
to pass enter
/answer oneThree`,
                answer: "oneThree",
                active: true,
            },
            {
                split: "oneSplit",
                name: "oneFour",
                body: `Body of the fourth question of the first section
to pass enter
/answer oneFour`,
                answer: "oneFour",
                active: true,
            },
            {
                split: "twoSplit",
                name: "twoOne",
                body: `Body of the first question of the second section
to pass enter
/answer twoOne`,
                answer: "twoOne",
                active: true,
            },
            {
                split: "twoSplit",
                name: "twoTwo",
                body: `Body of the second question of the second section
to pass enter
/answer twoTwo`,
                answer: "twoTwo",
                active: true,
            },
            {
                split: "twoSplit",
                name: "twoThree",
                body: `Body of the third question of the second section
to pass enter
/answer twoThree`,
                answer: "twoThree",
                active: true,
            },
            {
                split: "twoSplit",
                name: "twoFour",
                body: `Body of the fourth question of the second section
to pass enter
/answer twoFour`,
                answer: "twoFour",
                active: true,
            },
        ],
    },
    states: {
        oneSplit: {
            tags: ["split"],
            on: {
                oneOne: {
                    target: "oneOne",
                    cond: (context) =>
                    context.questions.filter(
                        (question) => question.name === "oneOne"
                    )[0].active === true,
                },
                oneTwo: {
                    target: "oneTwo",
                    cond: (context) =>
                    context.questions.filter(
                        (question) => question.name === "oneTwo"
                    )[0].active === true,
                },

                oneThree: {
                    target: "oneThree",
                    cond: (context) =>
                    context.questions.filter(
                        (question) => question.name === "oneThree"
                    )[0].active === true,
                },

                oneFour: {
                    target: "oneFour",
                    cond: (context) =>
                    context.questions.filter(
                        (question) => question.name === "oneFour"
                    )[0].active === true,
                },
            },
            always: {
                target: "twoSplit",
                actions: assign((context) => {
                    return {
                        ...context,
                        splits: context.splits.map(split => {
                            if (split.name === "oneSplit") {
                                return {
                                    ...split,
                                    active: false,
                                };
                            };

                            if (split.name === "twoSplit") {
                                return {
                                    ...split,
                                    active: true,
                                };
                            };
                            
                            return split;
                            
                        })
                    }
                }),
                cond: (context) =>
                context.splits.filter((split) => split.name === "oneSplit")[0]
                .count === 2,
            },
        },

        oneOne: {
            tags: ["question"],
            on: {
                oneSplit: {
                    actions: assign((context) => {
                        return {
                            ...context,
                            splits: context.splits.map((split) => {
                                if (split.name === "oneSplit") {
                                    return {
                                        ...split,
                                        count: split.count + 1,
                                    };
                                }

                                return split;
                            }),
                            questions: context.questions.map((question) => {
                                if (question.name === "oneOne") {
                                    return {
                                        ...question,
                                        active: false,
                                    };
                                }

                                return question;
                            }),
                        };
                    }),
                    target: "oneSplit",
                    cond: (context, event) => event.answer === context.questions.filter(question => question.name === "oneOne")[0].answer, //will change to correct answer check
                },
                    goBack: "oneSplit",
            },
        },

        oneTwo: {
            tags: ["question"],
            on: {
                oneSplit: {
                    actions: assign((context) => {
                        return {
                            ...context,
                            splits: context.splits.map((split) => {
                                if (split.name === "oneSplit") {
                                    return {
                                        ...split,
                                        count: split.count + 1,
                                    };
                                }

                                return split;
                            }),
                            questions: context.questions.map((question) => {
                                if (question.name === "oneTwo") {
                                    return {
                                        ...question,
                                        active: false,
                                    };
                                }

                                return question;
                            }),
                        };
                    }),
                    target: "oneSplit",
                    cond: (context, event) => event.answer === context.questions.filter(question => question.name === "oneTwo")[0].answer, //will change to correct answer check
                },
                    goBack: "oneSplit",
            },
        },

        oneThree: {
            tags: ["question"],
            on: {
                oneSplit: {
                    actions: assign((context) => {
                        return {
                            ...context,
                            splits: context.splits.map((split) => {
                                if (split.name === "oneSplit") {
                                    return {
                                        ...split,
                                        count: split.count + 1,
                                    };
                                }

                                return split;
                            }),
                            questions: context.questions.map((question) => {
                                if (question.name === "oneThree") {
                                    return {
                                        ...question,
                                        active: false,
                                    };
                                }

                                return question;
                            }),
                        };
                    }),
                    target: "oneSplit",
                    cond: (context, event) => event.answer === context.questions.filter(question => question.name === "oneThree")[0].answer, //will change to correct answer check
                },
                    goBack: "oneSplit",
            },
        },

        oneFour: {
            tags: ["question"],
            on: {
                oneSplit: {
                    actions: assign((context) => {
                        return {
                            ...context,
                            splits: context.splits.map((split) => {
                                if (split.name === "oneSplit") {
                                    return {
                                        ...split,
                                        count: split.count + 1,
                                    };
                                }

                                return split;
                            }),
                            questions: context.questions.map((question) => {
                                if (question.name === "oneFour") {
                                    return {
                                        ...question,
                                        active: false,
                                    };
                                }

                                return question;
                            }),
                        };
                    }),
                    target: "oneSplit",
                    cond: (context, event) => event.answer === context.questions.filter(question => question.name === "oneFour")[0].answer, //will change to correct answer check
                },
                    goBack: "oneSplit",
            },
        },

        twoSplit: {
            tags: ["split"],
            on: {
                twoOne: {
                    target: "twoOne",
                    cond: (context) =>
                    context.questions.filter(
                        (question) => question.name === "twoOne"
                    )[0].active === true,
                },
                twoTwo: {
                    target: "twoTwo",
                    cond: (context) =>
                    context.questions.filter(
                        (question) => question.name === "twoTwo"
                    )[0].active === true,
                },

                twoThree: {
                    target: "twoThree",
                    cond: (context) =>
                    context.questions.filter(
                        (question) => question.name === "twoThree"
                    )[0].active === true,
                },

                twoFour: {
                    target: "twoFour",
                    cond: (context) =>
                    context.questions.filter(
                        (question) => question.name === "twoFour"
                    )[0].active === true,
                },
            },
            always: {
                target: "end",
                cond: (context) =>
                context.splits.filter((split) => split.name === "twoSplit")[0]
                .count === 2,
            },
        },

        twoOne: {
            tags: ["question"],
            on: {
                twoSplit: {
                    actions: assign((context) => {
                        return {
                            ...context,
                            splits: context.splits.map((split) => {
                                if (split.name === "twoSplit") {
                                    return {
                                        ...split,
                                        count: split.count + 1,
                                    };
                                }

                                return split;
                            }),
                            questions: context.questions.map((question) => {
                                if (question.name === "twoOne") {
                                    return {
                                        ...question,
                                        active: false,
                                    };
                                }

                                return question;
                            }),
                        };
                    }),
                    target: "twoSplit",
                    cond: (context, event) => event.answer === context.questions.filter(question => question.name === "twoOne")[0].answer, //will change to correct answer check
                },
                    goBack: "twoSplit",
            },
        },

        twoTwo: {
            tags: ["question"],
            on: {
                twoSplit: {
                    actions: assign((context) => {
                        return {
                            ...context,
                            splits: context.splits.map((split) => {
                                if (split.name === "twoSplit") {
                                    return {
                                        ...split,
                                        count: split.count + 1,
                                    };
                                }

                                return split;
                            }),
                            questions: context.questions.map((question) => {
                                if (question.name === "twoTwo") {
                                    return {
                                        ...question,
                                        active: false,
                                    };
                                }

                                return question;
                            }),
                        };
                    }),
                    target: "twoSplit",
                    cond: (context, event) => event.answer === context.questions.filter(question => question.name === "twoTwo")[0].answer, //will change to correct answer check
                },
                    goBack: "twoSplit",
            },
        },

        twoThree: {
            tags: ["question"],
            on: {
                twoSplit: {
                    actions: assign((context) => {
                        return {
                            ...context,
                            splits: context.splits.map((split) => {
                                if (split.name === "twoSplit") {
                                    return {
                                        ...split,
                                        count: split.count + 1,
                                    };
                                }

                                return split;
                            }),
                            questions: context.questions.map((question) => {
                                if (question.name === "twoThree") {
                                    return {
                                        ...question,
                                        active: false,
                                    };
                                }

                                return question;
                            }),
                        };
                    }),
                    target: "twoSplit",
                    cond: (context, event) => event.answer === context.questions.filter(question => question.name === "twoThree")[0].answer, //will change to correct answer check
                },
                    goBack: "twoSplit",
            },
        },

        twoFour: {
            tags: ["question"],
            on: {
                twoSplit: {
                    actions: assign((context) => {
                        return {
                            ...context,
                            splits: context.splits.map((split) => {
                                if (split.name === "twoSplit") {
                                    return {
                                        ...split,
                                        count: split.count + 1,
                                    };
                                }

                                return split;
                            }),
                            questions: context.questions.map((question) => {
                                if (question.name === "twoFour") {
                                    return {
                                        ...question,
                                        active: false,
                                    };
                                }

                                return question;
                            }),
                        };
                    }),
                    target: "twoSplit",
                    cond: (context, event) => event.answer === context.questions.filter(question => question.name === "twoFour")[0].answer, //will change to correct answer check
                },
                    goBack: "twoSplit",
            },
        },

        end: {
            tags: ["fin"],
            type: "final",
        },
    },
});

export default eventMachine;
