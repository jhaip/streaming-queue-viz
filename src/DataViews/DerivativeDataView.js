import React, { Component } from 'react';
import '../App.css';
import ListItem from '../ListItem'
import {Controlled as CodeMirror} from 'react-codemirror2'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'

function evaluate(data, code) {
  return eval(code);
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
      code: '',
      derivative_data: [],
      showCodeEditor: true
    };
    this.update = this.update.bind(this);
    this.run = this.run.bind(this);
    this.toggleCode = this.toggleCode.bind(this);
  }
  update(val) {
    this.setState({'code': val});
  }
  run(nextData) {
    const val = (typeof nextData !== 'undefined')
      ? nextData
      : this.props.data;
    this.setState({
      derivative_data: evaluate(val, this.state.code)
    });
  }
  toggleCode() {
    this.setState({
      showCodeEditor: !this.state.showCodeEditor
    })
  }
  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.data !== 'undefined' && this.state.code !== '') {
      this.run(nextProps.data);
    }
  }
  scrollToBottom() {
    this.messagesEnd.scrollIntoView();
  }
  componentDidMount() {
    this.scrollToBottom();
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }
  render() {
    const listItems = this.state.derivative_data.filter(x =>
      (this.props.start === null || new Date(x.timestamp) >= this.props.start) &&
      (this.props.end === null || new Date(x.timestamp) < this.props.end)
    ).map(datum =>
      <div key={datum.timestamp} className="Item">
        <strong className="DateLabel">{`(${datum.timestamp})`}</strong>
        <div className="Value" dangerouslySetInnerHTML={{__html: datum.value}} />
      </div>
    );
    return (
      <div className="ScrollContainer" key="serial">
        <div
          style={{borderBottom: '2px solid blue', position: 'absolute', background: 'white', width: '100%'}}
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
              value={this.state.code}
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
        <div className="ScrollContainerData">
          {listItems}
          <div style={{ float:"left", clear: "both" }}
               ref={(el) => { this.messagesEnd = el; }}>
          </div>
        </div>
      </div>
    );
  }
}

export default DerivativeDataView;
