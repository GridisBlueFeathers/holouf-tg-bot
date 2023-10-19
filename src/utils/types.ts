export type Update = {
    update_id: number;
    message: Message;
}

export type Message = {
    message_id: number;
    date: number;
    text?: string;
    from?: User;
    chat?: Chat;
    entities?: MessageEntity[];
}

export type User = {
    id: number;
    id_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
}

export type Chat = {
    id: number;
    type: "private" | "group" | "supergroup" | "channel";
    title?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
}

export type MessageEntity = {
    type: "mention" | "hashtag" | "bot_command" | "cashtag" | "url" | "email" | "phone_number";
    offset: number;
    length: number;
    url?: string;
    user?: User;
}
