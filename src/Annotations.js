import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import './App.css';
import { saveAnnotation } from './actions'

class Annotations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newAnnotationText: ""
    };
    this.addAnnotation = this.addAnnotation.bind(this);
    this.newAnnotationChange = this.newAnnotationChange.bind(this);
  }
  addAnnotation() {
    if (this.state.newAnnotationText.trim()) {
      this.props.saveAnnotation(this.state.newAnnotationText);
      this.setState({
        newAnnotationText: ""
      });
    }
  }
  newAnnotationChange(event) {
    this.setState({newAnnotationText: event.target.value});
  }
  render() {
    const listItems = this.props.data.map((datum, i, a) => {
      let jsonData = null;
      try {
        jsonData = JSON.parse(datum.value);
      } catch (err) {
        console.log(datum);
        console.error(err);
      }
      const label = jsonData ? jsonData.annotation || '' : 'Parsing Error';
      return (
        <div className="Item" key={i}>
          <strong className="DateLabel">{`(${datum.timestamp})`}</strong>
          <div className="Value">
            {label}
          </div>
        </div>
      )
    });
    return (
      <div className="annotationsSidebar">
        <div className="annoationsLayout">
          <div className="annotationsList">
            {listItems}
          </div>
          <div className="annotationsAdd">
            <textarea
              onChange={this.newAnnotationChange}
              value={this.state.newAnnotationText}
              placeholder="Write a note to your future self about this moment."
            />
            <button
              onClick={this.addAnnotation}
            >Add</button>
          </div>
        </div>
      </div>
    );
  }
}
Annotations.propTypes = {
  start: PropTypes.object,
  end: PropTypes.object,
  data: PropTypes.array
}

function mapStateToProps(state) {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    saveAnnotation: (text) =>
      dispatch(saveAnnotation(text))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Annotations);
