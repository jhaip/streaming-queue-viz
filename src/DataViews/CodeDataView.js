import React, { Component } from 'react';
import '../App.css';
import CodeListItem from '../CodeListItem'

class CodeDataView extends Component {
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
      (this.props.start === null || moment.utc(x.timestamp).toDate() >= moment.utc(this.props.start).toDate()) &&
      (this.props.end === null || moment.utc(x.timestamp).toDate() < moment.utc(this.props.end).toDate())
    ).map((x, i, a) =>
      <CodeListItem
        key={i}
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

export default CodeDataView;
