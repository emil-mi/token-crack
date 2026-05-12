import React from 'react';
import JSONPretty from 'react-json-pretty';

import {crackJWT} from './common';
import {describeIssuer} from './issuers';
import {JWT_COLORS} from './jwtColors';
import {JsonWithTimestamps} from './timestamps';

export function cracker(token) {
    try {
        const startOffset = token.length - token.trimStart().length;
        const trimmed = token.trim();
        const crackedToken = crackJWT(trimmed);
        if (!crackedToken) {
            return null;
        }

        const parts = trimmed.split('.');
        const hLen = parts[0].length;
        const pLen = parts[1].length;
        const sLen = parts[2].length;

        const regions = [
            {start: startOffset, end: startOffset + hLen, color: JWT_COLORS.header, title: 'header'},
            {start: startOffset + hLen + 1, end: startOffset + hLen + 1 + pLen, color: JWT_COLORS.payload, title: 'payload'},
            {start: startOffset + hLen + 1 + pLen + 1, end: startOffset + hLen + 1 + pLen + 1 + sLen, color: JWT_COLORS.signature, title: 'signature'},
        ];

        const info = describeIssuer(crackedToken.payload && crackedToken.payload.iss);

        const details = <div key="JWT-result">
            <aside>JWT</aside>
            <table>
                <tbody>
                <tr style={{color: JWT_COLORS.header}}>
                    <td>header</td>
                    <td><JSONPretty json={crackedToken.header} mainStyle={`color:${JWT_COLORS.header}`}></JSONPretty></td>
                </tr>
                <tr style={{color: JWT_COLORS.payload}}>
                    <td>payload</td>
                    <td>
                        <JsonWithTimestamps json={crackedToken.payload} color={JWT_COLORS.payload} />
                    </td>
                </tr>
                <tr style={{color: JWT_COLORS.signature}}>
                    <td>signature</td>
                    <td>{crackedToken.signature}</td>
                </tr>
                </tbody>
            </table>
        </div>;

        return {regions, info, details};
    }
    catch (_ignore) {
        return null;
    }
}
