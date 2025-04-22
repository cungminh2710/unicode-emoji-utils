import emojiRegex from 'emoji-regex-xs';
import unicodeEmojis from './unicode-emojis';

type Maybe<T> = T | undefined | null;
export type EmojiVersion =
	| '0.6'
	| '0.7'
	| '1.0'
	| '2.0'
	| '3.0'
	| '4.0'
	| '5.0'
	| '11.0'
	| '12.0'
	| '12.1'
	| '13.0'
	| '13.1'
	| '14.0'
	| '15.0'
	| '15.1'
	| '16.0';
type CodePoint = string;
export type Emoji = {
	emoji: string;
	components?: Maybe<Array<string>>;
	description?: Maybe<string>;
	version: EmojiVersion;
	keywords?: Maybe<Array<string>>;
	codePoint?: Maybe<CodePoint>;
	codePoints?: Maybe<Array<CodePoint>>;
	category?: Maybe<string>;
	group?: Maybe<string>;
	subgroup?: Maybe<string>;
	variations?: Maybe<Array<Emoji>>;
};
type Group = 'category' | 'group' | 'subgroup';

/**
 * Check whether a value is a valid Emoji Version
 * @param version - Version
 * @returns
 */
export function isValidEmojiVersion(version: any): version is EmojiVersion {
	return (
		version === '0.6' ||
		version === '0.7' ||
		version === '1.0' ||
		version === '2.0' ||
		version === '3.0' ||
		version === '4.0' ||
		version === '5.0' ||
		version === '11.0' ||
		version === '12.0' ||
		version === '12.1' ||
		version === '13.0' ||
		version === '13.1' ||
		version === '14.0' ||
		version === '15.0' ||
		version === '15.1' || 
		version === '16.0'
	);
}

/**
 * Get All Emojis as an array of emoji character
 * @param emojis
 * @returns
 */
export function getAllEmojis(emojis?: Array<Emoji>) {
	return (emojis ?? unicodeEmojis.emojis).map((e) => [e.emoji, ...(e.variations ?? []).map((v) => v.emoji)]).flat();
}

export function compareVersion(a: EmojiVersion, b: EmojiVersion, exact?: boolean) {
	if (exact) return parseFloat(a) === parseFloat(b);
	return parseFloat(a) <= parseFloat(b);
}

/**
 * Filter Emoijs by the Unicode Version
 * @param version
 * @param exact
 * @param emoijs
 * @returns
 */
export function filterEmojis(version: EmojiVersion, exact?: boolean, emoijs?: Array<Emoji>) {
	const filteredEmojis: Array<Emoji> = [];

	for (const emoji of emoijs ?? unicodeEmojis.emojis) {
		if (compareVersion(emoji.version, version, exact)) {
			if (emoji.variations) {
				emoji.variations = filterEmojis(version, exact, emoji.variations);
			}
			filteredEmojis.push(emoji);
		}
	}

	return filteredEmojis;
}

/**
 * Get Emojis by group, category or subgroup
 * @param group category | group | subgroup
 * @param emojis
 * @returns
 */
export function getEmojisByGroup(group: Group, emojis?: Array<Emoji>) {
	const map = new Map<string, Array<Emoji>>();
	for (const emoji of emojis ?? unicodeEmojis.emojis) {
		const groupItem = emoji[group];
		if (groupItem) {
			const item = map.get(groupItem) ?? [];
			item.push(emoji);
			map.set(groupItem, item);
		}
	}
	return map;
}

/**
 * Get Unicode Emoji Components
 * @returns
 */
export function getAllComponents() {
	return unicodeEmojis.components;
}

/**
 * Emoji Regular Expression
 * @returns Emoji Regex
 */
export function getEmojiRegex() {
	return emojiRegex();
}

/**
 * Check whether a given text has emojis
 * @param text
 * @returns text has emojis
 */
export function hasEmoji(text: string) {
	return getEmojiRegex().test(text);
}

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * isString('abc')
 * // => true
 *
 * isString(1)
 * // => false
 */
function isString(value: any): value is string {
	const type = typeof value;
	return (
		type === 'string' ||
		(type === 'object' &&
			value != null &&
			!Array.isArray(value) &&
			Object.prototype.toString.call(value) === '[object String]')
	);
}

/**
 * Extract Emojis in a given text and preserve the order of appearance
 * @param text
 * @returns
 */
export function extractEmojis(text: string) {
	const emojis = getAllEmojis();
	return Array.from(text.matchAll(getEmojiRegex()))
		.map((match) => match[0])
		.map((emojiStr) => emojis.find((e) => e === emojiStr))
		.filter<string>(isString);
}

/**
 * Strip / Remove Emojis in a given text
 * @param text
 * @returns
 */
export function stripEmojies(text: string) {
	return text.replace(getEmojiRegex(), '');
}
