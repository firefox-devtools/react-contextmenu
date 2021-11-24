# React Contextmenu

ContextMenu in React with accessibility support. Live Examples can be found [here](//vkbansal.github.io/react-contextmenu/)

This is a fork from [the original project](https://github.com/vkbansal/react-contextmenu) for use with the [firefox profiler](https://github.com/firefox-devtools/profiler/). We
don't intend to add new features but will fix issues with the existing code, and
sometimes change it for our usage. We hope it can be useful for more projects.

Thanks [Vivek Kumar Bansal](https://github.com/vkbansal) for all the good work
put in this project.

## Table of contents

 - [Installation](#installation)
 - [Browser Support](#browser-support)
 - [Usage](#usage)
 - [API](#api)
 - [FAQs](#faqs)
 - [Contributors](#contributors)
 - [Changelog](#changelog)
 - [License](#license)

## Installation

Using npm

```
npm install --save @firefox-devtools/react-contextmenu
```

Using yarn

```
yarn add @firefox-devtools/react-contextmenu
```

## Browser Support
- IE 11 and Edge >= 12
- FireFox >= 38
- Chrome >= 47
- Opera >= 34
- Safari >= 8

## Usage

Simple example

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "@firefox-devtools/react-contextmenu";

function handleClick(e, data) {
  console.log(data.foo);
}

function MyApp() {
  return (
    <div>
      {/* NOTICE: id must be unique between EVERY <ContextMenuTrigger> and <ContextMenu> pair */}
      {/* NOTICE: inside the pair, <ContextMenuTrigger> and <ContextMenu> must have the same id */}

      <ContextMenuTrigger id="same_unique_identifier">
        <div className="well">Right click to see the menu</div>
      </ContextMenuTrigger>

      <ContextMenu id="same_unique_identifier">
        <MenuItem data={{foo: 'bar'}} onClick={this.handleClick}>
          ContextMenu Item 1
        </MenuItem>
        <MenuItem data={{foo: 'bar'}} onClick={this.handleClick}>
          ContextMenu Item 2
        </MenuItem>
        <MenuItem divider />
        <MenuItem data={{foo: 'bar'}} onClick={this.handleClick}>
          ContextMenu Item 3
        </MenuItem>
      </ContextMenu>

    </div>
  );
}

ReactDOM.render(<MyApp myProp={12}/>, document.getElementById("main"));
```

see [usage docs](./docs/usage.md) / [examples](./examples) for more details.

## API

[API docs](./docs/api.md)

## FAQs

[ALL FAQs](./docs/faq.md)

## Who's using react-contextmenu?
- [react-data-grid](https://github.com/adazzle/react-data-grid)
- [teamup.com](https://teamup.com)
- [Spotify Web Player](https://open.spotify.com)

## Contributors

[All Contributors](https://github.com/firefox-devtools/react-contextmenu/graphs/contributors)

## Changelog

For Changelog, see [releases](https://github.com/firefox-devtools/react-contextmenu/releases)
For the changelog from before the fork, see [releases](https://github.com/vkbansal/react-contextmenu/releases)

## License

[MIT](./LICENSE.md). Copyright(c) [Vivek Kumar Bansal](http://vkbansal.me/)
