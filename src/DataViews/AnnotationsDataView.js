import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import '../App.css';
import { saveAnnotation } from '../actions'
import moment from 'moment'

class AnnotationsDataView extends Component {
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
          <span className="DateLabel">
            <span className="DateLabelDate">
              {moment.utc(datum.timestamp).format("M/D")}
            </span>
            {moment.utc(datum.timestamp).format("HH:mm:ss")}
          </span>
          <div className="Value">
            {label}
          </div>
        </div>
      )
    });
    return (
      <div className="annoationsLayout">
        <div className="annotationsList">
          <div>
            <div>
              {listItems}
            </div>
          </div>
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
    );
  }
}
AnnotationsDataView.propTypes = {
  data: PropTypes.array.isRequired,
  followEnd: PropTypes.bool,
  derivativeFunc: PropTypes.string,
  disablederivativeFunc: PropTypes.bool,
  start: PropTypes.object,
  end: PropTypes.object
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

export default connect(mapStateToProps, mapDispatchToProps)(AnnotationsDataView);
