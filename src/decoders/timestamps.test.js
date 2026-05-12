import {
    TIMESTAMP_FIELDS,
    epochSecondsToUtc,
    buildJsonSegments,
    jsonStringWithComments,
} from './timestamps';

describe('TIMESTAMP_FIELDS', () => {
    test('covers iat, nbf, exp and xms_pftexp', () => {
        expect(TIMESTAMP_FIELDS).toEqual(expect.arrayContaining(['iat', 'nbf', 'exp', 'xms_pftexp']));
    });
});

describe('epochSecondsToUtc', () => {
    test('formats a Unix epoch as an ISO-8601 UTC string', () => {
        expect(epochSecondsToUtc(0)).toBe('1970-01-01T00:00:00.000Z');
        expect(epochSecondsToUtc(1700000000)).toBe('2023-11-14T22:13:20.000Z');
    });

    test('returns null for non-numeric values', () => {
        expect(epochSecondsToUtc('1700000000')).toBeNull();
        expect(epochSecondsToUtc(undefined)).toBeNull();
        expect(epochSecondsToUtc(null)).toBeNull();
        expect(epochSecondsToUtc(NaN)).toBeNull();
        expect(epochSecondsToUtc(Infinity)).toBeNull();
    });
});

describe('jsonStringWithComments', () => {
    test('inlines a UTC comment after each known timestamp field', () => {
        const out = jsonStringWithComments({
            iss: 'https://x',
            iat: 1700000000,
            nbf: 1700000000,
            exp: 1700003600,
            xms_pftexp: 1700090000,
        });
        expect(out).toContain('"iat": 1700000000, // 2023-11-14T22:13:20.000Z');
        expect(out).toContain('"nbf": 1700000000, // 2023-11-14T22:13:20.000Z');
        expect(out).toContain('"exp": 1700003600, // 2023-11-14T23:13:20.000Z');
        expect(out).toContain('"xms_pftexp": 1700090000 // 2023-11-15T23:13:20.000Z');
    });

    test('does NOT comment on non-timestamp fields', () => {
        const out = jsonStringWithComments({sub: 'a', count: 42});
        expect(out).not.toContain('//');
    });

    test('does NOT comment when value is not numeric', () => {
        const out = jsonStringWithComments({iat: 'now'});
        expect(out).not.toContain('//');
    });

    test('omits the trailing comma on the last entry, but still annotates', () => {
        // exp is last → no comma before the comment
        const out = jsonStringWithComments({sub: 'a', exp: 1700000000});
        expect(out).toContain('"exp": 1700000000 // 2023-11-14T22:13:20.000Z');
        expect(out).not.toContain('"exp": 1700000000,');
    });

    test('renders nested structures with 2-space indentation', () => {
        const out = jsonStringWithComments({a: {b: 1}});
        expect(out).toBe('{\n  "a": {\n    "b": 1\n  }\n}');
    });

    test('renders empty objects and arrays compactly', () => {
        expect(jsonStringWithComments({a: {}, b: []})).toBe('{\n  "a": {},\n  "b": []\n}');
    });
});

describe('buildJsonSegments', () => {
    test('emits comments as {comment} markers, not plain strings', () => {
        const segments = buildJsonSegments({iat: 1700000000});
        const comments = segments.filter(s => typeof s === 'object');
        expect(comments).toHaveLength(1);
        expect(comments[0].comment).toBe(' // 2023-11-14T22:13:20.000Z');
    });
});
