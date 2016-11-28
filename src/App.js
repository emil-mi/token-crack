import React, {Component} from 'react';
import './App.css';
import _ from 'lodash';
import {cracker} from './decoders/index.js';

function getDefaultResult(token) {
    return token ? <div key="default-result"><span>Don't know</span></div> : "";
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {token: ''};
    }

    render() {
        let textAreaState= {};
        let resizeTA = function (input) {
            input.style.minHeight = 'auto';
            input.style.minHeight = Math.max(input.scrollHeight, 70) + 'px';
        };

        return (
            <div className="App">
                <div className="App-header">
                    <h2>Crack a token!</h2>
                </div>
                <main className="App-intro">
                    <textarea
                        ref={input=> input? textAreaState.input=input : textAreaState.input && resizeTA(textAreaState.input) }
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

    handleChange(e) {
        let token = (e.target.value || "").trim();
        let state = {token, result: null};

        let result = cracker(token);
        if (_.isArray(result)) {
            result = _.first(result);
        }
        state.result = result || getDefaultResult(token);

        this.setState(state);
    }
}

export default App;
