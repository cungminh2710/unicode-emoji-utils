import {
	type Emoji,
	getAllEmojis,
	hasEmoji,
	compareVersion,
	stripEmojies,
	filterEmojis,
	getAllComponents,
	extractEmojis,
	getEmojisByGroup,
	isValidEmojiVersion,
} from '../';
import unicodeEmojis from '../unicode-emojis';

const ztring = 'adfsadfs safdsaf dsafds ';
const ztringWithEmoji = '👋🏼adfsadfs safdsaf dsafds 🫶';

const testCases = ['🫶', '👋🏼', '🙏🏿', '👨🏻‍🤝‍👨🏼', '👬'];
const testEmojis: Array<Emoji> = testCases.map<Emoji>((e) => ({ emoji: e, version: '1.0', group: 'test' }));

test('hasEmoji', () => {
	expect(hasEmoji(ztring)).toBe(false);
	expect(hasEmoji(ztringWithEmoji)).toBe(true);
});

test('stripEmojis', () => {
	expect(stripEmojies(ztring)).toBe(ztring);
	expect(stripEmojies(ztringWithEmoji)).toBe(ztring);
});

test('extractEmojis', () => {
	expect(extractEmojis(ztring)).toEqual([]);
	expect(extractEmojis(ztringWithEmoji)).toEqual(['👋🏼', '🫶']);
});

test('getAllEmojis', () => {
	expect(getAllEmojis(testEmojis)).toEqual(testCases);
	expect(getAllEmojis(testEmojis).includes('🧑🏿‍🤝‍🧑🏿')).toBe(false);

	const allEmojis = getAllEmojis();

	for (const testCase of testCases) {
		expect(allEmojis.includes(testCase)).toBe(true);
	}
});

test('filterEmojis', () => {
	expect(filterEmojis('1.0', false, testEmojis)).toEqual(testEmojis);
	expect(filterEmojis('1.0', true, testEmojis)).toEqual(testEmojis);
	expect(getAllEmojis(filterEmojis('1.0', true)).includes('😂')).toBe(false); // v0.6
	expect(getAllEmojis(filterEmojis('1.0', true)).includes('👨🏻‍🤝‍👨🏽')).toBe(false); // v12.1
	expect(getAllEmojis(filterEmojis('1.0', true)).includes('🙂‍↔️')).toBe(false); // v15.1 - head shaking
	expect(getAllEmojis(filterEmojis('1.0', true)).includes('🫜')).toBe(false); // v16.0 - root vegetable
	expect(getAllEmojis(filterEmojis('1.0')).includes('😂')).toBe(true);
	expect(getAllEmojis(filterEmojis('1.0')).includes('👨🏻‍🤝‍👨🏽')).toBe(false);
});

test('getEmojisByGroup', () => {
	getEmojisByGroup('group', testEmojis).forEach((emojis, key) =>
		expect(emojis.every((emoji) => emoji.group === key)).toBe(true)
	);

	const emojisByGroup = getEmojisByGroup('group');
	emojisByGroup.forEach((emojis, key) => expect(emojis.every((emoji) => emoji.group === key)).toBe(true));

	const emojisByCategory = getEmojisByGroup('category');
	emojisByCategory.forEach((emojis, key) => expect(emojis.every((emoji) => emoji.category === key)).toBe(true));

	const emojisBySubgroup = getEmojisByGroup('subgroup');
	emojisBySubgroup.forEach((emojis, key) => expect(emojis.every((emoji) => emoji.subgroup === key)).toBe(true));
});

test('getAllComponents', () => {
	expect(getAllComponents()).toEqual(unicodeEmojis.components);
});

test('compareVersion', () => {
	expect(compareVersion('0.6', '0.6')).toBe(true);
	expect(compareVersion('0.6', '0.6', true)).toBe(true);
	expect(compareVersion('0.6', '1.0', true)).toBe(false);
	expect(compareVersion('0.6', '12.0')).toBe(true);
	expect(compareVersion('12.0', '11.0')).toBe(false);
	expect(compareVersion('12.0', '15.1')).toBe(true);
	expect(compareVersion('12.0', '16.0')).toBe(true);
});

test('isValidEmojiVersion', () => {
	expect(isValidEmojiVersion(null)).toBe(false);
	expect(isValidEmojiVersion(1)).toBe(false);
	expect(isValidEmojiVersion('')).toBe(false);
	expect(isValidEmojiVersion('abc')).toBe(false);
	expect(isValidEmojiVersion('1.0')).toBe(true);
	expect(isValidEmojiVersion('2.0')).toBe(true);
	expect(isValidEmojiVersion('14.0')).toBe(true);
	expect(isValidEmojiVersion('15.0')).toBe(true);
	expect(isValidEmojiVersion('15.1')).toBe(true);
	expect(isValidEmojiVersion('16.0')).toBe(true);
});
