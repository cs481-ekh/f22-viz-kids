'use strict';

const e = React.createElement;

class UploadButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { clicked: false };
  }

  render() {
    if (this.state.clicked) {
      return 'File Uploaded.';
    }

    return e(
      'button',
      { onClick: () => this.setState({ clicked: true }) },
      'Choose Marker Data File'
    );
  }
}

const domContainer = document.querySelector('#upload_button_container');
const root = ReactDOM.createRoot(domContainer);
root.render(e(UploadButton));