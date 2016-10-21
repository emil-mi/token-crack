import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state={token:''};
    }
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Welcome to React</h2>
                </div>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload
                    <input
                        ref="newField"
                        className="new-todo"
                        placeholder="Enter the encoded mambo jumbo"
                        onChange={e => this.handleChange(e)}
                        value={this.state.token}
                        autoFocus={true}
                    />
                </p>
            </div>
        );
    }

    handleChange(e) {
        this.setState({token: event.target.value});
    }
}

export default App;
