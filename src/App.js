import React, { Component } from 'react';
import './App.css';
import ListItem from './ListItem'
import CodeListItem from './CodeListItem'
import LineDiff from 'line-diff';
import Timeline from './Timeline';
import SerialDataView from './DataViews/SerialDataView'
import CodeDataView from './DataViews/CodeDataView'
import DerivativeDataView from './DataViews/DerivativeDataView'
import { saveView } from './ws'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: props.start,
      end: props.end
    };
    this.onTimelineSelection = this.onTimelineSelection.bind(this);
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
  componentDidUpdate(prevProps, prevState) {
    if (prevState.start != this.state.start ||
        prevState.end != this.state.end) {
      const view = {
        start: this.state.start,
        end: this.state.end,
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
        <Timeline
          data={((this.props.list || [])["code"] || [])}
          onClick={this.onTimelineSelection}
          start={this.state.start}
          end={this.state.end}
        />
        <div style={{display: 'flex'}}>
          <SerialDataView
            data={((this.props.list || [])["serial"] || [])}
            start={this.state.start}
            end={this.state.end}
          />
          <DerivativeDataView
            data={((this.props.list || [])["serial"] || [])}
            start={this.state.start}
            end={this.state.end}
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
