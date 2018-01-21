import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ListItem from './ListItem'
import CodeListItem from './CodeListItem'
import LineDiff from 'line-diff';
import Timeline from './Timeline';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: null,
      end: null
    };
    this.onTimelineSelection = this.onTimelineSelection.bind(this);
  }
  scrollToBottom(source) {
    if (source == "code") {
      this.codeMessagesEnd.scrollIntoView();
    } else {
      this.serialMessagesEnd.scrollIntoView();
    }
  }
  onTimelineSelection(d) {
    this.setState({
      start: (typeof d.start !== 'undefined') ? d.start : this.state.start,
      end: (typeof d.end !== 'undefined') ? d.end : this.state.end
    })
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
    const serialListItems = ((this.props.list || [])["serial"] || []).filter(x =>
      (this.state.start === null || new Date(x.timestamp) >= this.state.start) &&
      (this.state.end === null || new Date(x.timestamp) < this.state.end)
    ).map(x =>
      <ListItem datum={x} />
    );
    const codeListItems = ((this.props.list || [])["code"] || []).filter(x =>
      (this.state.start === null || new Date(x.timestamp) >= this.state.start) &&
      (this.state.end === null || new Date(x.timestamp) < this.state.end)
    ).map((x, i, a) =>
      <CodeListItem
        datum={x}
        prevDatum={(i >= 1) ? a[i-1] : null}
      />
    );
    return (
      <div className="App">
        <Timeline
          data={((this.props.list || [])["code"] || [])}
          onClick={this.onTimelineSelection}
          start={this.state.start}
          end={this.state.end}
        />
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
