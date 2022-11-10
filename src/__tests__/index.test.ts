import { type Emoji, getAllEmojis, hasEmoji, compareVersion, stripEmojies, getEmojis, getAllComponents, extractEmojis, getEmojisByGroup } from '../';
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
})

test('getAllEmojis', () => {
    expect(getAllEmojis(testEmojis)).toEqual(testCases);
    expect(getAllEmojis(testEmojis).includes('🧑🏿‍🤝‍🧑🏿')).toBe(false);

    const allEmojis = getAllEmojis();

    for (const testCase of testCases) {
        expect(allEmojis.includes(testCase)).toBe(true);
    }
});

test('getEmojis', () => {
    expect(getEmojis('1.0', false, testEmojis)).toEqual(testEmojis);
    expect(getEmojis('1.0', true, testEmojis)).toEqual(testEmojis);
    expect(getAllEmojis(getEmojis('1.0', true)).includes('😂')).toBe(false); // v0.6
    expect(getAllEmojis(getEmojis('1.0', true)).includes('👨🏻‍🤝‍👨🏽')).toBe(false); // v12.1
    expect(getAllEmojis(getEmojis('1.0')).includes('😂')).toBe(true);
    expect(getAllEmojis(getEmojis('1.0')).includes('👨🏻‍🤝‍👨🏽')).toBe(false);
});

test('getEmojisByGroup', () => {
    getEmojisByGroup('group', testEmojis).forEach((emojis, key) => expect(emojis.every(emoji => emoji.group === key)).toBe(true));

    const emojisByGroup = getEmojisByGroup('group');
    emojisByGroup.forEach((emojis, key) => expect(emojis.every(emoji => emoji.group === key)).toBe(true));

    const emojisByCategory = getEmojisByGroup('category');
    emojisByCategory.forEach((emojis, key) => expect(emojis.every(emoji => emoji.category === key)).toBe(true));

    const emojisBySubgroup = getEmojisByGroup('subgroup');
    emojisBySubgroup.forEach((emojis, key) => expect(emojis.every(emoji => emoji.subgroup === key)).toBe(true));
})

test('getAllComponents', () => {
    expect(getAllComponents()).toEqual(unicodeEmojis.components);
})

test('compareVersion', () => {
    expect(compareVersion('0.6', '0.6')).toBe(true);
    expect(compareVersion('0.6', '0.6', true)).toBe(true);
    expect(compareVersion('0.6', '1.0', true)).toBe(false);
    expect(compareVersion('0.6', '12.0')).toBe(true);
    expect(compareVersion('12.0', '11.0')).toBe(false);
})