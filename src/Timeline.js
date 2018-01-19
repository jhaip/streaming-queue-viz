import React, { Component } from 'react';
import './Timeline.css';

function convertDateToUTC(date) {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}

function getBlocks(data, start, end) {
  const ranges = data.map((d, i, a) => {
    return Object.assign({}, d, {
      start: new Date(d.timestamp),
      end: (i < a.length-1) ? new Date(a[i+1].timestamp) : end,
      index: [i]
    })
  });

  const MIN = (end-start)*0.1;
  const reducedRanges = ranges.reduce((acc, val, i, a) => {
    if (i === 0) {
      return [val];
    }
    const lastInAcc = acc[acc.length-1];
    if (lastInAcc.end - lastInAcc.start < MIN) {
      lastInAcc.index = lastInAcc.index.concat(val.index);
      lastInAcc.end = val.end;
      acc[acc.length-1] = lastInAcc;
      return acc;
    } else {
      return acc.concat(val);
    }
  }, []);

  return reducedRanges;
}

class Timeline extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.tick = this.tick.bind(this);
    this.onClick = this.onClick.bind(this);
  }
  tick() {
    this.forceUpdate();
  }
  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  onClick(d) {
    console.log("CLICKED!");
    console.log(d.start);
    console.log(d.end);
    console.log(d.index);
  }
  render() {
    let visualBlocks = null;
    if (this.props.data && this.props.data.length > 0) {
      const start = new Date(this.props.data[0].timestamp);
      const now = convertDateToUTC(new Date());
      now.setSeconds(now.getSeconds() + 2);
      const end = Math.max(
        now,
        new Date(this.props.data[this.props.data.length-1].timestamp)
      );
      const timeRange = Math.max(end-start, 1);
      visualBlocks = getBlocks(this.props.data, start, end).map((d, i) => {
        const p = 100.0*(d.end - d.start)/(1.0*timeRange);
        let label = `V${d.index[0]}`;
        if (d.index.length > 1) {
          label = `V${d.index[0]} - V${d.index[d.index.length-1]}`
        }
        return (
          <div
            className="TimeBlock"
            style={{flex: `0 0 ${p}%`}}
            onClick={() => this.onClick(d)}
          >
            {label}
          </div>
        );
      });
    }
    return (
      <div className="TimelineContainer">
        { visualBlocks }
      </div>
    );
  }
}

export default Timeline;
