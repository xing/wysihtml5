/**
 * Full HTML5 compatibility rule set
 * These rules define which tags and CSS classes are supported and which tags should be specially treated.
 *
 * Examples based on this rule set:
 *
 *    <a href="http://foobar.com">foo</a>
 *    ... becomes ...
 *    <a href="http://foobar.com" target="_blank" rel="nofollow">foo</a>
 *
 *    <img align="left" src="http://foobar.com/image.png">
 *    ... becomes ...
 *    <img class="wysiwyg-float-left" src="http://foobar.com/image.png" alt="">
 *
 *    <div>foo<script>alert(document.cookie)</script></div>
 *    ... becomes ...
 *    <div>foo</div>
 *
 *    <marquee>foo</marquee>
 *    ... becomes ...
 *    <span>foo</span>
 *
 *    foo <br clear="both"> bar
 *    ... becomes ...
 *    foo <br class="wysiwyg-clear-both"> bar
 *
 *    <div>hello <iframe src="http://google.com"></iframe></div>
 *    ... becomes ...
 *    <div>hello </div>
 *
 *    <center>hello</center>
 *    ... becomes ...
 *    <div class="wysiwyg-text-align-center">hello</div>
 */
var wysihtml5ParserRules = {
    /**
     * CSS Class white-list
     * Following CSS classes won't be removed when parsed by the wysihtml5 HTML parser
     */
    "classes": {
        "wysiwyg-clear-both": 1,
        "wysiwyg-clear-left": 1,
        "wysiwyg-clear-right": 1,
        "wysiwyg-color-aqua": 1,
        "wysiwyg-color-black": 1,
        "wysiwyg-color-blue": 1,
        "wysiwyg-color-fuchsia": 1,
        "wysiwyg-color-gray": 1,
        "wysiwyg-color-green": 1,
        "wysiwyg-color-lime": 1,
        "wysiwyg-color-maroon": 1,
        "wysiwyg-color-navy": 1,
        "wysiwyg-color-olive": 1,
        "wysiwyg-color-purple": 1,
        "wysiwyg-color-red": 1,
        "wysiwyg-color-silver": 1,
        "wysiwyg-color-teal": 1,
        "wysiwyg-color-white": 1,
        "wysiwyg-color-yellow": 1,
        "wysiwyg-float-left": 1,
        "wysiwyg-float-right": 1,
        "wysiwyg-font-size-large": 1,
        "wysiwyg-font-size-larger": 1,
        "wysiwyg-font-size-medium": 1,
        "wysiwyg-font-size-small": 1,
        "wysiwyg-font-size-smaller": 1,
        "wysiwyg-font-size-x-large": 1,
        "wysiwyg-font-size-x-small": 1,
        "wysiwyg-font-size-xx-large": 1,
        "wysiwyg-font-size-xx-small": 1,
        "wysiwyg-text-align-center": 1,
        "wysiwyg-text-align-justify": 1,
        "wysiwyg-text-align-left": 1,
        "wysiwyg-text-align-right": 1
    },
    /**
     * Tag list
     *
     * The following options are available:
     *
     *    - add_class:        converts and deletes the given HTML4 attribute (align, clear, ...) via the given method to a css class
     *                        The following methods are implemented in wysihtml5.dom.parse:
     *                          - align_text:  converts align attribute values (right/left/center/justify) to their corresponding css class "wysiwyg-text-align-*")
     *                            <p align="center">foo</p> ... becomes ... <p> class="wysiwyg-text-align-center">foo</p>
     *                          - clear_br:    converts clear attribute values left/right/all/both to their corresponding css class "wysiwyg-clear-*"
     *                            <br clear="all"> ... becomes ... <br class="wysiwyg-clear-both">
     *                          - align_img:    converts align attribute values (right/left) on <img> to their corresponding css class "wysiwyg-float-*"
     *                          
     *    - remove:             removes the element and its content
     *
     *    - rename_tag:         renames the element to the given tag
     *
     *    - set_class:          adds the given class to the element (note: make sure that the class is in the "classes" white list above)
     *
     *    - set_attributes:     sets/overrides the given attributes
     *
     *    - check_attributes:   checks the given HTML attribute via the given method
     *                            - url:            allows only valid urls (starting with http:// or https://)
     *                            - src:            allows something like "/foobar.jpg", "http://google.com", ...
     *                            - href:           allows something like "mailto:bert@foo.com", "http://google.com", "/foobar.jpg"
     *                            - alt:            strips unwanted characters. if the attribute is not set, then it gets set (to ensure valid and compatible HTML)
     *                            - numbers:  ensures that the attribute only contains numeric characters
     */
    "tags": {
        "a": {
            "check_attributes": {
                "href"   : "href",
                "rel"    : { 'func' : 'checkLinkRelation' },
                "target" : { 'func' : 'checkLinkTarget' }
            },
        },
        "abbr": 1,
        "acronym": {
            "rename_tag": "abbr"
        },
        "address": {
            "rename_tag": "p"
        },
        "applet": {
            "remove": 1
        },
        "area": {
            "remove": 1
        },
        "article": {
            "rename_tag": "p"
        },
        "aside": {
            "extract": 1
        },
        "audio": {
            "remove": 1
        },
        "b": 1,
        "base": {
            "remove": 1
        },
        "basefont": {
            "remove": 1
        },
        "bdi": 1,
        "bdo": 1,
        "bgsound": {
            "remove": 1
        },
        "big": {
            "rename_tag": "strong"
        },
        "blink": {
            "rename_tag": "strong"
        },
        "blockquote": {
            "rename_tag": "p"
        },
        "body": {
            "extract": 1
        },
        "br": 1,
        "button": { "remove": 1 },
        "canvas": {
            "remove": 1
        },
        "caption": {
            "rename_tag": "p",
        },
        "center": {
            "rename_tag": "p",
        },
        "cite": 1,
        "code": 1,
        "col": {
            "remove": 1
        },
        "colgroup": {
            "remove": 1
        },
        "command": {
            "remove": 1
        },
        "comment": {
            "rename_tag": "p"
        },
        "datalist": {
            "rename_tag": "ul"
        },
        "del": 1,
        "details": {
            "rename_tag": "p"
        },
        "device": {
            "remove": 1
        },
        "dfn": 1,
        "dir": {
            "rename_tag": "ul"
        },
        "div": {
            "extract" : {
                "ifnot" : { "class" : "^(columnised|column)$" }
            }
        },
        "dd": 1,
        "dl": 1,
        "dt": 1,
        "em": 1,
        "embed": {
            "remove": 1
        },
        "fieldset": {
            "extract": 1
        },
        "figcaption": {
            "extract": 1
        },
        "figure": {
            "extract": 1
        },
        "frameset": {
            "remove": 1
        },
        "font": {
            "extract": 1
        },
        "footer": {
            "extract": 1
        },
        "form": {
            "extract": 1
        },
        "frame": {
            "remove": 1
        },
        "h1": {
            "rename_tag": "h3"
        },
        "h2": {
            "rename_tag": "h3"
        },
        "h3": 1,
        "h4": 1,
        "h5": 1,
        "h6": 1,
        "header": {
            "rename_tag": "p"
        },
        "head": {
            "remove": 1
        },
        "hgroup": {
            "extract": 1
        },
        "hr": 1,
        "html": {
            "extract": 1
        },
        "i": 1,
        "iframe": {
            "extract": 1
        },
        "img": {
            "remove": 1
        },
        "input": { "remove": 1 },
        "ins": 1,
        "isindex": {
            "remove": 1
        },
        "keygen": {
            "remove": 1
        },
        "kbd": 1,
        "label": {
            "extract": 1
        },
        "legend": {
            "rename_tag": "strong"
        },
        "li": 1,
        "link": {
            "remove": 1
        },
        "listing": {
            "extract": 1
        },
        "map": {
            "remove": 1
        },
        "mark": {
            "rename_tag": "em"
        },
        "marquee": {
            "rename_tag": "em"
        },
        "menu": {
            "rename_tag": "ul"
        },
        "meta": { "remove": 1 },
        "meter": {
            "extract": 1
        },
        "multicol": {
            "rename_tag": "div",
            "add_class" : "columnised"
        },
        "nav": {
            "rename_tag": "p"
        },
        "nextid": {
            "remove": 1
        },
        "nobr": {
            "rename_tag": "code"
        },
        "noembed": {
            "remove": 1
        },
        "noframes": {
            "remove": 1
        },
        "noscript": { "remove": 1 },
        "object": {
            "remove": 1
        },
        "ol": 1,
        "optgroup": {
            "rename_tag": "p"
        },
        "option": {
            "rename_tag": "li"
        },
        "output": {
            "rename_tag": "p"
        },
        "p": 1,
        "param": {
            "remove": 1
        },
        "plaintext": {
            "rename_tag": "p"
        },
        "pre": {
            "rename_tag": "p"
        },
        "progress": {
            "remove": 1
        },
        "q": {
            "check_attributes": {
                "cite": "url"
            }
        },
        "rb": 1,
        "rp": 1,
        "rt": 1,
        "ruby": 1,
        "s": 1,
        "samp": {
            "rename_tag": "code"
        },
        "script": {
            "remove": 1
        },
        "select": {
            "rename_tag": "ul"
        },
        "section": {
            "extract": 1
        },
        "small": {
            "extract": 1,
        },
        "source": {
            "remove": 1
        },
        "spacer": {
            "remove": 1
        },
        "span": { "extract": 1 },
        "strike": {
            "rename_tag": "del"
        },
        "strong": 1,
        "style": {
            "remove": 1
        },
        "sub": 1,
        "sup": 1,
        "svg": { "remove": 1 },
        "table": { "remove": 1 },
        "tbody": { "remove": 1 },
        "textarea": {
            "rename_tag": "p"
        },
        "td": {
            "remove": 1
        },
        "tfoot": {
            "rename_tag": "p"
        },
        "th": {
            "rename_tag": "strong"
        },
        "thead": {
            "rename_tag": "p"
        },
        "time": 1,
        "title": {
            "remove": 1
        },
        "tr": {
            "rename_tag": "p"
        },
        "track": {
            "remove": 1
        },
        "tt": {
            "rename_tag": "blockquote"
        },
        "u": {
            "extract": 1
        },
        "ul": 1,
        "var": 1,
        "video": {
            "remove": 1
        },
        "wbr": {
            "remove": 1
        },
        "xml": {
            "remove": 1
        },
        "xmp": {
            "rename_tag": "p"
        },
    }
};