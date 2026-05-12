import {cracker} from './decoders/index';

// The full App component uses React 19 + WebCrypto + DOM APIs that are awkward
// under jsdom; the App's rendering surface is covered by the underlying decoder
// unit tests instead. This smoke test guards the cracker entry point and the
// "empty/garbage input → no result" contract that App.js relies on.

describe('cracker pipeline entry point', () => {
    test('returns an empty array for empty input', () => {
        expect(cracker('')).toEqual([]);
    });

    test('returns an empty array for input nothing recognises', () => {
        expect(cracker('!!!not-a-token!!!')).toEqual([]);
    });
});
