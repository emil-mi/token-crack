import {cracker} from './base64';

describe('base64.cracker', () => {
    test.each([
        ['Pz8/', '???'],
        ['Pj4+', '>>>'],
        ['Pz8_', '???'],
        ['Pj4-', '>>>'],
        ['Pz8_Pj4-', '???>>>'],
        ['Pz8_YQ==', '???a'],
        ['Pz8_YQ', '???a'],
        ['Pj4-YWI=', '>>>ab'],
        ['Pj4-YWI', '>>>ab'],
        ['YQ==', 'a'],
        ['YQ', 'a'],
        ['YWI=', 'ab'],
        ['YWI', 'ab'],
        [' Y Q = = \n', 'a'],
    ])('decodes %j as %j', (token, expected) => {
        const result = cracker(token);

        expect(result).not.toBeNull();
        expect(result.props.children[1].props.children).toBe(expected);
    });

    test.each(['', 'A', 'AA!A', 'AA=A', 'YQ===', '!!!not-a-token!!!'])(
        'returns null for empty or invalid input %j',
        token => {
            expect(cracker(token)).toBeNull();
        },
    );
});
