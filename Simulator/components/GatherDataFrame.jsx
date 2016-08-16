import React, { Component, PropTypes } from 'react';

//----------------------Gather Data Frame---------------------//
// Component which houses the iframe that gets rendered in the
// Gather Data Phase. It uses it's ref function to set the
// state of simulatorWindow to be the frames content window
//-----------------------------------------------------------//

class GatherDataFrame extends Component {
  render() {
    return (
      <iframe
        style={{ display: 'none' }}
        src={this.props.wdcUrl}
        ref={this.props.setWindowAsGatherFrame}
      />
    );
  }

}

GatherDataFrame.propTypes = {
  wdcUrl: PropTypes.string.isRequired,
  setWindowAsGatherFrame: PropTypes.func.isRequired,
};

export default GatherDataFrame;
