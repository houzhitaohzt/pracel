import React from 'react';
import ReactDOM from 'react-dom';
import * as MobX from "mobx";
import App from './container';

import moment from 'moment';
import 'moment/locale/zh-cn';

// Enable MobX Strict Functionality
MobX.useStrict(true);

// moment language
moment.locale('zh-cn');

ReactDOM.render(<App/>, document.getElementById("@xt"));
