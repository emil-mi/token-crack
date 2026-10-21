import React from 'react';

export function cracker(token) {
    try {
        return token ? <div key="base64-result">
            <aside>Base64</aside>
            <span>{atob(token.replace(/-/g, '+').replace(/_/g, '/'))}</span></div> : null;
    }
    catch (_ignore) {
        return null;
    }
}
