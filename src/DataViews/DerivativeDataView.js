import React, { Component } from 'react';
import '../App.css';
import ListItem from '../ListItem'
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import moment from 'moment'
import 'react-virtualized/styles.css'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'

function evaluate(data, code, timeOnError) {
  if (!code || !code.trim()) return data;
  try {
    return eval(code);
  } catch (err) {
    const errorData = {
      timestamp: timeOnError.toISOString(),
      value: `<div style="margin-top: 50px; color: #880000;">${err}</div>`
    }
    // Using a hack way to show errors: return them like
    // a normal data value at the beginning of the time range.
    // Return two copies as a word-around of the data being
    // hid behind the Data View toggle menu
    return [errorData, errorData];
  }
}

/*
data.map(d => {
  const N = parseInt(d.value);
  const val = Array.apply(null, {length: N}).reduce(acc => acc+"|", "")
  return {
    "timestamp": d.timestamp,
   	"value":  val
  }
});

data.map(d => {
  const N = parseInt(d.value);
  return {
    "timestamp": d.timestamp,
   	"value":  `<svg><rect width="${N*10}" height="100" style="fill:rgb(0,0,255)" /></svg>`
  }
});
*/

class DerivativeDataView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      derivative_data: [],
      showCodeEditor: false,
      scrollToIndex: 0,
      rowCount: 0
    };
    this.update = this.update.bind(this);
    this.run = this.run.bind(this);
    this.toggleCode = this.toggleCode.bind(this);
    this.renderList = this.renderList.bind(this);
    this._noRowsRenderer = this._noRowsRenderer.bind(this);
    this._rowRenderer = this._rowRenderer.bind(this);
  }
  update(val) {
    this.props.onCodeChange(val);
  }
  run(nextData) {
    const val = (typeof nextData !== 'undefined')
      ? nextData
      : this.props.data;
    const filteredDerivedData = evaluate(
      val,
      this.props.code,
      this.props.start || this.props.end || moment.utc().toDate()
    ).filter(x =>
      (this.props.start === null || moment.utc(x.timestamp).toDate() >= moment.utc(this.props.start).toDate()) &&
      (this.props.end === null || moment.utc(x.timestamp).toDate() < moment.utc(this.props.end).toDate())
    );
    this.setState({
      derivative_data: filteredDerivedData,
      rowCount: filteredDerivedData.length,
      scrollToIndex: filteredDerivedData.length-1,
    });
  }
  toggleCode() {
    this.setState({
      showCodeEditor: !this.state.showCodeEditor
    })
  }
  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.data !== 'undefined' && nextProps.code !== '') {
      this.run(nextProps.data);
    }
  }
  scrollToBottom() {
    this.setState((prevState, props) => {
      scrollToIndex: this.state.rowCount-1
    });
  }
  componentDidMount() {
    this.scrollToBottom();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.rowCount !== this.state.rowCount) {
      this.scrollToBottom();
    }
  }
  _noRowsRenderer() {
    return <div style={{marginTop: '40px', color: 'grey'}}>No results.</div>;
  }
  _rowRenderer({index, isScrolling, key, style}) {
    const datum = this.state.derivative_data[index];
    return (
      <div className="Item" key={key} style={style}>
        <strong className="DateLabel">{`(${datum.timestamp})`}</strong>
        <div className="Value" dangerouslySetInnerHTML={{__html: datum.value}} />
      </div>
    );
  }
  renderList() {
    return (
      <AutoSizer disableHeight>
        {({width}) => (
          <List
            ref="List"
            className="ScrollContainerData"
            height={600}
            overscanRowCount={10}
            noRowsRenderer={this._noRowsRenderer}
            rowCount={this.state.rowCount}
            rowHeight={46}
            rowRenderer={this._rowRenderer}
            scrollToIndex={this.state.scrollToIndex}
            width={width}
            updateForcingProp={this.props.code}
          />
        )}
      </AutoSizer>
    );
  }
  render() {
    return (
      <div className="ScrollContainer" key="serial">
        <div
          style={{borderBottom: '2px solid blue', position: 'absolute', background: 'white', width: '100%', zIndex: 10}}
        >
          <div>
            <button
              onClick={() => this.run()}
            >
              Run
            </button>
            <button
              onClick={() => this.toggleCode()}
            >
              Toggle Code
            </button>
          </div>
          { this.state.showCodeEditor &&
            <CodeMirror
              value={this.props.code}
              onBeforeChange={(editor, data, value) => {
                this.update(value);
              }}
              options={{
                lineNumbers: true,
                mode: 'python'
              }}
            />
          }
        </div>
        {this.renderList()}
      </div>
    );
  }
}

export default DerivativeDataView;
