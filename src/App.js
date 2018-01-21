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
    this.resetView = this.resetView.bind(this);
    this.onClickAddOneNewer = this.onClickAddOneNewer.bind(this);
    this.onClickAddOneOlder = this.onClickAddOneOlder.bind(this);
    this.onClickPrev = this.onClickPrev.bind(this);
    this.onClickNext = this.onClickNext.bind(this);
  }
  scrollToBottom(source) {
    if (source == "code") {
      this.codeMessagesEnd.scrollIntoView();
    } else {
      this.serialMessagesEnd.scrollIntoView();
    }
  }
  onClickAddOneNewer() {
    const code = ((this.props.list || [])["code"] || []);
    if (code.length > 0 && this.state.end !== null) {
      const codeAfter = code.filter(c => new Date(c.timestamp) > this.state.end);
      if (codeAfter.length > 0) {
        this.setState({
          end: new Date(codeAfter[0].timestamp)
        });
      } else {
        this.setState({
          end: null
        });
      }
    }
  }
  onClickNext() {
    const code = ((this.props.list || [])["code"] || []);
    if (code.length > 0 && this.state.end !== null) {
      const codeAfter = code.filter(c => new Date(c.timestamp) > this.state.end);
      if (codeAfter.length > 0) {
        this.setState({
          start: this.state.end,
          end: new Date(codeAfter[0].timestamp)
        });
      } else {
        this.setState({
          start: this.state.end,
          end: null
        });
      }
    }
  }
  onClickAddOneOlder() {
    const code = ((this.props.list || [])["code"] || []);
    if (code.length > 0 && this.state.start !== null) {
      const codeBefore = code.filter(c => new Date(c.timestamp) < this.state.start);
      if (codeBefore.length > 0) {
        this.setState({
          start: new Date(codeBefore[codeBefore.length-1].timestamp)
        });
      }
    }
  }
  onClickPrev() {
    const code = ((this.props.list || [])["code"] || []);
    if (code.length > 0 && this.state.start !== null) {
      const codeBefore = code.filter(c => new Date(c.timestamp) < this.state.start);
      if (codeBefore.length > 0) {
        this.setState({
          start: new Date(codeBefore[codeBefore.length-1].timestamp),
          end: this.state.start
        });
      }
    }
  }
  onTimelineSelection(d) {
    console.log("GOT IT!!!!!")
    console.log(d);
    this.setState({
      start: d.start,
      end: d.end
    })
  }
  resetView(d) {
    this.setState({
      start: null,
      end: null
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
    console.log(this.props);
    console.log(this.props.list);
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
        <div style={{margin: '20px auto'}}>
          <div style={{margin: '10px'}}>
            <strong>
              {this.state.start !== null ? this.state.start.toString() : 'Beginning'}
            </strong>
            {` - `}
            <strong>
              {this.state.end !== null ? this.state.end.toString() : 'Now'}
            </strong>
          </div>
          <Timeline
            data={((this.props.list || [])["code"] || [])}
            onClick={this.onTimelineSelection}
            start={this.state.start}
            end={this.state.end}
          />
          <button
            className="TimelineButton"
            onClick={this.onClickPrev}
          >Previous</button>
          <button
            className="TimelineButton"
            onClick={this.onClickAddOneOlder}
          >Add 1 Older</button>
          <button
            className="TimelineButton"
            onClick={this.resetView}
          >See All</button>
          <button
            className="TimelineButton"
            onClick={this.onClickAddOneNewer}
          >Add 1 Newer</button>
          <button
            className="TimelineButton"
            onClick={this.onClickNext}
          >Next</button>
        </div>
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
