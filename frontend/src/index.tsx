// eslint-disable-next-line import/no-extraneous-dependencies
import 'normalize.css/normalize.css';
import '@blueprintjs/core/dist/blueprint.css';

import 'lib/font-awesome';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from 'components/app';

ReactDOM.render((
  <Router>
    <App />
  </Router>
), document.getElementById('root'));
