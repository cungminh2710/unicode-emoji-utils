import * as fs from 'fs';
import * as https from 'https';
import * as readline from 'readline';
import * as htmlparser2 from 'htmlparser2';

import { type Emoji } from '../src';
type Maybe<T> = T | undefined | null;
// Credit to https://github.com/Julien-Marcou/Unicode-Emoji/blob/main/generate-unicode-emoji.cjs

/* ------------- PARAMETERS ------------- */

const unicodeEmojiVersion = '15.1';
const unicodeCldrVersion = '43';
const unicodeCldrLocale = 'en';

/* ------------- EMOJIS CONSOLIDATION ------------- */

const categoriesMapping = {
	'smileys-emotion': {
		default: 'face-emotion',
	},
	'people-body': {
		default: 'person-people',
		'body-parts': 'face-emotion',
		hand: 'face-emotion',
	},
	'animals-nature': {
		default: 'animals-nature',
	},
	'food-drink': {
		default: 'food-drink',
	},
	'travel-places': {
		default: 'travel-places',
		'sky-weather': 'animals-nature',
		time: 'objects',
	},
	activities: {
		default: 'activities-events',
	},
	objects: {
		default: 'objects',
		music: 'activities-events',
	},
	symbols: {
		default: 'symbols',
	},
	flags: {
		default: 'flags',
	},
};
const overrideCategoryForEmojis = {
	'activities-events': [
		'🎥',
		'🎞️',
		'📽️',
		'🎬',
		'📺',
		'📷',
		'📸',
		'📹',
		'📼',
		'🔨',
		'🪓',
		'⛏️',
		'⚒️',
		'🛠️',
		'🗡️',
		'⚔️',
		'🔫',
		'🪃',
		'🏹',
		'🛡️',
		'🪚',
		'🔧',
		'🪛',
	],
	'animals-nature': ['🦀', '🦞', '🦐', '🦑', '🦪'],
	objects: ['🧿', '🌂', '☂️', '💣'],
	symbols: [
		'♠️',
		'♥️',
		'♦️',
		'♣️',
		'🕳️',
		'💬',
		'👁️‍🗨️',
		'🗨️',
		'🗯️',
		'💭',
		'🕛',
		'🕧',
		'🕐',
		'🕜',
		'🕑',
		'🕝',
		'🕒',
		'🕞',
		'🕓',
		'🕟',
		'🕔',
		'🕠',
		'🕕',
		'🕡',
		'🕖',
		'🕢',
		'🕗',
		'🕣',
		'🕘',
		'🕤',
		'🕙',
		'🕥',
		'🕚',
		'🕦',
		'🔇',
		'🔈',
		'🔉',
		'🔊',
		'🔕',
		'💹',
	],
};
const missingVariationsForBaseEmojis = {
	'👩': ['🧔‍♀️', '🧔🏻‍♀️', '🧔🏼‍♀️', '🧔🏽‍♀️', '🧔🏾‍♀️', '🧔🏿‍♀️'],
};

/* ------------- FILES CONFIG ------------- */

// File paths
const emojisInput = `https://unicode.org/Public/emoji/${unicodeEmojiVersion}/emoji-test.txt`;
const annotationsInput = `https://raw.githubusercontent.com/unicode-org/cldr/release-${unicodeCldrVersion}/common/annotations/${unicodeCldrLocale}.xml`;
const derivedAnnotationsInput = `https://raw.githubusercontent.com/unicode-org/cldr/release-${unicodeCldrVersion}/common/annotationsDerived/${unicodeCldrLocale}.xml`;
const jsOutput = `${__dirname}/../src/unicode-emojis.ts`;

// Config to parse emojis file
const commentPrefix = '#';
const groupPrefix = '# group:';
const subgroupPrefix = '# subgroup:';
const componentStatus = 'component';
const fullyQualifiedStatus = 'fully-qualified';
const groupsWithVariations = ['people-body'];
const codePointsSeparator = ' ';
const baseDescriptionSeparator = ':';
const qualificationCodePoint = 'FE0F';

// Config to parse annotations file
const annotationTag = 'annotation';
const codePointsAttribute = 'cp';
const typeAttribute = 'type';
const textToSpeechType = 'tts';
const keywordsSeparator = /[|,]/g;

/* ------------- PROCESS ------------- */

// Emojis process
let emojiGroup: string;
let emojiSubgroup: string;
let emojiCount = 0;
const emojis = new Map(); // Used to map keywords & text to speech for each emojis
const components = new Map(); // Used to map components for each emoji variations
const baseEmojis: Map<string, Emoji> = new Map(); // Used to attach variations to base emojis
const results: {
	components: Record<string, Array<Emoji>>;
	emojis: Array<Emoji>;
} = { components: {}, emojis: [] };

