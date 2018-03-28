import React from 'react';
import {Provider} from "mobx-react";
import AppRouter from '../router';
import {AppStore} from './AppStore';

const Store = {
    appStore: new AppStore(),
};

export default () => (
    <Provider {...Store}>
        <AppRouter/>
    </Provider>
)
