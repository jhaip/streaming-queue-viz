import React, { Component } from 'react';
import PropTypes from 'prop-types'
import '../App.css';
import CodeListItem from './CodeListItem'

class CodeDataView extends Component {
  scrollToBottom() {
    if (this.props.followEnd) {
      this.messagesEnd.scrollIntoView();
    }
  }
  componentDidMount() {
    this.scrollToBottom();
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }
  render() {
    const listItems = this.props.data.map((x, i, a) =>
      <CodeListItem
        key={i}
        datum={x}
        prevDatum={(i >= 1) ? a[i-1] : null}
      />
    );
    return (
      <div
        style={{overflowY: 'scroll', height: '100%'}}
      >
        <div
          style={{padding: '40px 10px 0px 10px'}}
        >
          {listItems}
          <div style={{ float:"left", clear: "both" }}
               ref={(el) => { this.messagesEnd = el; }}>
          </div>
        </div>
      </div>
    );
  }
}
CodeDataView.propTypes = {
  data: PropTypes.array.isRequired,
  followEnd: PropTypes.bool,
  derivativeFunc: PropTypes.string,
  disablederivativeFunc: PropTypes.bool,
  start: PropTypes.object,
  end: PropTypes.object
}

export default CodeDataView;
