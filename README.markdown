# wysihtml5x

wysihtml5x is an extended and less strict approach on xing/wysihtml5 open source rich text editor based on HTML5 technology.
The code is completely library agnostic: No jQuery, Prototype or similar is required.

This project was initiated and is supported by the [XING AG](https://www.xing.com). Thanks!

## Features

* Auto linking of urls as-you-type
* Generates valid and semantic HTML5 markup (no `<font>` tags)
* Can use class-names instead of inline styles
* Unifies line-break handling across browsers (hitting enter will create `<br>` instead of `<p>` or `<div>`)
* Auto-parses content inserted via copy & paste (from Word, Powerpoint, PDF, other web pages, ...)
* Converts invalid or unknown html tags into valid/similar tags
* Source code view for users with HTML skills
* Uses sandboxed iframes in order to prevent identity theft through XSS
* Editor inherits styles and attributes (placeholder, autofocus, ...) from original textarea (you only have to style one element)
* Speech-input for Chrome

Extended features not present in xing/wysihtml5:

* Can be used without iframe sandbox when initiated on div instead of textarea
* Blocking of image drag drop in editable is removed
* Table insertion management and cell merging commands
* Improved parser with options to: unwrap tag instead of remove, keep defined styles, complex object type definitions for allowing elements.
* Ability to add uneditable area inside editor text flow (useful when building modules like video tools, advanced image editor etc.)
* Improved formatblock handling
* Ability for user to remove formating with only collapsed caret. (without having to select exactly whole text)
* Improved speed
* Anchor creting and removing logic changed to more universal
* Default build is without internal toolbar functions and build with "-toolbar" suffix contains default toolbar functions

## Browser Support

The rich text editing interface is supported in IE8+, FF 3.5+, Safari 4+, Safari on iOS 5+, Opera 11+ and Chrome.
**Graceful Degradation:** Users with other browsers will see the textarea and are still able to write plain HTML by themselves.

## Companies using wysihtml5

* [Basecamp](http://basecamp.com) - Leading web-based project management and collaboration tool
* [XING](https://www.xing.com) - Business Social Network with more than 12 million members
* [Qype](http://www.qype.com) - Largest user-generated local review site in Europe
* and many more ...

## Research

Before starting wysihtml5 we spent a lot of time investigating the different browsers and their behaviors.

Check this repository: https://github.com/tiff/wysihtml5-tests

A compatibility table for rich text query commands can be found here: http://tifftiff.de/contenteditable/compliance_test.html

A pure native rich text editor with HTML validator and live source preview is here: http://tifftiff.de/contenteditable/editor.html

## Development

wysihtml5 can be built using Grunt. Installation instructions for [Grunt can be found here](http://gruntjs.com/getting-started). Once you have it installed, wysihtml5 can be built by simply running

    grunt

This builds both minified and development versions, including one with toolbar support.

## Contributors

See the [list of contributors here](https://github.com/Edicy/wysihtml5/graphs/contributors).
