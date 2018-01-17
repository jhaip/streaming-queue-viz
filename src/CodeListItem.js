import React, { Component } from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/python/python'
import 'codemirror/mode/diff/diff'
import './ListItem.css';
import LineDiff from 'line-diff';

class CodeListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: props.datum.value || '',
      hide: true,
      showDiff: false
    };
    this.update = this.update.bind(this);
    this.onHideClick = this.onHideClick.bind(this);
    this.onToggleDiff = this.onToggleDiff.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.datum.timestamp !== nextProps.datum.timestamp ||
            this.state.hide !== nextState.hide ||
            this.state.showDiff !== nextState.showDiff);
  }
  update(val) {
    this.setState({'code': val});
  }
  onHideClick() {
    this.setState({'hide': !this.state.hide});
  }
  onToggleDiff() {
    const showDiff = !this.state.showDiff;
    // if (showDiff && this.props.prevDatum) {
    //   console.log(this.props.prevDatum.value);
    //   console.log(this.props.datum.value);
    //   console.log(window.LineDiff(this.props.prevDatum.value, this.props.datum.value).toString());
    // }
    this.setState({
      'showDiff': showDiff,
      'code': (showDiff && this.props.prevDatum) ? window
        .LineDiff(this.props.prevDatum.value, this.props.datum.value, 1)
        .toString()
        .replace(new RegExp("\\n - ", 'g'), "\n- ")
        .replace(new RegExp("\\n + ", 'g'), "\n+ ")
        .replace(new RegExp("\\n   ", 'g'), "\n  ") : this.props.datum.value
    });
  }
  render() {
    return (
      <div key={this.props.datum.timestamp} className="Item">
        <strong className="DateLabel">{`(${this.props.datum.timestamp})`}</strong>
        <div className="CodeMirrorContainer">
          <strong>
            New Code Flashed
            <button
              onClick={() => this.onHideClick()}
            >
              {this.state.hide ? 'Show' : 'Hide'}
            </button>
            <button
              onClick={() => this.onToggleDiff()}
            >
              {this.state.showDiff ? 'Hide Diff' : 'Show Diff'}
            </button>
          </strong>
          { !this.state.hide &&
            <CodeMirror
              value={this.state.code}
              onBeforeChange={(editor, data, value) => {
                this.update(value);
              }}
              options={{
                lineNumbers: true,
                mode: this.state.showDiff ? 'diff' : 'python'
              }}
            />
          }
        </div>
      </div>
    );
  }
}

export default CodeListItem;
