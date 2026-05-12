import React from 'react';

export function cracker(token) {
    try {
        return token ? <div key="base64-result">
            <aside>Base64</aside>
            <span>{atob(token)}</span></div> : null;
    }
    catch (_ignore) {
        return null;
    }
}
