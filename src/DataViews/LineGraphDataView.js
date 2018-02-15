import React, { Component } from 'react';
import PropTypes from 'prop-types'
import '../App.css';
import moment from 'moment'
import { LineChart } from 'react-chartkick';

class LineGraphDataView extends Component {
  render() {
    return (
      <div style={{padding: '20px'}}>
        <LineChart
          data={this.props.data
            .filter(d => !isNaN(parseFloat(d.value)) && isFinite(d.value))
            .map(d => [moment.utc(d.timestamp).toDate(), d.value])}
        />
      </div>
    );
  }
}
LineGraphDataView.propTypes = {
  data: PropTypes.array.isRequired,
  followEnd: PropTypes.bool,
  derivativeFunc: PropTypes.string,
  disablederivativeFunc: PropTypes.bool,
  start: PropTypes.object,
  end: PropTypes.object
}

export default LineGraphDataView;
