import React from "react";

export default function asyncComponent(importComponent) {
    class AsyncComponent extends React.Component {
        constructor(props) {
            super(props);
            this.state = {comp: null};
        }

        async componentDidMount() {
            const {default: comp} = await importComponent();
            this.setState({ comp });
        }

        render() {
            const Comp = this.state.comp;
            return Comp ? <Comp {...this.props} /> : null;
        }
    }

    return AsyncComponent;
}
