import React from 'react';
import asyncImport from '../components/Async/AsyncComponent'

export default (path, component) => (
    {
        path,
        title: 'HR 系统',
        strict: true,
        component,
        routes: [
            {
                path: path + "/test",
                title: 'test',
                component: asyncImport(()=> import('../scenes/hr/Test'))
            },
            {
                path: path + "/test2",
                title: 'test2',
                component: asyncImport(()=> import('../scenes/hr/Test2'))
            }
        ]
    }
)
