import React from 'react';
import JSONPretty from 'react-json-pretty';

import {base64UrlToBytes} from './common';
import {JWE_COLORS} from './jweColors';

const PARTS = [
    {key: 'header', label: 'protected header'},
    {key: 'encryptedKey', label: 'encrypted key'},
    {key: 'iv', label: 'initialization vector'},
    {key: 'ciphertext', label: 'ciphertext'},
    {key: 'tag', label: 'authentication tag'},
];

function decodeHeader(encoded) {
    const bytes = base64UrlToBytes(encoded, 'protected header');
    const value = JSON.parse(new TextDecoder('utf-8', {fatal: true}).decode(bytes));
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('protected header must be a JSON object');
    }
    return value;
}

function binaryDetails(value, label, allowEmpty = false) {
    const bytes = allowEmpty && value === ''
        ? new Uint8Array()
        : base64UrlToBytes(value, label);
    return {value, byteLength: bytes.length};
}

export function cracker(token) {
    try {
        const input = token || '';
        const startOffset = input.length - input.trimStart().length;
        const trimmed = input.trim();
        const values = trimmed.split('.');
        if (values.length !== PARTS.length) {
            return null;
        }

        const header = decodeHeader(values[0]);
        const binaries = [
            binaryDetails(values[1], 'encrypted key', header.alg === 'dir'),
            binaryDetails(values[2], 'initialization vector'),
            binaryDetails(values[3], 'ciphertext'),
            binaryDetails(values[4], 'authentication tag'),
        ];

        let cursor = startOffset;
        const regions = PARTS.map((part, index) => {
            const start = cursor;
            const end = start + values[index].length;
            cursor = end + 1;
            return {
                start,
                end,
                color: JWE_COLORS[part.key],
                title: part.label,
            };
        });

        const details = (
            <div key="JWE-result">
                <aside>JWE</aside>
                <table>
                    <tbody>
                    <tr style={{color: JWE_COLORS.header}}>
                        <td>protected header</td>
                        <td>
                            <JSONPretty
                                json={header}
                                mainStyle={`color:${JWE_COLORS.header}`}
                            />
                        </td>
                    </tr>
                    {PARTS.slice(1).map((part, index) => (
                        <tr key={part.key} style={{color: JWE_COLORS[part.key]}}>
                            <td>{part.label}</td>
                            <td>
                                <code>{binaries[index].value || '(empty)'}</code>
                                {' '}
                                <small>({binaries[index].byteLength} bytes)</small>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        );

        return {regions, info: null, details};
    } catch (_ignore) {
        return null;
    }
}
