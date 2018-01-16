import React, { Component } from 'react';
import './ListItem.css';

class ListItem extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.datum.timestamp !== nextProps.datum.timestamp);
  }
  render() {
    return (
      <div key={this.props.datum.timestamp} className="Item">
        <strong className="DateLabel">{`(${this.props.datum.timestamp})`}</strong>
        <div className="Value">{`${this.props.datum.value}`}</div>
      </div>
    );
  }
}

export default ListItem;
