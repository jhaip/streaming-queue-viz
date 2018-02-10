import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './App.css';
import ListItem from './ListItem'
import CodeListItem from './CodeListItem'
import LineDiff from 'line-diff';
import Timeline from './Timeline';
import CodeDataView from './DataViews/CodeDataView'
import DerivativeDataView from './DataViews/DerivativeDataView'
import moment from 'moment'
import { updateViewTime, dataViewDerivativeFuncChange } from './actions'


class App extends Component {
  constructor(props) {
    super(props);
    this.onTimelineSelection = this.onTimelineSelection.bind(this);
  }
  onTimelineSelection(d) {
    console.log("onTimelineSelection");
    console.log(d);
    this.props.updateViewTime(
      (typeof d.start !== 'undefined') ? d.start : this.props.start,
      (typeof d.end !== 'undefined') ? d.end : this.props.end
    )
  }
  componentDidMount() {
    window.LineDiff = LineDiff;
  }
  getSubviews() {
    return this.props.subviews && this.props.subviews.map((v, i) => {
      const sourceName = v.sources[0];
      if (v.type === "code") {
        return (
          <CodeDataView
            key={i}
            data={((this.props.list || [])[sourceName] || [])}
            start={this.props.start}
            end={this.props.end}
          />
        );
      }
      return (
        <DerivativeDataView
          key={i}
          data={((this.props.list || [])[sourceName] || [])}
          start={this.props.start}
          end={this.props.end}
          code={v.func}
          onCodeChange={(code) => this.props.dataViewDerivativeFuncChange(i, code)}
        />
      );
    })
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
          start={this.props.start}
          end={this.props.end}
        />
        <div style={{display: 'flex'}}>
          {this.getSubviews()}
        </div>
      </div>
    );
  }
}
App.propTypes = {
  start: PropTypes.object,
  end: PropTypes.object,
  subviews: PropTypes.array,
  loading: PropTypes.object,
  list: PropTypes.object
}

function mapStateToProps(state) {
  return {
    start: state.view.start,
    end: state.view.end,
    subviews: state.view.subviews || [],
    loading: state.loading,
    list: state.data
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateViewTime: (start, end) =>
      dispatch(updateViewTime(start, end)),
    dataViewDerivativeFuncChange: (viewNumber, derivativeFunc) =>
      dispatch(dataViewDerivativeFuncChange(viewNumber, derivativeFunc))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
