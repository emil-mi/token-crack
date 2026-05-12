import React from 'react';

export const TIMESTAMP_FIELDS = ['iat', 'nbf', 'exp', 'xms_pftexp'];

export function epochSecondsToUtc(value) {
    if (typeof value !== 'number' || !Number.isFinite(value)) return null;
    const date = new Date(value * 1000);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
}

// Walks a JSON-able value and produces a flat array of segments. Each segment
// is either a plain string of pretty-printed JSON or a {comment} marker that
// the React renderer wraps in a styled span. The string version is useful for
// tests.
export function buildJsonSegments(value, {indent = 2} = {}) {
    const out = [];
    const pad = (d) => ' '.repeat(d * indent);
    function walk(v, depth) {
        if (v === null) { out.push('null'); return; }
        if (typeof v === 'boolean' || typeof v === 'number') { out.push(String(v)); return; }
        if (typeof v === 'string') { out.push(JSON.stringify(v)); return; }
        if (Array.isArray(v)) {
            if (v.length === 0) { out.push('[]'); return; }
            out.push('[\n');
            v.forEach((item, i) => {
                out.push(pad(depth + 1));
                walk(item, depth + 1);
                out.push(i < v.length - 1 ? ',\n' : '\n');
            });
            out.push(pad(depth) + ']');
            return;
        }
        if (typeof v === 'object') {
            const keys = Object.keys(v);
            if (keys.length === 0) { out.push('{}'); return; }
            out.push('{\n');
            keys.forEach((k, i) => {
                out.push(pad(depth + 1) + JSON.stringify(k) + ': ');
                const child = v[k];
                walk(child, depth + 1);
                if (i < keys.length - 1) out.push(',');
                const utc = TIMESTAMP_FIELDS.includes(k) ? epochSecondsToUtc(child) : null;
                if (utc) out.push({comment: ` // ${utc}`});
                out.push('\n');
            });
            out.push(pad(depth) + '}');
            return;
        }
        out.push(String(v));
    }
    walk(value, 0);
    return out;
}

export function jsonStringWithComments(value, opts) {
    return buildJsonSegments(value, opts)
        .map(s => (typeof s === 'string' ? s : s.comment))
        .join('');
}

const COMMENT_STYLE = {color: '#888', fontStyle: 'italic'};

export function JsonWithTimestamps({json, color}) {
    const segments = buildJsonSegments(json);
    return (
        <pre className="json-payload" style={{margin: 0, color}}>
            {segments.map((s, i) =>
                typeof s === 'string'
                    ? <React.Fragment key={i}>{s}</React.Fragment>
                    : <span key={i} style={COMMENT_STYLE}>{s.comment}</span>
            )}
        </pre>
    );
}
