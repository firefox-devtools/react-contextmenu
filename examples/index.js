import React from 'react';
import ReactDOMClient from 'react-dom/client';
import { HashRouter as Router, Route, NavLink, Routes } from 'react-router-dom';

import SimpleMenu from './SimpleMenu';
import MultipleTargets from './MultipleTargets';
import MultipleMenus from './MultipleMenus';
import SubMenus from './SubMenus';
import DynamicMenu from './DynamicMenu';
import Customization from './Customization';
import RTLSubMenu from './RTLSubMenu';
import Nested from './Nested';

import './react-contextmenu.css';

const commonProps = {
    className: 'pure-menu-link'
};

function App() {
    return (
        <div>
            <div className='pure-menu pure-menu-horizontal'>
                <ul className='pure-menu-list'>
                    <li className='pure-menu-item'>
                        <NavLink {...commonProps} to='/simple-menu'>
                            Simple Menu
                        </NavLink>
                    </li>
                    <li className='pure-menu-item'>
                        <NavLink {...commonProps} to='/multiple-targets'>
                            Multiple Targets
                        </NavLink>
                    </li>
                    <li className='pure-menu-item'>
                        <NavLink {...commonProps} to='/multiple-menus'>
                            Multiple Menus
                        </NavLink>
                    </li>
                    <li className='pure-menu-item'>
                        <NavLink {...commonProps} to='/submenus'>
                            Sub Menus
                        </NavLink>
                    </li>
                    <li className='pure-menu-item'>
                        <NavLink {...commonProps} to='/dynamic-menu'>
                            Dynamic Menu
                        </NavLink>
                    </li>
                    <li className='pure-menu-item'>
                        <NavLink {...commonProps} to='/customization'>
                            Customization
                        </NavLink>
                    </li>
                    <li className='pure-menu-item'>
                        <NavLink {...commonProps} to='/rtl-submenus'>
                            Right-to-Left
                        </NavLink>
                    </li>
                    <li className='pure-menu-item'>
                        <NavLink {...commonProps} to='/nested'>
                            Nested
                        </NavLink>
                    </li>
                </ul>
            </div>
            <Routes>
                <Route path='/simple-menu' element={<SimpleMenu />} />
                <Route path='/multiple-targets' element={<MultipleTargets />} />
                <Route path='/multiple-menus' element={<MultipleMenus />} />
                <Route path='/submenus' element={<SubMenus />} />
                <Route path='/dynamic-menu' element={<DynamicMenu />} />
                <Route path='/customization' element={<Customization />} />
                <Route path='/rtl-submenus' element={<RTLSubMenu />} />
                <Route path='/nested' element={<Nested />} />
            </Routes>
        </div>
    );
}

const root = ReactDOMClient.createRoot(document.getElementById('main'));
root.render(
    <Router
        future={{
            v7_relativeSplatPath: true,
            v7_startTransition: true
        }}>
        <App />
    </Router>
);
