import React, {Component} from 'react';
import './App.css';
import _ from 'lodash';
import {cracker} from './decoders/index.js';

function renderHighlight(token, regions) {
    if (!token) {
        return null;
    }
    if (!regions || !regions.length) {
        return <span>{token}</span>;
    }
    const sorted = [...regions].sort((a, b) => a.start - b.start);
    const out = [];
    let cur = 0;
    sorted.forEach((r, i) => {
        if (r.start > cur) {
            out.push(<span key={'gap' + i}>{token.slice(cur, r.start)}</span>);
        }
        out.push(
            <span key={i} style={{color: r.color}} title={r.title || undefined}>
                {token.slice(r.start, r.end)}
            </span>
        );
        cur = r.end;
    });
    if (cur < token.length) {
        out.push(<span key="tail">{token.slice(cur)}</span>);
    }
    return out;
}

function normalize(result) {
    if (!result) return null;
    if (React.isValidElement(result)) {
        return {details: result};
    }
    return result;
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {token: '', cracked: null};
    }

    handleChange = (e) => {
        const token = e.target.value || '';
        let result = cracker(token);
        if (_.isArray(result)) {
            result = _.first(result);
        }
        this.setState({token, cracked: normalize(result)});
    };

    render() {
        const {token, cracked} = this.state;
        const regions = cracked && cracked.regions;
        const info = cracked && cracked.info;
        const details = cracked && cracked.details;

        return (
            <div className="App">
                <div className="App-header">
                    <h2>Crack a token!</h2>
                </div>
                <main className="App-intro">
                    <div className="token-box">
                        <div className="token-label">
                            Enter token below (it never leaves your browser):
                        </div>
                        <div className="token-input-wrap">
                            <pre className="token-highlight" aria-hidden="true">
                                {renderHighlight(token, regions)}
                                {'\n'}
                            </pre>
                            <textarea
                                className="the-token"
                                placeholder="Enter the encoded mambo jumbo"
                                onChange={this.handleChange}
                                value={token}
                                autoFocus={true}
                                spellCheck={false}
                            />
                        </div>
                        {info && <div className="token-info">{info}</div>}
                    </div>
                    <div className="the-result">
                        {details}
                        {token && !cracked && <div><span>Don't know</span></div>}
                    </div>
                </main>
            </div>
        );
    }
}

export default App;
