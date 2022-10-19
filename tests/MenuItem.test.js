import React from 'react';
import { render, screen } from '@testing-library/react';

import MenuItem from '../src/MenuItem';

describe('MenuItem tests', () => {
    test('extends className correctly', () => {
        const className = 'CLASSNAME_PROP';
        const attributes = {
            className: 'CLASSNAME_ATTRIBUTE'
        };

        render(
            <MenuItem className={className} attributes={attributes}>Item</MenuItem>
        );

        const element = screen.getByText('Item');
        expect(element).toHaveClass(className);
        expect(element).toHaveClass(attributes.className);
    });

    test('exposes the menuitem role by default', () => {
        render(
            <MenuItem>Item</MenuItem>
        );

        const element = screen.getByRole('menuitem');
        expect(element).toBeInTheDocument();
    });

    test('makes it possible to change the default role', () => {
        render(
            <MenuItem role='menuitemcheckbox' attributes={{ 'aria-checked': 'true' }}>Item</MenuItem>
        );

        const element = screen.getByRole('menuitemcheckbox');
        expect(element).toBeChecked();
    });
});
