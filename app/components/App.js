import React from 'react';

import NavigationBar from './NavigationBar';
import Footer from './Footer';

class App extends React.Component {
    constructor(props) {
        super(props);

        this._configureToastr();
    }

    _configureToastr() {
        toastr.options.closeButton = true;
        toastr.options.closeDuration = 0;
    }

    render() {
        return (
            <div>
                <NavigationBar history={this.props.history} />
                {this.props.children}
                <Footer />
            </div>
        );
    }
}

export default App;