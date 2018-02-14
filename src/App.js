import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './App.css';
import Timeline from './Timeline';
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
  getSubviews() {
    return this.props.subviews && this.props.subviews.map((v, i) => {
      const sourceName = v.sources[0];
      const sourceData = ((this.props.list || [])[sourceName] || []);
      return (
        <DerivativeDataView
          key={i}
          data={sourceData}
          start={this.props.start}
          end={this.props.end}
          code={v.func}
          onCodeChange={(code) => this.props.dataViewDerivativeFuncChange(i, code)}
          viewType={v.type}
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
        <div style={{flexGrow: 1, overflow: 'hidden', height: '100%', marginBottom: '30px'}}>
          <div style={{display: 'flex', height: '100%'}}>
            {this.getSubviews()}
          </div>
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
