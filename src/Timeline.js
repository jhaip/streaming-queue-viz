import React, { Component } from 'react';
import './Timeline.css';
import moment from 'moment'


function getBlocks(data, start, end) {
  const ranges = data.map((d, i, a) => {
    return Object.assign({}, d, {
      start: moment.utc((d.timestamp)).toDate(),
      end: (i < a.length-1) ? moment.utc(a[i+1].timestamp).toDate() : end,
      index: [i]
    })
  });

  const MIN = (end-start)*0.1;
  const reducedRanges = ranges.reduce((acc, val, i, a) => {
    if (i === 0) {
      return [val];
    }
    const lastInAcc = acc[acc.length-1];
    if (lastInAcc.end - lastInAcc.start < MIN && i < a.length-1) {
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
    this.resetView = this.resetView.bind(this);
    this.onClickAddOneNewer = this.onClickAddOneNewer.bind(this);
    this.onClickAddOneOlder = this.onClickAddOneOlder.bind(this);
    this.onClickPrev = this.onClickPrev.bind(this);
    this.onClickNext = this.onClickNext.bind(this);
  }
  tick() {
    this.forceUpdate();
  }
  resetView(d) {
    this.props.onClick({
      start: null,
      end: null
    })
  }
  onClickAddOneNewer() {
    const code = this.props.data;
    if (code.length > 0 && this.props.end !== null) {
      const codeAfter = code.filter(c => moment.utc(c.timestamp).toDate() > this.props.end);
      if (codeAfter.length > 0) {
        this.props.onClick({
          end: moment.utc(codeAfter[0].timestamp).toDate()
        });
      } else {
        this.props.onClick({
          end: null
        });
      }
    }
  }
  onClickNext() {
    const code = this.props.data;
    if (code.length > 0 && this.props.end !== null) {
      const codeAfter = code.filter(c => moment.utc(c.timestamp).toDate() > this.props.end);
      if (codeAfter.length > 0) {
        this.props.onClick({
          start: this.props.end,
          end: moment.utc(codeAfter[0].timestamp).toDate()
        });

      } else {
        this.props.onClick({
          start: this.props.end,
          end: null
        });
      }
    }
  }
  onClickAddOneOlder() {
    const code = this.props.data;
    if (code.length > 0 && this.props.start !== null) {
      const codeBefore = code.filter(c => moment.utc(c.timestamp).toDate() < this.props.start);
      if (codeBefore.length > 0) {
        this.props.onClick({
          start: moment.utc(codeBefore[codeBefore.length-1].timestamp).toDate()
        });
      }
    }
  }
  onClickPrev() {
    const code = this.props.data;
    if (code.length > 0 && this.props.start !== null) {
      const codeBefore = code.filter(c => moment.utc(c.timestamp).toDate() < this.props.start);
      if (codeBefore.length > 0) {
        this.props.onClick({
          start: moment.utc(codeBefore[codeBefore.length-1].timestamp).toDate(),
          end: this.props.start
        });
      }
    }
  }
  componentDidMount() {
    this.interval = setInterval(this.tick, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    let visualBlocks = null;
    if (this.props.data && this.props.data.length > 0) {
      const start = this.props.start || moment.utc(this.props.data[0].timestamp).toDate();
      const now = moment.utc().toDate();
      now.setSeconds(now.getSeconds() + 2);
      const end = this.props.end || now;
      const timeRange = Math.max(end-start, 1);
      const dataInRangeOffset = this.props.data.filter(x =>
        (this.props.start !== null && moment.utc(x.timestamp).toDate() < this.props.start)
      ).length;
      const dataInRange = this.props.data.filter(x =>
        (this.props.start === null || moment.utc(x.timestamp).toDate() >= this.props.start) &&
        (this.props.end === null || moment.utc(x.timestamp).toDate() < this.props.end)
      );
      visualBlocks = getBlocks(dataInRange, start, end).map((d, i) => {
        const p = 100.0*(d.end - d.start)/(1.0*timeRange);
        let label = `V${d.index[0]+dataInRangeOffset}`;
        if (d.index.length > 1) {
          label = `V${d.index[0]+dataInRangeOffset} - V${d.index[d.index.length-1]+dataInRangeOffset}`
        }
        return (
          <div
            className="TimeBlock"
            style={{flex: `0 0 ${p}%`}}
            onClick={() => this.props.onClick(d)}
          >
            {label}
          </div>
        );
      });
    }
    return (
      <div style={{margin: '20px auto'}}>
        <div style={{margin: '10px'}}>
          <strong>
            {this.props.start ? moment.utc(this.props.start).toISOString() : 'Beginning'}
          </strong>
          {` - `}
          <strong>
            {this.props.end ? moment.utc(this.props.end).toISOString() : 'Now'}
          </strong>
        </div>
        <div className="TimelineContainer">
          { visualBlocks }
        </div>
        <button
          className="TimelineButton"
          onClick={this.onClickPrev}
        >Previous</button>
        <button
          className="TimelineButton"
          onClick={this.onClickAddOneOlder}
        >Add 1 Older</button>
        <button
          className="TimelineButton"
          onClick={this.resetView}
        >See All</button>
        <button
          className="TimelineButton"
          onClick={this.onClickAddOneNewer}
        >Add 1 Newer</button>
        <button
          className="TimelineButton"
          onClick={this.onClickNext}
        >Next</button>
      </div>
    );
  }
}

export default Timeline;
