export interface Update {
    update_id: number;
    message: UserMessage;
}

export interface BotMessage {
    text: string;
    chat_id: number | string;
    entities?: MessageEntity[];
	link_preview_options?: LinkPreviewOptions;
}

export interface PhotoBotMessage extends Omit<BotMessage, "text" | "entities" | "link_preview_options"> {
	photo: string;
	caption_entities?: MessageEntity[];
	caption?: string;
}

export interface UserMessage extends Omit<BotMessage, "chat_id" | "text"> {
	chat: Chat;
    message_id: number;
    date: number;
    from?: User;
	text?: string;
}

export interface User {
    id: number;
    id_bot: boolean;
    first_name: string;
    last_name?: string;
    username?: string;
}

interface Chat {
    id: number;
    type: "private" | "group" | "supergroup" | "channel";
    title?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
}

export interface MessageEntity {
    type: "mention" | "hashtag" | "bot_command" | "cashtag" | "url" | "email" | "phone_number" | "text_link";
    offset: number;
    length: number;
    url?: string;
    user?: User;
}

interface LinkPreviewOptions {
	is_disabled?: boolean;
	url?: string;
	prefer_smaller_media?: boolean;
	prefer_large_media?: boolean;
	show_above_text?: boolean;
}

export interface UserFields {
	tag: string;
	name: string;
	birthday: string;
	location: string;
	hololiverFrom: string;
	oshi: string;
	contentType: string;
	freeSpace?: string;
}