// Annotations process
let isAnnotationTag = false;
let annotationAttributes: Maybe<Record<string, string>> = null;
let annotationText: Maybe<string> = null;
let annotationCount = 0;
const annotationsParser = new htmlparser2.Parser(
	{
		onopentag: (tag, attributes) => {
			isAnnotationTag = tag === annotationTag;
			if (isAnnotationTag) {
				annotationAttributes = attributes;
				annotationText = '';
			}
		},
		ontext: (text) => {
			if (isAnnotationTag) {
				annotationText += text;
			}
		},
		onclosetag: (tag) => {
			if (tag === annotationTag) {
				processAnnotationTag(annotationAttributes, annotationText);
				isAnnotationTag = false;
				annotationAttributes = null;
				annotationText = null;
			}
		},
		onend: () => {
			isAnnotationTag = false;
			annotationAttributes = null;
			annotationText = null;
		},
	},
	{ decodeEntities: true }
);

function processEmojiLine(line) {
	// Retrieve group/subgroup line
	if (line.charAt(0) === commentPrefix) {
		if (line.startsWith(groupPrefix)) {
			emojiGroup = line
				.substring(groupPrefix.length)
				.trim()
				.replace(/[^A-Za-z0-9\s-]/g, '')
				.replace(/\s+/g, '-')
				.toLowerCase();
		} else if (line.startsWith(subgroupPrefix)) {
			emojiSubgroup = line
				.substring(subgroupPrefix.length)
				.trim()
				.replace(/[^A-Za-z0-9\s-]/g, '')
				.replace(/\s+/g, '-')
				.toLowerCase();
		}
	}
	// Retrieve emoji line
	else {
		const emojiMatch = line.match(/^(.+\b)\s+;\s+([\S]+)\s+#\s([\S]+)\s+E(\S+)\s+(.+)$/);
		if (!emojiMatch) {
			return;
		}
		const [_, codePoints, status, renderedEmoji, version, description] = emojiMatch;
		if (![componentStatus, fullyQualifiedStatus].includes(status)) {
			return;
		}

		const emoji: Emoji = {
			emoji: renderedEmoji,
			description: null,
			version: version,
			keywords: null,
			codePoints: [],
		};
		emojis.set(renderedEmoji, emoji);
		emojiCount++;
		process.stdout.clearLine(-1);
		process.stdout.cursorTo(0);
		process.stdout.write(`Retrieved ${emojiCount} emojis`);

		// Component emoji
		if (status === componentStatus) {
			emoji.codePoint = codePoints;
			if (!(emojiSubgroup in results.components)) {
				results.components[emojiSubgroup] = [];
			}
			results.components[emojiSubgroup].push(emoji);
			components.set(codePoints, emoji);
		}
		// Fully-qualified emoji
		else {
			emoji.codePoints = codePoints.split(codePointsSeparator);

			if (!emoji.codePoints || emoji.codePoints.length === 0) {
				console.log(`Unable to retrieve code points of ${emoji.emoji} - raw: ${JSON.stringify(codePoints)}`);
				return;
			}

			// Make the unqualified version of the emoji point to the fully-qualified emoji,
			// so annotations are later attached to the correct emoji
			const unqualifiedRenderedEmoji = String.fromCodePoint(
				...emoji.codePoints
					.filter((codePoint) => codePoint !== qualificationCodePoint)
					.map((codePoint) => parseInt(codePoint, 16))
			);
			if (unqualifiedRenderedEmoji !== renderedEmoji) {
				emojis.set(unqualifiedRenderedEmoji, emoji);
			}

			// Map the group/subgroup to a more meaningful category
			let category = categoriesMapping[emojiGroup].default;
			for (const keyword in categoriesMapping[emojiGroup]) {
				if (keyword !== 'default' && emojiSubgroup.includes(keyword)) {
					category = categoriesMapping[emojiGroup][keyword];
					break;
				}
			}
			for (const overrideCategory in overrideCategoryForEmojis) {
				if (overrideCategoryForEmojis[overrideCategory].includes(renderedEmoji)) {
					category = overrideCategory;
				}
			}

			// Variation of an emoji
			const baseDescription = description.split(baseDescriptionSeparator)[0];
			if (groupsWithVariations.includes(emojiGroup) && baseEmojis.has(baseDescription)) {
				const baseEmoji = baseEmojis.get(baseDescription);
				if (baseEmoji) {
					if (!baseEmoji.variations) {
						baseEmoji.variations = [];
					}
					baseEmoji.variations.push(emoji);
				}
			}
			// Base emoji
			else {
				emoji.category = category;
				emoji.group = emojiGroup;
				emoji.subgroup = emojiSubgroup;
				results.emojis.push(emoji);
				baseEmojis.set(description, emoji);
			}
		}
	}
}

function addMissingVariationsForBaseEmojis() {
	for (const renderedBaseEmoji in missingVariationsForBaseEmojis) {
		const baseEmoji = emojis.get(renderedBaseEmoji);
		for (const renderedVariationEmoji of missingVariationsForBaseEmojis[renderedBaseEmoji]) {
			const variationEmoji = emojis.get(renderedVariationEmoji);
			if (variationEmoji) {
				baseEmojis.delete(variationEmoji.description);
				baseEmoji.variations.push(variationEmoji);
				results.emojis.splice(results.emojis.indexOf(variationEmoji), 1);
			}
		}
	}
}

function addComponentsToEmojiVariations() {
	for (const baseEmoji of Array.from(baseEmojis.values())) {
		if (baseEmoji.variations) {
			for (const emojiVariation of baseEmoji.variations) {
				if (emojiVariation?.codePoints) {
					for (const codePoint of emojiVariation.codePoints) {
						if (components.has(codePoint)) {
							if (!emojiVariation.components) {
								emojiVariation.components = [];
							}
							const component = components.get(codePoint);
							if (!emojiVariation.components.includes(component.emoji)) {
								emojiVariation.components.push(component.emoji);
							}
						}
					}
				}
			}
		}
	}
}

function processAnnotationTag(attributes, text) {
	const renderedEmoji = attributes[codePointsAttribute];
	if (!emojis.has(renderedEmoji)) {
		return;
	}

	const emoji = emojis.get(renderedEmoji);
	if (attributes[typeAttribute] === textToSpeechType) {
		emoji.description = text.trim();
		annotationCount++;
		process.stdout.clearLine(-1);
		process.stdout.cursorTo(0);
		process.stdout.write(`Retrieved ${annotationCount} annotations`);
	} else {
		emoji.keywords = text.split(keywordsSeparator).map((value) => value.trim());
	}
}

function saveResults() {
	// Save TS
	for (const componentGroup in results.components) {
		results.components[componentGroup].forEach((component) => {
			delete component.codePoint;
			delete component.keywords;
		});
	}
	results.emojis.forEach((baseEmoji) => {
		delete baseEmoji.codePoints;
		if (baseEmoji.variations) {
			baseEmoji.variations.forEach((emojiVariation) => {
				delete emojiVariation.codePoints;
				delete emojiVariation.components;
				delete emojiVariation.keywords;
			});
		}
	});
	fs.writeFileSync(
		jsOutput,
		`import { type Emoji } from './'
const UnicodeEmojis: {
    components: Record<string, Array<Emoji>>,
    emojis: Array<Emoji>
} = ${JSON.stringify(results, null, 2)}
export default UnicodeEmojis;
`
	);
}

// Retrieve emojis online
console.log(`Retrieving "Unicode Emoji, Version ${unicodeEmojiVersion}"\n`);
console.log(emojisInput);

const emojisResponse = await fetch(emojisInput);
if (emojisResponse.status !== 200) {
	console.log(`HTTP error ${emojisResponse.status} occurred while retrieving the emojis\n`);
	process.exit(1);
}

const text = await emojisResponse.text();
const lines = text.split('\n');
for (const line of lines) {
	processEmojiLine(line);
}

console.log('\n');

// Fix emoji variations not being linked to their base emoji
addMissingVariationsForBaseEmojis();

// Data consolidation (skin tone & hair style) for emoji variations
addComponentsToEmojiVariations();

// Retrieve annotations (text-to-speech & keywords) online
console.log(
	`Retrieving "Common Local Data Repository, Version ${unicodeCldrVersion}" for local "${unicodeCldrLocale}"\n`
);

console.log(annotationsInput);

const annotationResponse = await fetch(annotationsInput);
if (annotationResponse.status !== 200) {
	console.log(`HTTP error ${annotationResponse.status} occurred while retrieving the annotations\n`);
	process.exit(1);
}
const annotationsText = await annotationResponse.text();

annotationsParser.write(annotationsText);

const derivedAnnotationResponse = await fetch(derivedAnnotationsInput);

const derivedAnnotationsText = await derivedAnnotationResponse.text();

annotationsParser.write(derivedAnnotationsText);

// End of process
console.log('\n');
saveResults();
