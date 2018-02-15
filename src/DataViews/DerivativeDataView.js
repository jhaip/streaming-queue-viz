import React, { Component } from 'react';
import PropTypes from 'prop-types'
import '../App.css';
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'
import moment from 'moment'
import DefaultDataList from './DefaultDataList'
import CodeDataView from './CodeDataView'
import AnnotationsDataView from './AnnotationsDataView'
import LineGraphDataView from './LineGraphDataView'

function evaluate(data, code, ignoreCode, timeOnError) {
  if (ignoreCode || !code || !code.trim()) {
    return data;
  }
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

data.map(d => {
  const match = d.value.match(/\(([^,]+),/);
  const val = match && match.length === 2 ? match[1] : "";
  return {
    "timestamp": d.timestamp,
   	"value":  val
  }
});
*/

class DerivativeDataView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      derivative_data: [],
      showCodeEditor: false,
      disableDerivativeCode: false,
      scrollToBottom: true
    };
    this.update = this.update.bind(this);
    this.run = this.run.bind(this);
    this.toggleCode = this.toggleCode.bind(this);
    this.scrollToBottomChange = this.scrollToBottomChange.bind(this);
    this.toggleDisableDerivativeCode = this.toggleDisableDerivativeCode.bind(this);
    this.handleViewTypeChange = this.handleViewTypeChange.bind(this);
    this.handleViewSourceChange = this.handleViewSourceChange.bind(this);
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
      this.state.disableDerivativeCode,
      this.props.start || this.props.end || moment.utc().toDate()
    ).filter(x =>
      (this.props.start === null || moment.utc(x.timestamp).toDate() >= moment.utc(this.props.start).toDate()) &&
      (this.props.end === null || moment.utc(x.timestamp).toDate() < moment.utc(this.props.end).toDate())
    );
    this.setState({
      derivative_data: filteredDerivedData
    });
  }
  toggleCode() {
    this.setState({
      showCodeEditor: !this.state.showCodeEditor
    })
  }
  scrollToBottomChange() {
    this.setState({
      scrollToBottom: !this.state.scrollToBottom
    })
  }
  toggleDisableDerivativeCode() {
    this.setState({
      disableDerivativeCode: !this.state.disableDerivativeCode
    });
  }
  handleViewTypeChange(event) {
    this.props.onViewTypeChange(event.target.value);
  }
  handleViewSourceChange(event) {
    this.props.onViewSourceChange(event.target.value);
  }
  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.data !== 'undefined') {
      this.run(nextProps.data);
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.disableDerivativeCode !== this.state.disableDerivativeCode) {
      this.run(this.props.data);
    }
  }
  renderView() {
    if (this.props.viewType === 'code') {
      return (
        <CodeDataView
          data={this.state.derivative_data}
          followEnd={this.state.scrollToBottom}
          derivativeFunc={this.props.code}
          disablederivativeFunc={this.state.disableDerivativeCode}
        />
      )
    }
    if (this.props.viewType === 'annotation') {
      return (
        <AnnotationsDataView
          data={this.state.derivative_data}
          followEnd={this.state.scrollToBottom}
          derivativeFunc={this.props.code}
          disablederivativeFunc={this.state.disableDerivativeCode}
        />
      )
    }
    if (this.props.viewType === 'line-graph') {
      return (
        <LineGraphDataView
          data={this.state.derivative_data}
          followEnd={this.state.scrollToBottom}
          derivativeFunc={this.props.code}
          disablederivativeFunc={this.state.disableDerivativeCode}
        />
      )
    }
    return (
      <DefaultDataList
        data={this.state.derivative_data}
        followEnd={this.state.scrollToBottom}
        derivativeFunc={this.props.code}
        disablederivativeFunc={this.state.disableDerivativeCode}
      />
    )
  }
  render() {
    return (
      <div className="ScrollContainer" key="serial">
        <div
          className="DataViewHeader"
        >
          <div>
            <button
              className="menuButton"
              onClick={() => this.run()}
            >
              <i className="material-icons">play_arrow</i>
            </button>
            <button
              className={this.state.showCodeEditor ? "enabledButton menuButton" : "menuButton"}
              onClick={() => this.toggleCode()}
            >
              <i className="material-icons">visibility</i>
            </button>
            <button
              onClick={() => this.scrollToBottomChange()}
              className={this.state.scrollToBottom ? "enabledButton menuButton" : "menuButton"}
            >
              <i className="material-icons">settings_backup_restore</i>
            </button>
            <button
              onClick={() => this.toggleDisableDerivativeCode()}
              className={!this.state.disableDerivativeCode ? "enabledButton menuButton" : "menuButton"}
            >
              <i className="material-icons">code</i>
            </button>
            <select
              className="menuDropdown"
              value={this.props.source}
              onChange={this.handleViewSourceChange}
            >
              <option value="serial">serial</option>
              <option value="code">code</option>
              <option value="view">view</option>
              <option value="annotation">annotation</option>
            </select>
            <select
              className="menuDropdown"
              value={this.props.viewType}
              onChange={this.handleViewTypeChange}
            >
              <option value="">default</option>
              <option value="code">code</option>
              <option value="annotation">annotation</option>
              <option value="line-graph">line graph</option>
            </select>
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
        {this.renderView()}
      </div>
    );
  }
}
DerivativeDataView.propTypes = {
  data: PropTypes.array.isRequired,
  code: PropTypes.string,
  source: PropTypes.string.isRequired,
  onCodeChange: PropTypes.func.isRequired,
  onViewTypeChange: PropTypes.func.isRequired,
  onViewSourceChange: PropTypes.func.isRequired,
  start: PropTypes.object,
  end: PropTypes.object,
  viewType: PropTypes.string
}

export default DerivativeDataView;
