import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SubMenu from '../src/SubMenu';

async function waitForMenuVisible(menu) {
    await waitFor(() => expect(menu).toHaveClass('react-contextmenu--visible'));
}

describe('<SubMenu/>', () => {
    it('should have `react-contextmenu-item` & `react-contextmenu-submenu` classes', () => {
        render(<SubMenu title='foo' />);

        const submenuItem = screen.getByRole('menuitem', { name: 'foo' });
        expect(submenuItem).toHaveClass('react-contextmenu-item', 'react-contextmenu-submenu');
    });

    it('should have `disabled` class when disabled', () => {
        render(<SubMenu title='foo' disabled />);
        const submenuItem = screen.getByText('foo');

        expect(submenuItem).toHaveClass('react-contextmenu-item--disabled');
    });

    // waitForMenuVisible does an expectation.
    // eslint-disable-next-line jest/expect-expect
    it('should open submenu `onMouseEnter`', async () => {
        render(<SubMenu title='Title' hoverDelay={0} />);
        const submenu = screen.getByRole('menu');
        const user = userEvent.setup();
        const wrapper = screen.getByText('Title');
        await user.hover(wrapper);
        await waitForMenuVisible(submenu);
    });

    it('should not open submenu `onMouseEnter` when disabled', async () => {
        render(<SubMenu title='Title' hoverDelay={0} disabled />);
        const submenu = screen.getByRole('menu');
        const user = userEvent.setup();
        const wrapper = screen.getByText('Title');
        await user.hover(wrapper);
        await expect(() => waitForMenuVisible(submenu)).rejects.toThrow();
    });

    it('should not crash after immediate unmount', async () => {
        let callback = null;
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
            callback = cb;
            return 1;
        });
        const { unmount } = render(<SubMenu title='Title' hoverDelay={0} />);
        const user = userEvent.setup();
        const wrapper = screen.getByText('Title');
        await user.hover(wrapper);
        unmount();

        expect(callback).not.toThrow();
    });
});
