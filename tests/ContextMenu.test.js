import React from 'react';
import { mount } from 'enzyme';

import ContextMenu from '../src/ContextMenu';
import MenuItem from '../src/MenuItem';
import { showMenu, hideMenu } from '../src/actions';

describe('ContextMenu tests', () => {
    test('shows when event with correct "id" is triggered', () => {
        const ID = 'CORRECT_ID';
        const x = 50;
        const y = 50;
        const component = mount(<ContextMenu id={ID} />);

        expect(component).toMatchSnapshot();
        expect(component.state()).toEqual({
            isVisible: false,
            x: 0,
            y: 0,
            forceSubMenuOpen: false,
            selectedItem: null
        });
        showMenu({ position: { x, y }, id: ID });
        component.update();
        expect(component.state()).toEqual({
            isVisible: true,
            x,
            y,
            forceSubMenuOpen: false,
            selectedItem: null
        });
        expect(component.find('.react-contextmenu--visible').length).toBe(1);
        expect(component).toMatchSnapshot();
        component.unmount();
    });

    test('does not shows when event with incorrect "id" is triggered', () => {
        const ID = 'CORRECT_ID';
        const x = 50;
        const y = 50;
        const component = mount(<ContextMenu id={ID} />);

        expect(component).toMatchSnapshot();
        expect(component.state()).toEqual({
            isVisible: false,
            x: 0,
            y: 0,
            forceSubMenuOpen: false,
            selectedItem: null
        });
        showMenu({ position: { x, y }, id: 'ID' });
        component.update();
        expect(component.state()).toEqual({
            isVisible: false,
            x: 0,
            y: 0,
            forceSubMenuOpen: false,
            selectedItem: null
        });
        expect(component.find('.react-contextmenu--visible').length).toBe(0);
        expect(component).toMatchSnapshot();
        component.unmount();
    });

    test('onShow and onHide are triggered correctly', () => {
        const data = { position: { x: 50, y: 50 }, id: 'CORRECT_ID' };
        const onShow = jest.fn();
        const onHide = jest.fn();
        const component = mount(<ContextMenu id={data.id} onShow={onShow} onHide={onHide} />);

        hideMenu();
        showMenu(data);
        expect(component.state()).toEqual(
            Object.assign(
                { isVisible: true, forceSubMenuOpen: false, selectedItem: null },
                data.position
            )
        );
        expect(onShow).toHaveBeenCalled();
        showMenu(data);
        expect(onShow).toHaveBeenCalledTimes(1);
        expect(onHide).not.toHaveBeenCalled();
        hideMenu();
        expect(component.state()).toEqual(
            Object.assign(
                { isVisible: false, forceSubMenuOpen: false, selectedItem: null },
                data.position
            )
        );
        expect(onShow).toHaveBeenCalledTimes(1);
        expect(onHide).toHaveBeenCalledTimes(1);
        component.unmount();
    });

    test('menu should close on "Escape"', () => {
        const data = { position: { x: 50, y: 50 }, id: 'CORRECT_ID' };
        const onHide = jest.fn();
        const component = mount(<ContextMenu id={data.id} onHide={onHide} />);
        const escape = new window.KeyboardEvent('keydown', { keyCode: 27 });

        showMenu(data);
        expect(component.state()).toEqual(
            Object.assign(
                { isVisible: true, forceSubMenuOpen: false, selectedItem: null },
                data.position
            )
        );
        document.dispatchEvent(escape);
        expect(component.state()).toEqual(
            Object.assign(
                { isVisible: false, forceSubMenuOpen: false, selectedItem: null },
                data.position
            )
        );
        expect(onHide).toHaveBeenCalled();
        component.unmount();
    });

    test('menu should close on "Enter" when selectedItem is null', () => {
        const data = { position: { x: 50, y: 50 }, id: 'CORRECT_ID' };
        const onHide = jest.fn();
        const component = mount(<ContextMenu id={data.id} onHide={onHide} />);
        const enter = new window.KeyboardEvent('keydown', { keyCode: 13 });

        showMenu(data);
        expect(component.state()).toEqual(
            Object.assign(
                { isVisible: true, forceSubMenuOpen: false, selectedItem: null },
                data.position
            )
        );
        document.dispatchEvent(enter);
        expect(component.state()).toEqual(
            Object.assign(
                { isVisible: false, forceSubMenuOpen: false, selectedItem: null },
                data.position
            )
        );
        expect(onHide).toHaveBeenCalled();
        component.unmount();
    });

    test('menu should close on "outside" click', () => {
        const data = { position: { x: 50, y: 50 }, id: 'CORRECT_ID' };
        const onHide = jest.fn();
        const component = mount(<ContextMenu id={data.id} onHide={onHide} />);
        const outsideClick = new window.MouseEvent('mousedown', { target: document });

        showMenu(data);
        expect(component.state()).toEqual(
            Object.assign(
                { isVisible: true, forceSubMenuOpen: false, selectedItem: null },
                data.position
            )
        );
        component.simulate('mousedown');
        expect(component.state()).toEqual(
            Object.assign(
                { isVisible: true, forceSubMenuOpen: false, selectedItem: null },
                data.position
            )
        );
        document.dispatchEvent(outsideClick);
        expect(component.state()).toEqual(
            Object.assign(
                { isVisible: false, forceSubMenuOpen: false, selectedItem: null },
                data.position
            )
        );
        expect(onHide).toHaveBeenCalled();
        component.unmount();
    });

    test('hideOnLeave and onMouseLeave options', () => {
        const data = { position: { x: 50, y: 50 }, id: 'CORRECT_ID' };
        const onMouseLeave = jest.fn();
        const component = mount(
            <ContextMenu id={data.id} hideOnLeave onMouseLeave={onMouseLeave} />
        );

        showMenu(data);
        expect(component.state()).toEqual(
            Object.assign(
                { isVisible: true, forceSubMenuOpen: false, selectedItem: null },
                data.position
            )
        );
        component.simulate('mouseleave');
        expect(component.state()).toEqual(
            Object.assign(
                { isVisible: false, forceSubMenuOpen: false, selectedItem: null },
                data.position
            )
        );
        expect(onMouseLeave).toHaveBeenCalled();
        component.unmount();
    });

    test('should select the proper menu items with down arrow', () => {
        const data = { position: { x: 50, y: 50 }, id: 'CORRECT_ID' };
        const onHide = jest.fn();
        const component = mount(
            <ContextMenu id={data.id} onHide={onHide}>
                <MenuItem onClick={jest.fn()}>Item 1</MenuItem>
                <MenuItem onClick={jest.fn()}>Item 2</MenuItem>
            </ContextMenu>
        );
        const downArrow = new window.KeyboardEvent('keydown', { keyCode: 40 });

        showMenu(data);
        // Check that it's visible and there is no selected item at first.
        expect(component.state()).toEqual(
            Object.assign(
                { isVisible: true, forceSubMenuOpen: false, selectedItem: null },
                data.position
            )
        );

        // Select the first item with down arrow.
        document.dispatchEvent(downArrow);
        // Index 0 with MenuItem type should be selected.
        expect(component.state().selectedItem).toEqual({
            index: 0,
            type: MenuItem
        });

        // Select the second item with down arrow.
        document.dispatchEvent(downArrow);
        // Index 1 with MenuItem type should be selected.
        expect(component.state().selectedItem).toEqual({
            index: 1,
            type: MenuItem
        });

        // Select the next item. But since this was the last item, it should loop
        // back to the first again.
        document.dispatchEvent(downArrow);
        // Index 0 with MenuItem type should be selected.
        expect(component.state().selectedItem).toEqual({
            index: 0,
            type: MenuItem
        });

        component.unmount();
    });

    test('should select the proper menu items with up arrow', () => {
        const data = { position: { x: 50, y: 50 }, id: 'CORRECT_ID' };
        const onHide = jest.fn();
        const component = mount(
            <ContextMenu id={data.id} onHide={onHide}>
                <MenuItem onClick={jest.fn()}>Item 1</MenuItem>
                <MenuItem onClick={jest.fn()}>Item 2</MenuItem>
            </ContextMenu>
        );
        const upArrow = new window.KeyboardEvent('keydown', { keyCode: 38 });

        showMenu(data);
        // Check that it's visible and there is no selected item at first.
        expect(component.state()).toEqual(
            Object.assign(
                { isVisible: true, forceSubMenuOpen: false, selectedItem: null },
                data.position
            )
        );

        // Select the previous item. But since there was nothing selected, it
        // should loop back down to the last item.
        document.dispatchEvent(upArrow);
        // Index 1 with MenuItem type should be selected.
        expect(component.state().selectedItem).toEqual({
            index: 1,
            type: MenuItem
        });

        // Select the first item with up arrow.
        document.dispatchEvent(upArrow);
        // Index 0 with MenuItem type should be selected.
        expect(component.state().selectedItem).toEqual({
            index: 0,
            type: MenuItem
        });

        component.unmount();
    });

    test('should preserve the selected item after an enter', () => {
        const data = { position: { x: 50, y: 50 }, id: 'CORRECT_ID' };
        const onHide = jest.fn();
        const component = mount(
            <ContextMenu id={data.id} onHide={onHide}>
                <MenuItem onClick={jest.fn()} preventClose>Item 1</MenuItem>
                <MenuItem divider />
                <MenuItem onClick={jest.fn()} preventClose>Item 2</MenuItem>
            </ContextMenu>
        );
        const upArrow = new window.KeyboardEvent('keydown', { keyCode: 38 });
        const enter = new window.KeyboardEvent('keydown', { keyCode: 13 });

        showMenu(data);
        // Check that it's visible and there is no selected item at first.
        expect(component.state()).toEqual(
            Object.assign(
                { isVisible: true, forceSubMenuOpen: false, selectedItem: null },
                data.position
            )
        );

        // Select the second item up arrow.
        document.dispatchEvent(upArrow);
        expect(component.state().selectedItem).toEqual({
            index: 1,
            type: MenuItem
        });

        // Press enter to select it.
        document.dispatchEvent(enter);
        // The selected item should be preserved and not reset.
        expect(component.state().selectedItem).toEqual({
            index: 1,
            type: MenuItem
        });

        component.unmount();
    });
});
