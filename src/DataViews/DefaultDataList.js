import React, { Component } from 'react';
import PropTypes from 'prop-types'
import '../App.css';
import moment from 'moment'
import 'react-virtualized/styles.css'
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer'
import List from 'react-virtualized/dist/commonjs/List'


class DefaultDataList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollToIndex: 0,
      rowCount: 0
    };
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this._noRowsRenderer = this._noRowsRenderer.bind(this);
    this._rowRenderer = this._rowRenderer.bind(this);
  }
  scrollToBottom() {
    this.setState((prevState, props) => {
      scrollToIndex: this.props.data.length-1
    });
  }
  componentDidMount() {
    this.scrollToBottom();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data.length !== this.props.data.length) {
      this.scrollToBottom();
    }
    if (prevProps.disablederivativeFunc !== this.props.disablederivativeFunc ||
        prevProps.derivativeFunc !== this.props.derivativeFunc) {
      if (this.dataListRef) {
        // "For Table and List, you'll need to call forceUpdateGrid to
        // ensure that the inner Grid is also updated."
        // - https://github.com/bvaughn/react-virtualized
        this.dataListRef.forceUpdateGrid();
      }
    }
  }
  _noRowsRenderer() {
    return <div style={{marginTop: '40px', color: 'grey'}}>No results.</div>;
  }
  _rowRenderer({index, isScrolling, key, style}) {
    const datum = this.props.data[index];
    return (
      <div className="Item" key={key} style={style}>
        <span className="DateLabel">
          <span className="DateLabelDate">
            {moment.utc(datum.timestamp).format("M/D")}
          </span>
          {moment.utc(datum.timestamp).format("HH:mm:ss")}
        </span>
        <div className="Value" dangerouslySetInnerHTML={{__html: datum.value}} />
      </div>
    );
  }
  render() {
    return (
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref="List"
            ref={(list) => { this.dataListRef = list; }}
            className="ScrollContainerData"
            height={height}
            overscanRowCount={10}
            noRowsRenderer={this._noRowsRenderer}
            rowCount={this.props.data.length}
            rowHeight={28}
            rowRenderer={this._rowRenderer}
            scrollToIndex={this.props.followEnd ? this.state.scrollToIndex : undefined}
            width={width}
            updateForcingProp1={this.props.derivativeFunc}
            updateForcingProp2={this.state.disablederivativeFunc}
          />
        )}
      </AutoSizer>
    );
  }
}
DefaultDataList.propTypes = {
  data: PropTypes.array.isRequired,
  followEnd: PropTypes.bool,
  derivativeFunc: PropTypes.string,
  disablederivativeFunc: PropTypes.bool,
  start: PropTypes.object,
  end: PropTypes.object
}

export default DefaultDataList;
