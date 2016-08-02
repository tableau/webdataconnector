import React, { Component, PropTypes } from 'react';

class Validator extends Component {
  constructor(props) {
    super(props);
    this.errors = props.errors;
  }

  render() {
    return (
      <div className={`validation`}>
        <h4>Errors</h4>
        {
          this.errors.map( error =>
            return (
              <span>{error}</span>
            )
          )
        }
      </div>
    );
  }
}

Validator.propTypes = {
  errors: PropTypes.array.isRequired
}

export default Validator;
