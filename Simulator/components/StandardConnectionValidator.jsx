import React, { Component, PropTypes } from 'react';

class Validator extends Component {
  constructor(props) {
    super(props);
    this.errors = props.errors;
  }

  render() {
    return (
      <div className={'validation-errors'}>
        <h3>Errors</h3>
        {(this.errors.length > 0) ?
          this.errors.map(error =>
            (<span>{error}</span>)
          )
          :
          (<span className={'no-errors'}>No Errors Found!</span>)
        }
      </div>
    );
  }
}

Validator.propTypes = {
  errors: PropTypes.array.isRequired,
};

export default Validator;
