import emojiRegex from 'emoji-regex';
import unicodeEmojis from './unicode-emojis';

type Maybe<T> = T | undefined | null;
export type EmojiVersion = "0.6" |
    "0.7" |
    "1.0" |
    "2.0" |
    "3.0" |
    "4.0" |
    "5.0" |
    "11.0" |
    "12.0" |
    "12.1" |
    "13.0" |
    "13.1" |
    "14.0" |
    "15.0";
type CodePoint = string;
export type Emoji = {
    emoji: string
    components?: Maybe<Array<string>>
    description?: Maybe<string>
    version: EmojiVersion
    keywords?: Maybe<Array<string>>
    codePoint?: Maybe<CodePoint>
    codePoints?: Maybe<Array<CodePoint>>
    category?: Maybe<string>
    group?: Maybe<string>
    subgroup?: Maybe<string>
    variations?: Maybe<Array<Emoji>>
}
type Group = 'category' | 'group' | 'subgroup';

export function getAllEmojis(emojis?: Array<Emoji>) {
    return (emojis ?? unicodeEmojis.emojis)
        .map(e => [e.emoji, ...(e.variations ?? []).map(v => v.emoji)])
        .flat();
}

export function compareVersion(a: EmojiVersion, b: EmojiVersion, exact?: boolean) {
    if (exact) return parseFloat(a) === parseFloat(b);
    return parseFloat(a) <= parseFloat(b);
}

export function getEmojis(version: EmojiVersion, exact?: boolean, emoijs?: Array<Emoji>) {
    const filteredEmojis: Array<Emoji> = [];

    for (const emoji of (emoijs ?? unicodeEmojis.emojis)) {
        if (compareVersion(emoji.version, version, exact)) {
            if (emoji.variations) {
                emoji.variations = getEmojis(version, exact, emoji.variations)
            }
            filteredEmojis.push(emoji);
        }
    }

    return filteredEmojis;
}

export function getEmojisByGroup(group: Group, emojis?: Array<Emoji>) {
    const map = new Map<string, Array<Emoji>>();
    for (const emoji of (emojis ?? unicodeEmojis.emojis)) {
        const groupItem = emoji[group];
        if (groupItem) {
            const item = map.get(groupItem) ?? [];
            item.push(emoji);
            map.set(groupItem, item);
        }
    }
    return map;
}

export function getAllComponents() {
    return unicodeEmojis.components;
}

export function getEmojiRegex() {
    return emojiRegex();
}

export function hasEmoji(text: string) {
    return getEmojiRegex().test(text);
}

export function extractEmojis(text: string) {
    const emojis = getAllEmojis();
    return Array.from(text.matchAll(getEmojiRegex()))
        .map(match => match[0])
        .map(emojiStr => emojis.find(e => e === emojiStr))
        .filter(Boolean);
}

export function stripEmojies(text: string) {
    return text.replace(getEmojiRegex(), '');
}

