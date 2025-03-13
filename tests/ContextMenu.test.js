import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContextMenu from '../src/ContextMenu';
import MenuItem from '../src/MenuItem';
import { showMenu as realShowMenu, hideMenu as realHideMenu } from '../src/actions';

function contextMenuElement() {
    return document.querySelector('.react-contextmenu');
}

function visibleContextMenuElement() {
    return document.querySelector('.react-contextmenu--visible');
}

function selectedItemElement() {
    return document.querySelector('.react-contextmenu-item--selected');
}

async function showMenu(data) {
    act(() => { realShowMenu(data); });
    await waitFor(() => expect(contextMenuElement()).toBeVisible());
}

async function hideMenu(data) {
    act(() => { realHideMenu(data); });
    await waitFor(() => expect(contextMenuElement()).not.toBeVisible());
}

describe('ContextMenu tests', () => {
    test('shows when event with correct "id" is triggered', async () => {
        const ID = 'CORRECT_ID';
        const x = 50;
        const y = 50;
        render(<ContextMenu id={ID} />);

        expect(document.body).toMatchSnapshot();
        await showMenu({ position: { x, y }, id: ID });
        expect(visibleContextMenuElement()).toBeInTheDocument();
        expect(document.body).toMatchSnapshot();
    });

    test('does not show when event with incorrect "id" is triggered', async () => {
        const ID = 'CORRECT_ID';
        const x = 50;
        const y = 50;
        render(<ContextMenu id={ID} />);

        await expect(showMenu({ position: { x, y }, id: 'WRONG_ID' })).rejects.toThrow();
        expect(visibleContextMenuElement()).not.toBeInTheDocument();
    });

    test('onShow and onHide are triggered correctly', async () => {
        const data = { position: { x: 50, y: 50 }, id: 'CORRECT_ID' };
        const onShow = jest.fn();
        const onHide = jest.fn();
        render(<ContextMenu id={data.id} onShow={onShow} onHide={onHide} />);

        await hideMenu();
        await showMenu(data);
        expect(onShow).toHaveBeenCalled();
        expect(visibleContextMenuElement()).toBeInTheDocument();
        await showMenu(data);
        expect(onShow).toHaveBeenCalledTimes(1);
        expect(onHide).not.toHaveBeenCalled();
        expect(visibleContextMenuElement()).toBeInTheDocument();
        await hideMenu();
        expect(onShow).toHaveBeenCalledTimes(1);
        expect(onHide).toHaveBeenCalledTimes(1);
        expect(visibleContextMenuElement()).not.toBeInTheDocument();
    });

    test('menu should close on "Escape"', async () => {
        const data = { position: { x: 50, y: 50 }, id: 'CORRECT_ID' };
        const onHide = jest.fn();
        render(<ContextMenu id={data.id} onHide={onHide} />);
        const user = userEvent.setup();

        await showMenu(data);
        expect(visibleContextMenuElement()).toBeInTheDocument();
        await user.keyboard('{Escape}');
        expect(visibleContextMenuElement()).not.toBeInTheDocument();
        expect(onHide).toHaveBeenCalled();
    });

    test('menu should close on "Enter" when selectedItem is null', async () => {
        const data = { position: { x: 50, y: 50 }, id: 'CORRECT_ID' };
        const onHide = jest.fn();
        render(<ContextMenu id={data.id} onHide={onHide} />);
        const user = userEvent.setup();

        await showMenu(data);
        await user.keyboard('{Enter}');
        expect(onHide).toHaveBeenCalled();
    });

    test('menu should close on "outside" click', async () => {
        const data = { position: { x: 50, y: 50 }, id: 'CORRECT_ID' };
        const onHide = jest.fn();
        render(<ContextMenu id={data.id} onHide={onHide} />);
        const user = userEvent.setup();

        await showMenu(data);
        expect(visibleContextMenuElement()).toBeInTheDocument();
        await user.click(visibleContextMenuElement());
        expect(visibleContextMenuElement()).toBeInTheDocument();
        await user.click(document.body);
        expect(visibleContextMenuElement()).not.toBeInTheDocument();
        expect(onHide).toHaveBeenCalled();
    });

    test('hideOnLeave and onMouseLeave options', async () => {
        const data = { position: { x: 50, y: 50 }, id: 'CORRECT_ID' };
        const onMouseLeave = jest.fn();
        render(
            <ContextMenu id={data.id} hideOnLeave onMouseLeave={onMouseLeave} />
        );
        const user = userEvent.setup();

        await showMenu(data);
        expect(visibleContextMenuElement()).toBeInTheDocument();
        await user.hover(visibleContextMenuElement());
        await user.unhover(visibleContextMenuElement());
        expect(visibleContextMenuElement()).not.toBeInTheDocument();
        expect(onMouseLeave).toHaveBeenCalled();
    });

    test('should select the proper menu items with down arrow', async () => {
        const data = { position: { x: 50, y: 50 }, id: 'CORRECT_ID' };
        const onHide = jest.fn();
        render(
            <ContextMenu id={data.id} onHide={onHide}>
                <MenuItem onClick={jest.fn()}>Item 1</MenuItem>
                <MenuItem onClick={jest.fn()}>Item 2</MenuItem>
            </ContextMenu>
        );
        const user = userEvent.setup();

        await showMenu(data);
        // Check that it's visible and there is no selected item at first.
        expect(visibleContextMenuElement()).toBeInTheDocument();
        expect(selectedItemElement()).not.toBeInTheDocument();

        // Select the first item with down arrow.
        await user.keyboard('{ArrowDown}');
        expect(screen.getByText('Item 1')).toHaveClass('react-contextmenu-item--selected');

        // Select the second item with down arrow.
        await user.keyboard('{ArrowDown}');
        // Index 1 with MenuItem type should be selected.
        expect(screen.getByText('Item 2')).toHaveClass('react-contextmenu-item--selected');

        // Select the next item. But since this was the last item, it should loop
        // back to the first again.
        await user.keyboard('{ArrowDown}');
        // Index 0 with MenuItem type should be selected.
        expect(screen.getByText('Item 1')).toHaveClass('react-contextmenu-item--selected');
    });

    test('should select the proper menu items with up arrow', async () => {
        const data = { position: { x: 50, y: 50 }, id: 'CORRECT_ID' };
        const onHide = jest.fn();
        render(
            <ContextMenu id={data.id} onHide={onHide}>
                <MenuItem onClick={jest.fn()}>Item 1</MenuItem>
                <MenuItem onClick={jest.fn()}>Item 2</MenuItem>
            </ContextMenu>
        );
        const user = userEvent.setup();

        await showMenu(data);
        // Check that it's visible and there is no selected item at first.
        expect(visibleContextMenuElement()).toBeInTheDocument();
        expect(selectedItemElement()).not.toBeInTheDocument();

        // Select the previous item. But since there was nothing selected, it
        // should loop back down to the last item.
        await user.keyboard('{ArrowUp}');
        expect(screen.getByText('Item 2')).toHaveClass('react-contextmenu-item--selected');

        // Select the first item with up arrow.
        await user.keyboard('{ArrowUp}');
        expect(screen.getByText('Item 1')).toHaveClass('react-contextmenu-item--selected');
    });

    test('should preserve the selected item after an enter', async () => {
        const data = { position: { x: 50, y: 50 }, id: 'CORRECT_ID' };
        const onHide = jest.fn();
        render(
            <ContextMenu id={data.id} onHide={onHide}>
                <MenuItem onClick={jest.fn()} preventClose>Item 1</MenuItem>
                <MenuItem divider />
                <MenuItem onClick={jest.fn()} preventClose>Item 2</MenuItem>
            </ContextMenu>
        );
        const user = userEvent.setup();

        await showMenu(data);
        // Check that it's visible and there is no selected item at first.
        expect(visibleContextMenuElement()).toBeInTheDocument();
        expect(selectedItemElement()).not.toBeInTheDocument();

        // Select the second item up arrow.
        await user.keyboard('{ArrowUp}');
        expect(screen.getByText('Item 2')).toHaveClass('react-contextmenu-item--selected');

        // Press enter to select it.
        await user.keyboard('{Enter}');
        // The selected item should be preserved and not reset.
        expect(screen.getByText('Item 2')).toHaveClass('react-contextmenu-item--selected');
    });

    test('should select proper menu item, even though it is wrapped with html element', async () => {
        const data = { position: { x: 50, y: 50 }, id: 'CORRECT_ID' };
        render(
            <ContextMenu id={data.id} onHide={jest.fn()}>
                <div><MenuItem onClick={jest.fn()}>Item 1</MenuItem></div>
                <span><MenuItem onClick={jest.fn()}>Item 2</MenuItem></span>
            </ContextMenu>
        );
        const user = userEvent.setup();

        await showMenu(data);
        // Check that it's visible and there is no selected item at first.
        expect(visibleContextMenuElement()).toBeInTheDocument();
        expect(selectedItemElement()).not.toBeInTheDocument();

        // Select the first item with down arrow.
        await user.keyboard('{ArrowDown}');
        expect(screen.getByText('Item 1')).toHaveClass('react-contextmenu-item--selected');

        // Select the second item with down arrow.
        await user.keyboard('{ArrowDown}');
        // Index 1 with MenuItem type should be selected.
        expect(screen.getByText('Item 2')).toHaveClass('react-contextmenu-item--selected');

        // Select the next item. But since this was the last item, it should loop
        // back to the first again.
        await user.keyboard('{ArrowDown}');
        // Index 0 with MenuItem type should be selected.
        expect(screen.getByText('Item 1')).toHaveClass('react-contextmenu-item--selected');
    });

    test('should allow keyboard actions when menu contains a non menu item element', async () => {
        const data = { position: { x: 50, y: 50 }, id: 'CORRECT_ID' };
        render(
            <ContextMenu id={data.id} onHide={jest.fn()}>
                <MenuItem onClick={jest.fn()}>Item 1</MenuItem>
                <MenuItem onClick={jest.fn()}>Item 2</MenuItem>
                <div>custom-content</div>
            </ContextMenu>
        );
        const user = userEvent.setup();

        await showMenu(data);
        // Check that it's visible and there is no selected item at first.
        expect(visibleContextMenuElement()).toBeInTheDocument();
        expect(selectedItemElement()).not.toBeInTheDocument();

        // Select the first item with down arrow and don't throw any errors
        await user.keyboard('{ArrowDown}');
        expect(screen.getByText('Item 1')).toHaveClass('react-contextmenu-item--selected');
    });
});
