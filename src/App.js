import React, {Component} from 'react';
import './App.css';
import _ from 'lodash';
import JSONPretty from 'react-json-pretty';

function getDefaultResult(token) {
    return token ? <div key="default-result"><span>Don't know</span></div> : "";
}

function tryBase64(token) {
    try {
        return token ? <div key="base64-result">
            <aside>Base64</aside>
            <span>{atob(token)}</span></div> : null;
    }
    catch (_ignore) {
        return null;
    }
}

function crackJWT(token) {
    let parts = token.split(".");
    if (parts.length !== 3) {
        return null;
    }

    let header = JSON.parse(atob(parts[0])), payload = JSON.parse(atob(parts[1])), signature = parts[2];
    return {header, payload, signature};
}

function tryJWT(token) {
    try {
        var crackedToken = crackJWT(token);
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

const SkypeTokenScopes = [
    [1, "refresh"],
    [2, "uic"],
    [4, "identity"],
    [8, "identity_update"],
    [16, "contacts"],
    [32, "contacts_update"],
    [64, "reauth"],
    [128, "commerce"],
    [256, "communication"],
    [512, "communication_ro"],
    [956, "client"]
];

function getFlagNames(bitmask, scopes) {
    return _.join(_.compact(scopes.map(([k,v]) => (bitmask & k) === k ? v : null)), ", ")
}

function dateFromEpochSeconds(seconds, betterBeInTheFuture = false) {
    let date = new Date(seconds * 1000);
    let test = betterBeInTheFuture ?
        v=>_.lte(v, Date.now()) :
        v=>_.gt(v, Date.now());
    return test(date.valueOf()) ?
        <span className="date_future">{date.toISOString()}</span> :
        <span>{date.toISOString()}</span>;
}

/*
 Authentication:skypetoken=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjIifQ.eyJpYXQiOjE0NzcxNzYwMjcsImV4cCI6MTQ3NzI2MjQyNywic2t5cGVpZCI6ImVtaWwubWllaWxpY2EiLCJzY3AiOjk1OCwiY3NpIjoiOCIsImNpZCI6ImFiZWNkMWIzNTIyY2I1ZjgiLCJhYXQiOjE0NzcwMDc2NjR9.ck4dDkv9nqwj1-rGRh9CGxduMBYgAv0iA3ebPNefgDsWaqnQGgiTjrPatppN7I8P3-mRhiA3qphaai1C4ZiuM-5oByWGC7NvKWeD-vIikqQ_GlsMEtqXEd6kUXSZTnFE3AlZuwW7JeqTZSr8DibKpj2OMriWCEYueZvZ3nCXxH972U5f6PZCln_Uz3IlKASX8Iiw6RZ1c3-5Gzlk
 */
function trySkypeToken(token) {
    try {
        token = token
            .replace(/^(Authentication:\s*)?skypetoken=/i,"")
            .trim();

        var crackedToken = crackJWT(token);

        if (!crackedToken || !_.every(_.at(crackedToken, "header.kid", "payload.skypeid", "payload.scp"), Boolean)) {
            return null;
        }

        return <div key="JWT-result">
            <aside>SkypeToken</aside>
            <table>
                <tbody>
                <tr>
                    <td>Issued time</td>
                    <td>{dateFromEpochSeconds(crackedToken.payload.iat)}</td>
                </tr>
                <tr>
                    <td>Expires</td>
                    <td>{dateFromEpochSeconds(crackedToken.payload.exp)}</td>
                </tr>
                <tr>
                    <td>SkypeID</td>
                    <td>{crackedToken.payload.skypeid}</td>
                </tr>
                <tr>
                    <td>Serial</td>
                    <td>{crackedToken.payload.csi}</td>
                </tr>
                <tr>
                    <td>Scopes</td>
                    <td>{`${getFlagNames(crackedToken.payload.scp, SkypeTokenScopes)} (${crackedToken.payload.scp})`}</td>
                </tr>
                </tbody>
            </table>
        </div>;
    }
    catch (_ignore) {
        return null;
    }
}

//[consumed, ...parts]
function match(re){
    return input=>input.match(re);
}

/*
 Set-RegistrationToken:registrationToken=U2lnbmF0dXJlOjI6Mjg6QVFRQUFBREloK3BpYlMyaGd0VDN6R21sT2lvdTtWZXJzaW9uOjY6MToxO0lzc3VlVGltZTo0OjE5OjUyNDc4MTM3NTU0MTEwMDIzMjM7RXAuSWRUeXBlOjc6MToxO0VwLklkOjI6MjU6ZW1pbC5taWVpbGljYUBvdXRsb29rLmNvbTtFcC5FcGlkOjU6MzY6NGVlYjQ4MzAtZDM3Yy00M2I0LTg5ZTQtMTY1NzBjOTI3NjNlO0VwLkxvZ2luVGltZTo3OjE6MDtFcC5BdXRoVGltZTo0OjE5OjUyNDc4MTM3NTU0MDg2NTg1NTI7RXAuQXV0aFR5cGU6NzoyOjE1O0VwLkV4cFRpbWU6NDoxODo2MzYxMjg1OTIyNzAwMDAwMDA7VXNyLk5ldE1hc2s6MTE6MTozO1Vzci5YZnJDbnQ6NjoxOjE7VXNyLlJkcmN0RmxnOjI6MTA6R2VvSG9zdGluZztVc3IuRXhwSWQ6OToxOjA7VXNyLkV4cElkTGFzdExvZzo0OjE6MDtVc2VyLkF0aEN0eHQ6MjoyNzY6Q2xOcmVYQmxWRzlyWlc0WlpXMXBiQzV0YVdWcGJHbGpZVUJ2ZFhSc2IyOXJMbU52YlFFRFZXbGpGREV2TVM4d01EQXhJREV5T2pBd09qQXdJRUZOREU1dmRGTndaV05wWm1sbFpQaTFMRkt6MGV5ckFBQUFBQUFBUUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUExbGJXbHNMbTFwWldsc2FXTmhBQUFBQUFBQUFBQUFCMDV2VTJOdmNtVUFBQUFBQkFBQUFBQUFBQUFBQUFBQStMVXNVclBSN0tzQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFFTlpXMXBiQzV0YVdWcGJHbGpZUUFBQUFBQUFBQUFBQT09Ow==; expires=1477263298; endpointId={4eeb4830-d37c-43b4-89e4-16570c92763e}
 */
function tryRegToken(token) {
    try {
        token = token
            .replace(/^((Set-)?RegistrationToken:\s*)?registrationToken=/i,"")
            .trim()
            .split(";")[0];

        return atob(token).split(";").map(v=> <div>{v}</div>);
    }
    catch (_ignore) {
        return null;
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {token: ''};
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h2>Crack a token!</h2>
                </div>
                <main className="App-intro">
                    <textarea
                        ref="newField"
                        className="the-token"
                        placeholder="Enter the encoded mambo jumbo"
                        onChange={e => this.handleChange(e)}
                        value={this.state.token}
                        autoFocus={true}
                    />
                    <div className="the-result">
                        {this.state.result || ""}
                    </div>
                </main>
            </div>
        );
    }

    /*
     eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjIifQ.eyJpYXQiOjE0NzcwOTI0ODIsImV4cCI6MTQ3NzE3ODg4Miwic2t5cGVpZCI6ImVtaWwubWllaWxpY2EiLCJzY3AiOjk1OCwiY3NpIjoiOCIsImNpZCI6ImFiZWNkMWIzNTIyY2I1ZjgiLCJhYXQiOjE0NzcwMDc2NjR9.rCsqIfJ-lkf7pnTSC-C5e9uhjshiRgDloFBzQrsVkrm9OyZy3cSU6hasEuTUXYL7qDhnjjHMq6gNXsQPBDQepfJzDvaxeRcgZzKGiRFBnnCnnsxNWJKpbkYOF1InD4b5siNCS6Jz9uofg2yiIwS65b63vVr4-3cbg3SlhmVnLZn97Ou5-63kjXf5x78Remd-ODgN4fkMsFN1rwRA
     */
    handleChange(e) {
        let token = (e.target.value || "").trim();
        let state = {token, result: null};
        let tests = _.over(t=>trySkypeToken(t) || tryJWT(t), tryRegToken, tryBase64, getDefaultResult);

        state.result = _.first(_.compact(tests(token)));
        this.setState(state);
    }
}

export default App;
