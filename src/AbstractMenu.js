import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MenuItem from './MenuItem';

export default class AbstractMenu extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired
    };

    constructor(props) {
        super(props);

        this.seletedItemRef = null;
        this.state = {
            selectedItem: null,
            forceSubMenuOpen: false
        };
    }

    handleKeyNavigation = (e) => {
        // check for isVisible strictly here as it might be undefined when this code executes in the context of SubMenu
        // but we only need to check when it runs in the ContextMenu context
        if (this.state.isVisible === false) {
            return;
        }

        switch (e.key) {
            case 'ArrowLeft': // left arrow
            case 'Left': // IE specific value
            case 'Escape': // escape
            case 'Esc': // IE specific value
                e.preventDefault();
                this.hideMenu(e);
                break;
            case 'ArrowUp': // up arrow
            case 'Up': // IE specific value
                e.preventDefault();
                this.selectChildren(true);
                break;
            case 'ArrowDown': // down arrow
            case 'Down': // IE specific value
                e.preventDefault();
                this.selectChildren(false);
                break;
            case 'ArrowRight': // right arrow
            case 'Right': // IE specific value
                this.tryToOpenSubMenu(e);
                break;
            case 'Enter': // enter
                e.preventDefault();
                this.tryToOpenSubMenu(e);
                {
                    // determine the selected item is disabled or not
                    const disabled = this.seletedItemRef &&
                        this.seletedItemRef.props &&
                        this.seletedItemRef.props.disabled;

                    if (this.seletedItemRef &&
                        this.seletedItemRef.ref instanceof HTMLElement &&
                        !disabled) {
                        this.seletedItemRef.ref.click();
                    } else {
                        this.hideMenu(e);
                    }
                }
                break;
            default:
                // do nothing
        }
    };

    handleForceClose = () => {
        this.setState({ forceSubMenuOpen: false });
    };

    tryToOpenSubMenu = (e) => {
        if (this.state.selectedItem && this.state.selectedItem.type === this.getSubMenuType()) {
            e.preventDefault();
            this.setState({ forceSubMenuOpen: true });
        }
    };

    selectChildren = (forward) => {
        const { selectedItem } = this.state;
        const children = [];
        let disabledChildrenCount = 0;
        let disabledChildIndexes = {};

        const childCollector = (child, index) => {
            // child can be empty in case you do conditional rendering of components, in which
            // case it should not be accounted for as a real child
            if (!child) {
                return;
            }

            if ([MenuItem, this.getSubMenuType()].indexOf(child.type) < 0 && child.props.children instanceof Object) {
                // Maybe the MenuItem or SubMenu is capsuled in a wrapper div or something else
                React.Children.forEach(child.props.children, childCollector);
            } else if (!child.props.divider) {
                if (child.props.disabled) {
                    ++disabledChildrenCount;
                    disabledChildIndexes[index] = true;
                }

                children.push(child);
            }
        };

        React.Children.forEach(this.props.children, childCollector);
        if (disabledChildrenCount === children.length) {
            // All menu items are disabled, so none can be selected, don't do anything
            return;
        }

        function findNextEnabledChildIndex(currentIndex) {
            let i = currentIndex;
            let incrementCounter = () => {
                if (forward) {
                    --i;
                } else {
                    ++i;
                }

                if (i < 0) {
                    i = children.length - 1;
                } else if (i >= children.length) {
                    i = 0;
                }
            };

            do {
                incrementCounter();
            } while (i !== currentIndex && disabledChildIndexes[i]);

            return i === currentIndex ? null : i;
        }

        const currentIndex = selectedItem ? selectedItem.index : -1;
        const nextEnabledChildIndex = findNextEnabledChildIndex(currentIndex);

        if (nextEnabledChildIndex !== null) {
            this.setState({
                selectedItem: {
                    index: nextEnabledChildIndex,
                    // We need to know the type of the selected item, so we can
                    // check it during render and tryToOpenSubMenu.
                    type: children[nextEnabledChildIndex].type
                },
                forceSubMenuOpen: false
            });
        }
    };

    onChildMouseMove = (child, itemIndex) => {
        if (this.state.selectedItem === null || this.state.selectedItem.index !== itemIndex) {
            this.setState({
                selectedItem: {
                    index: itemIndex,
                    type: child.type
                },
                forceSubMenuOpen: false
            });
        }
    };

    onChildMouseLeave = () => {
        this.setState({ selectedItem: null, forceSubMenuOpen: false });
    };

    /**
     * Render all the children.
     * It has a `childIndexRef` parameter to be able to construct the child
     * indexes properly. A reference was needed for this function because this
     * is a recursive function that could mutate the index and pass it back to
     * the caller. That parameter should always be undefined while calling from
     * outside.
     * TODO: Rewrite this function in a way that we don't need this reference.
     */
    renderChildren = (children, childIndexRef = { value: -1 }) =>
        React.Children.map(children, (child) => {
            let currentChildIndexRef = childIndexRef;
            const props = {};
            if (!React.isValidElement(child)) return child;

            if ([MenuItem, this.getSubMenuType()].indexOf(child.type) < 0) {
                // Maybe the MenuItem or SubMenu is capsuled in a wrapper div or something else
                props.children = this.renderChildren(child.props.children, currentChildIndexRef);
                return React.cloneElement(child, props);
            }

            // At this point we know that this is a menu item and we are going to
            // render it. We need to increment the child index and assign it as
            // the item index.
            let itemIndex = null;
            if (!child.props.divider) {
                // A MenuItem can be a divider. Do not increment the value if it's.
                itemIndex = ++currentChildIndexRef.value;
            }

            props.onMouseLeave = this.onChildMouseLeave.bind(this);
            if (child.type === this.getSubMenuType()) {
                // special props for SubMenu only
                props.forceOpen = this.state.forceSubMenuOpen &&
                    (this.state.selectedItem && this.state.selectedItem.index === itemIndex);
                props.forceClose = this.handleForceClose;
                props.parentKeyNavigationHandler = this.handleKeyNavigation;
            }
            if (!child.props.divider &&
                (this.state.selectedItem && this.state.selectedItem.index === itemIndex)) {
                // special props for selected item only
                props.selected = true;
                props.ref = (ref) => { this.seletedItemRef = ref; };
                return React.cloneElement(child, props);
            }

            // onMouseMove is only needed for non selected items
            props.onMouseMove = () => this.onChildMouseMove(child, itemIndex);
            return React.cloneElement(child, props);
        });
}
