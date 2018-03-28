import React from 'react';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {renderRoutes} from 'react-router-config';

import HomePage from '../scenes/home/components/HomePage';
import HRRoute from './HRRoute';

const baseLayout = props => renderRoutes(props.route.routes);

export const routes =[
    {
        path: '/',
        exact: true,
        component: HomePage
    },
    HRRoute("/hr", baseLayout)
];

export default () => (
    <BrowserRouter>
        {renderRoutes(routes)}
    </BrowserRouter>
);

