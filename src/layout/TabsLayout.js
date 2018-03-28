/**
 * @flow
 * @author tangzehua
 * @since 2018-02-12 14:53
 */
import React from 'react';
import {renderRoutes} from 'react-router-config';

export default class extends React.Component {

    render () {
        let {route} = this.props;
        return (
            <div>123123
                {renderRoutes(route.routes)}
            </div>
        )
    }
}
