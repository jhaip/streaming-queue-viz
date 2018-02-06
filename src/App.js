import React, { Component } from 'react';
import './App.css';
import ListItem from './ListItem'
import CodeListItem from './CodeListItem'
import LineDiff from 'line-diff';
import Timeline from './Timeline';
import SerialDataView from './DataViews/SerialDataView'
import CodeDataView from './DataViews/CodeDataView'
import DerivativeDataView from './DataViews/DerivativeDataView'
import moment from 'moment'
import { saveView } from './ws'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: props.start,
      end: props.end,
      subviewsChanged: false,
      subviews: [
        {
          sources: ["serial"],
          type: "",
          func: null
        },
        {
          sources: ["serial"],
          type: "",
          func: null
        },
        {
          sources: ["code"],
          type: "code",
          func: null
        }
      ]
    };
    this.onTimelineSelection = this.onTimelineSelection.bind(this);
    this.dataViewDerivativeFuncChange = this.dataViewDerivativeFuncChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.start !== nextProps.start ||
      this.props.end !== nextProps.end
    ) {
      this.setState({
        start: nextProps.start,
        end: nextProps.end
      });
    }
  }
  onTimelineSelection(d) {
    this.setState({
      start: (typeof d.start !== 'undefined') ? d.start : this.state.start,
      end: (typeof d.end !== 'undefined') ? d.end : this.state.end
    })
  }
  dataViewDerivativeFuncChange(viewNumber, derivativeFunc) {
    console.log("dataViewDerivativeFuncChange");
    this.setState((prevState, props) => {
      let newSubviews = prevState.subviews.slice(0);
      newSubviews[viewNumber].func = derivativeFunc;
      console.log(newSubviews);
      return {
        subviews: newSubviews,
        subviewsChanged: true
      };
    })
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.start != this.state.start ||
      prevState.end != this.state.end ||
      (!prevState.subviewsChanged && this.state.subviewsChanged)
    ) {
      this.setState({
        subviewsChanged: false
      });
      const view = {
        start: this.state.start ? moment.utc(this.state.start).toISOString() : null,
        end: this.state.end ? moment.utc(this.state.end).toISOString() : null,
        subviews: this.state.subviews
      }
      console.log("NEW VIEW");
      console.log(view);
      saveView(view);
    }
  }
  componentDidMount() {
    window.LineDiff = LineDiff;
  }
  render() {
    return (
      <div className="App">
        { this.props.loading && this.props.loading.status &&
          <strong
            style={{position: 'absolute', top: 0, left: 0}}
          >
            Loading
          </strong >
        }
        <Timeline
          data={((this.props.list || [])["code"] || [])}
          onClick={this.onTimelineSelection}
          start={this.state.start}
          end={this.state.end}
        />
        <div style={{display: 'flex'}}>
          <DerivativeDataView
            data={((this.props.list || [])["serial"] || [])}
            start={this.state.start}
            end={this.state.end}
            onCodeChange={(code) => this.dataViewDerivativeFuncChange(0, code)}
          />
          <DerivativeDataView
            data={((this.props.list || [])["serial"] || [])}
            start={this.state.start}
            end={this.state.end}
            onCodeChange={(code) => this.dataViewDerivativeFuncChange(1, code)}
          />
          <CodeDataView
            data={((this.props.list || [])["code"] || [])}
            start={this.state.start}
            end={this.state.end}
          />
        </div>
      </div>
    );
  }
}

export default App;
