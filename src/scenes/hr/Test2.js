import React from 'react';
import {Button} from 'antd';

export default class Test extends React.Component {

    render() {
        return (
            <div>
                吃了2
                <Button type="primary">Primary</Button>
                <Button>Default</Button>
                <Button type="dashed">Dashed</Button>
                <Button type="danger">Danger</Button>
            </div>
        )
    }
}
