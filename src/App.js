import React, { Component } from 'react';
import './App.css';
import ListItem from './ListItem'
import CodeListItem from './CodeListItem'
import LineDiff from 'line-diff';
import Timeline from './Timeline';
import SerialDataView from './DataViews/SerialDataView'
import CodeDataView from './DataViews/CodeDataView'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: null,
      end: null
    };
    this.onTimelineSelection = this.onTimelineSelection.bind(this);
  }
  onTimelineSelection(d) {
    this.setState({
      start: (typeof d.start !== 'undefined') ? d.start : this.state.start,
      end: (typeof d.end !== 'undefined') ? d.end : this.state.end
    })
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
