# unicode-emoji-utils

A collection of utilities for emojis and raw data for Unicode Emojis

- Support CommonJS and ES Module

- Full list of `Unicode Emoji, Version 15.1` from [Unicode](https://home.unicode.org/emoji/about-emoji/).

## 🔌 Installation

Using `npm`

```shell
npm install unicode-emoji-utils
```

Or `yarn`

```shell
yarn add unicode-emoji-utils
```

## Usage

```javascript
import { type Emoji, getAllEmojis, hasEmoji, compareVersion, stripEmojies, filterEmojis, getAllComponents, extractEmojis, getEmojisByGroup } from 'unicode-emoji-utils';
```

### Check valid EmojiVersion (type guard)
```javascript
isValidEmojiVersion("1.0"); // true
isValidEmojiVersion("1.2"); // false
isValidEmojiVersion(1); // false
```

### Check whether a text has emojis

```javascript
hasEmoji('a'); // false
hasEmoji('a 🫶'); // true
```

### Strip emojis from a given text

```javascript
stripEmoji('a 🫶'); // 'a '
```

### Extract Emojis

```javascript
extractEmoji('👋🏼adfsadfs safdsaf dsafds 🫶'); // ['👋🏼', '🫶']
```

### Get All Emojis

```javascript
getAllEmojis(); // ['🫶', '👋🏼', '🙏🏿', '👨🏻‍🤝‍👨🏼', '👬', ...]

const emojis = [{emoji: '🫶', version: '14.0' }];
getAllEmojis(emojis); // ['🫶']
```

### Filter Emoijs by the Unicode Version

```javascript
filterEmojis('14.0'); // Filter Emojis from version 14.0 and below

filterEmojis('14.0', true); // Only returns emoji with version 14.0

const emojis = [{emoji: '🫶', version: '14.0' }];
filterEmojis('14.0', true, emojis); // [{emoji: '🫶', version: '14.0' }]
filterEmojis('14.0', false, emojis); // [{emoji: '🫶', version: '14.0' }]
filterEmojis('1.0', false, emojis); // []
```

### Retrieve Unicode components

```javascript
getAllComponents();
```

```javascript
{
  "skin-tone": [
    {
      "emoji": "🏻",
      "description": "light skin tone",
      "version": "1.0"
    },
    {
      "emoji": "🏼",
      "description": "medium-light skin tone",
      "version": "1.0"
    },
    // ...
  ],
  "hair-style": [
    {
      "emoji": "🦰",
      "description": "red hair",
      "version": "11.0"
    },
    {
      "emoji": "🦱",
      "description": "curly hair",
      "version": "11.0"
    },
    // ...
  ]
}
```

### Get Emojis by group, subgroup or category

```javascript
getEmojisByGroup('group');
getEmojisByGroup('subgroup');
getEmojisByGroup('category');
```
