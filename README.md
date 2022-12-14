# unicode-emoji-utils

A collection of utilities for emojis and raw data for Unicode Emojis

- Support CommonJS and ES Module

- Full list of `Unicode Emoji, Version 15.0` from [Unicode](https://home.unicode.org/emoji/about-emoji/).

## ð Installation

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
hasEmoji('a ð«¶'); // true
```

### Strip emojis from a given text

```javascript
stripEmoji('a ð«¶'); // 'a '
```

### Extract Emojis

```javascript
extractEmoji('ðð¼adfsadfs safdsaf dsafds ð«¶'); // ['ðð¼', 'ð«¶']
```

### Get All Emojis

```javascript
getAllEmojis(); // ['ð«¶', 'ðð¼', 'ðð¿', 'ð¨ð»âð¤âð¨ð¼', 'ð¬', ...]

const emojis = [{emoji: 'ð«¶', version: '14.0' }];
getAllEmojis(emojis); // ['ð«¶']
```

### Filter Emoijs by the Unicode Version

```javascript
filterEmojis('14.0'); // Filter Emojis from version 14.0 and below

filterEmojis('14.0', true); // Only returns emoji with version 14.0

const emojis = [{emoji: 'ð«¶', version: '14.0' }];
filterEmojis('14.0', true, emojis); // [{emoji: 'ð«¶', version: '14.0' }]
filterEmojis('14.0', false, emojis); // [{emoji: 'ð«¶', version: '14.0' }]
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
      "emoji": "ð»",
      "description": "light skin tone",
      "version": "1.0"
    },
    {
      "emoji": "ð¼",
      "description": "medium-light skin tone",
      "version": "1.0"
    },
    // ...
  ],
  "hair-style": [
    {
      "emoji": "ð¦°",
      "description": "red hair",
      "version": "11.0"
    },
    {
      "emoji": "ð¦±",
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
