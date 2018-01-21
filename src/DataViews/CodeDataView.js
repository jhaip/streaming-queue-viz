import React, { Component } from 'react';
import '../App.css';
import CodeListItem from '../CodeListItem'

class SerialDataView extends Component {
  scrollToBottom() {
    this.messagesEnd.scrollIntoView();
  }
  componentDidMount() {
    this.scrollToBottom();
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }
  render() {
    const listItems = this.props.data.filter(x =>
      (this.props.start === null || new Date(x.timestamp) >= this.props.start) &&
      (this.props.end === null || new Date(x.timestamp) < this.props.end)
    ).map((x, i, a) =>
      <CodeListItem
        datum={x}
        prevDatum={(i >= 1) ? a[i-1] : null}
      />
    );
    return (
      <div className="ScrollContainer" key="code">
        <div className="ScrollContainerData">
          {listItems}
          <div style={{ float:"left", clear: "both" }}
               ref={(el) => { this.messagesEnd = el; }}>
          </div>
        </div>
      </div>
    );
  }
}

export default SerialDataView;
