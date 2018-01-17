import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ListItem from './ListItem'
import CodeListItem from './CodeListItem'
import LineDiff from 'line-diff';

class App extends Component {
  scrollToBottom = (source) => {
    if (source == "code") {
      this.codeMessagesEnd.scrollIntoView();
    } else {
      this.serialMessagesEnd.scrollIntoView();
    }
  }
  componentDidMount() {
    this.scrollToBottom("code");
    this.scrollToBottom("serial");
    window.LineDiff = LineDiff;
  }
  componentDidUpdate() {
    this.scrollToBottom("code");
    this.scrollToBottom("serial");
  }
  render() {
    console.log(this.props);
    console.log(this.props.list);
    const serialListItems = ((this.props.list || [])["serial"] || []).map(x =>
      <ListItem datum={x} />
    );
    const codeListItems = ((this.props.list || [])["code"] || []).map((x, i, a) =>
      <CodeListItem
        datum={x}
        prevDatum={(i >= 1) ? a[i-1] : null}
      />
    );
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <h3>List:</h3>
        <div style={{display: 'flex'}}>
          <div className="ScrollContainer">
            {serialListItems}
            <div style={{ float:"left", clear: "both" }}
                 ref={(el) => { this.serialMessagesEnd = el; }}>
            </div>
          </div>
          <div className="ScrollContainer">
            {codeListItems}
            <div style={{ float:"left", clear: "both" }}
                 ref={(el) => { this.codeMessagesEnd = el; }}>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
