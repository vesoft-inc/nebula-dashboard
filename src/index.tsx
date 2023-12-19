import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

// import 'antd/dist/antd.less';

import App from './App';
import { store } from './store';

const container = document.getElementById('app');;
const root = createRoot(container!);

root.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);
