import { createMachine, assign } from "xstate";

interface Choice {
  name: string;
  message: string;
  active: boolean;
}

interface Question {
  name: string;
  body: string;
  answer: string;
}

interface Context {
  choices: Choice[];
  questions: Question[];
}

const eventMachine = createMachine<Context>({
  id: "event",
  initial: "start",
  context: {
    choices: [
      {
        name: "start",
        message: "start message",
        active: false,
      },
      {
        name: "c 1-2",
        message: "start message",
        active: false,
      },
      {
        name: "c 2-2",
        message: "start message",
        active: false,
      },
    ],
    questions: [
      {
        name: "q 1-1",
        body: "message",
        answer: "1-1",
      },
      {
        name: "q 1-2",
        body: "message",
        answer: "1-2",
      },
      {
        name: "q 1-3",
        body: "message",
        answer: "1-3",
      },
      {
        name: "q 1-4",
        body: "message",
        answer: "1-4",
      },
      {
        name: "q 2-1",
        body: "message",
        answer: "2-1",
      },
      {
        name: "q 2-2",
        body: "message",
        answer: "2-2",
      },
      {
        name: "q 2-3",
        body: "message",
        answer: "2-3",
      },
      {
        name: "q 2-4",
        body: "message",
        answer: "2-4",
      },
      {
        name: "q 3-3",
        body: "message",
        answer: "3-3",
      },
      {
        name: "q 5",
        body: "message",
        answer: "5",
      },
      {
        name: "q 6",
        body: "message",
        answer: "6",
      },
    ],
  },
  states: {
    start: {
      on: {
        "/navigate 1-1": {
          target: "q 1-1",
        },
        "/navigate 2-1": {
          target: "q 2-1",
        },
      },
    },
    "q 1-1": {
      on: {
        "/navigate back": {
          target: "start",
        },
        "/answer 1-1": {
          target: "q 1-2",
          cond: () => true,
        },
      },
    },
    "q 1-2": {
      on: {
        "/answer 1-2": {
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
          cond: () => true,
        },
      },
    },
    "c 1-2": {
      on: {
        "/navigate 1-3": {
          target: "q 1-3",
        },
        "/navigate 3-3": {
          target: "q 3-3",
        },
      },
    },
    "q 1-3": {
      on: {
        "/answer 1-3": {
          target: "q 1-4",
          cond: () => true,
        },
        "/naviagte back": {
          target: "c 1-2",
        },
      },
    },
    "q 1-4": {
      on: {
        "/answer 1-4": {
          target: "q 5",
          cond: () => true,
        },
      },
    },

    "q 2-1": {
      on: {
        "/navigate back": {
          target: "start",
        },
        "/answer 2-1": {
          target: "q 2-2",
          cond: () => true,
        },
      },
    },
    "q 2-2": {
      on: {
        "/answer 2-2": {
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
          cond: () => true,
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
      on: {
        "/answer 2-3": {
          target: "q 2-4",
        },
        "/naviagte back": {
          target: "c 2-2",
        },
      },
    },
    "q 2-4": {
      on: {
        "/answer 2-4": {
          target: "q 5",
          cond: () => true
        },
      },
    },
    "q 3-3": {
      on: {
        "/answer 3-3": {
          target: "q 5",
          cond: () => true
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
      on: {
        "/answer 5": {
          target: "q 6",
          cond: () => true
        },
      },
    },
    "q 6": {
      on: {
        "/answer 6": {
          target: "end",
          cond: () => true
        },
      },
    },
    end: {
      type: "final",
    },
  },
});

export default eventMachine;