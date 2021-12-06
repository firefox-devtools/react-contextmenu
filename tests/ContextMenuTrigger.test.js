import React from 'react';
import { mount } from 'enzyme';

import ContextMenu from '../src/ContextMenu';
import ContextMenuTrigger from '../src/ContextMenuTrigger';

describe('ContextMenuTrigger tests', () => {
    function baseSetup(options = {}) {
        const ID = 'CORRECT_ID';
        const component = mount(<>
            <ContextMenu id={ID} />
            <ContextMenuTrigger id={ID} {...options} />
        </>);

        const wrapper = () => component.find('.react-contextmenu-wrapper');
        const contextMenu = () => component.find('.react-contextmenu');
        return { component, contextMenu, wrapper };
    }

    describe('without triggerOnLeftClick', () => {
        const setup = baseSetup;
        test('shows a ContextMenu when right clicking', () => {
            const { contextMenu, wrapper } = setup();
            wrapper().simulate('contextmenu', { button: 2, buttons: 2 });
            expect(contextMenu().hasClass('react-contextmenu--visible')).toBe(true);
        });

        test('shows a ContextMenu when ctrl + left clicking', () => {
            const { contextMenu, wrapper } = setup();
            wrapper().simulate('contextmenu', { button: 0, buttons: 1 });
            expect(contextMenu().hasClass('react-contextmenu--visible')).toBe(true);
        });

        test('does not show a ContextMenu when left clicking without a modifier', () => {
            const { contextMenu, wrapper } = setup();
            wrapper().simulate('click', { button: 0, buttons: 1 });
            expect(contextMenu().hasClass('react-contextmenu--visible')).toBe(false);
        });
    });

    describe('with triggerOnLeftClick', () => {
        function setup() {
            return baseSetup({ triggerOnLeftClick: true });
        }

        test('shows a ContextMenu when right clicking', () => {
            const { contextMenu, wrapper } = setup();
            wrapper().simulate('contextmenu', { button: 2, buttons: 2 });
            expect(contextMenu().hasClass('react-contextmenu--visible')).toBe(true);
        });

        test('shows a ContextMenu when ctrl + left clicking', () => {
            const { contextMenu, wrapper } = setup();
            wrapper().simulate('contextmenu', { button: 0, buttons: 1 });
            expect(contextMenu().hasClass('react-contextmenu--visible')).toBe(true);
        });

        test('shows a ContextMenu when left clicking without a modifier', () => {
            const { contextMenu, wrapper } = setup();
            wrapper().simulate('click', { button: 0, buttons: 1 });
            expect(contextMenu().hasClass('react-contextmenu--visible')).toBe(true);
        });
    });
});

