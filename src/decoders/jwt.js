import React from 'react';
import JSONPretty from 'react-json-pretty';

import {crackJWT} from './common.js';

export function cracker(token) {
    try {
        let crackedToken = crackJWT(token);
        return crackedToken && <div key="JWT-result">
                <aside>JWT</aside>
                <table>
                    <tbody>
                    <tr>
                        <td>header</td>
                        <td><JSONPretty json={crackedToken.header}></JSONPretty></td>
                    </tr>
                    <tr>
                        <td>payload</td>
                        <td><JSONPretty json={crackedToken.payload}></JSONPretty>}</td>
                    </tr>
                    <tr>
                        <td>signature</td>
                        <td>{crackedToken.signature}</td>
                    </tr>
                    </tbody>
                </table>
            </div>;
    }
    catch (_ignore) {
        return null;
    }
}
