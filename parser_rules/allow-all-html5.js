/**
 * Rule set to allow all valid HTML5 tags.
 * All obsolete HTML4 tags will be removed; or replaced where possible.
 *
 * @author Stephan Schmitz <eyecatchup@gmail.com>
 */
var doRemove = {"remove": 1},
 doNotRemove = {"remove": 0},
 wysihtml5ParserRules = {
    /**
     * CSS class white-list
     * Following CSS classes won't be removed when parsed by the wysihtml5 HTML parser
     */
    "classes": {
        "wysiwyg-font-size-larger":  1,
        "wysiwyg-text-align-center": 1
    },
    /**
     * HTML tag white-list
     * Following HTML5 valid tags won't be removed/replaced when parsed by the wysihtml5 HTML parser
     */
    "tags": {
        "a": {                             // Defines a hyperlink
          "set_attributes": {
            "target":   "_blank",
            "rel":      "nofollow"
          },
          "check_attributes": {
            "href":     "url"              // important to avoid XSS
          }
        },
        "abbr":         doNotRemove,       // Defines an abbreviation
        "acronym":      doNotRemove,       // Defines an acronym
        "address":      doNotRemove,       // Defines contact information for the author/owner of a document
        "applet":       doRemove,          // Defines an embedded applet
        "area":         doNotRemove,       // Defines an area inside an image-map
        "article":      doNotRemove,       // Defines an article
        "aside":        doNotRemove,       // Defines content aside from the page content
        "audio":        doNotRemove,       // Defines sound content
        "b":            doNotRemove,       // Defines bold text
        "base":         doNotRemove,       // Specifies the base URL/target for all relative URLs in a document
        "bdi":          doNotRemove,       // Isolates a part of text that might be formatted in a different direction from other text outside it
        "bdo":          doNotRemove,       // Overrides the current text direction
        "blockquote":   doNotRemove,       // Defines a section that is quoted from another source
        "body":         doNotRemove,       // Defines the document's body
        "br":           doNotRemove,       // Defines a single line break
        "button":       doNotRemove,       // Defines a clickable button
        "canvas":       doNotRemove,       // Used to draw graphics, on the fly, via scripting (usually JavaScript)
        "caption":      doNotRemove,       // Defines a table caption
        "cite":         doNotRemove,       // Defines the title of a work
        "code":         doNotRemove,       // Defines a piece of computer code
        "col":          doNotRemove,       // Specifies column properties for each column within a <colgroup> element
        "colgroup":     doNotRemove,       // Specifies a group of one or more columns in a table for formatting
        "command":      doNotRemove,       // Defines a command button that a user can invoke
        "datalist":     doNotRemove,       // Specifies a list of pre-defined options for input controls
        "dd":           doNotRemove,       // Defines a description of an item in a definition list
        "del":          doNotRemove,       // Defines text that has been deleted from a document
        "details":      doNotRemove,       // Defines additional details that the user can view or hide
        "dfn":          doNotRemove,       // Defines a definition term
        "dialog":       doNotRemove,       // Defines a dialog box or window
        "div":          doNotRemove,       // Defines a section in a document
        "dl":           doNotRemove,       // Defines a definition list
        "dt":           doNotRemove,       // Defines a term (an item) in a definition list
        "em":           doNotRemove,       // Defines emphasized text
        "embed":        doRemove,          // Defines a container for an external (non-HTML) application
        "fieldset":     doNotRemove,       // Groups related elements in a form
        "figcaption":   doNotRemove,       // Defines a caption for a <figure> element
        "figure":       doNotRemove,       // Specifies self-contained content
        "footer":       doNotRemove,       // Defines a footer for a document or section
        "form":         doNotRemove,       // Defines an HTML form for user input
        "h1":           doNotRemove,       // Defines a HTML heading
        "h2":           doNotRemove,       // Defines a HTML heading
        "h3":           doNotRemove,       // Defines a HTML heading
        "h4":           doNotRemove,       // Defines a HTML heading
        "h5":           doNotRemove,       // Defines a HTML heading
        "h6":           doNotRemove,       // Defines a HTML heading
        "head":         doNotRemove,       // Defines information about the document
        "header":       doNotRemove,       // Defines a header for a document or section
        "hgroup":       doNotRemove,       // Groups heading (<h1> to <h6>) elements
        "hr":           doNotRemove,       // Defines a thematic change in the content
        "html":         doNotRemove,       // Defines the root of an HTML document
        "i":            doNotRemove,       // Defines a part of text in an alternate voice or mood
        "iframe":       doRemove,          // Defines an inline frame
        "img":          doNotRemove,       // Defines an image
        "input":        doNotRemove,       // Defines an input control
        "ins":          doNotRemove,       // Defines a text that has been inserted into a document
        "kbd":          doNotRemove,       // Defines keyboard input
        "keygen":       doNotRemove,       // Defines a key-pair generator field (for forms)
        "label":        doNotRemove,       // Defines a label for an <input> element
        "legend":       doNotRemove,       // Defines a caption for a <fieldset>, < figure>, or <details> element
        "li":           doNotRemove,       // Defines a list item
        "link":         doNotRemove,       // Defines the relationship between a document and an external resource
        "map":          doNotRemove,       // Defines a client-side image-map
        "mark":         doNotRemove,       // Defines marked/highlighted text
        "menu":         doNotRemove,       // Defines a list/menu of commands
        "meta":         doNotRemove,       // Defines metadata about an HTML document
        "meter":        doNotRemove,       // Defines a scalar measurement within a known range (a gauge)
        "nav":          doNotRemove,       // Defines navigation links
        "noscript":     doNotRemove,       // Defines an alternate content for users that do not support client-side scripts
        "object":       doRemove,          // Defines an embedded object
        "ol":           doNotRemove,       // Defines an ordered list
        "optgroup":     doNotRemove,       // Defines a group of related options in a drop-down list
        "option":       doNotRemove,       // Defines an option in a drop-down list
        "output":       doNotRemove,       // Defines the result of a calculation
        "p":            doNotRemove,       // Defines a paragraph
        "param":        doNotRemove,       // Defines a parameter for an object
        "pre":          doNotRemove,       // Defines preformatted text
        "progress":     doNotRemove,       // Represents the progress of a task
        "q":            doNotRemove,       // Defines a short quotation
        "rp":           doNotRemove,       // Defines what to show in browsers that do not support ruby annotations
        "rt":           doNotRemove,       // Defines an explanation/pronunciation of characters (for East Asian typography)
        "ruby":         doNotRemove,       // Defines a ruby annotation (for East Asian typography)
        "s":            doNotRemove,       // Defines text that is no longer correct
        "samp":         doNotRemove,       // Defines sample output from a computer program
        "script":       doNotRemove,       // Defines a client-side script
        "section":      doNotRemove,       // Defines a section in a document
        "select":       doNotRemove,       // Defines a drop-down list
        "small":        doNotRemove,       // Defines smaller text
        "source":       doNotRemove,       // Defines multiple media resources for media elements (<video> and <audio>)
        "span":         doNotRemove,       // Defines a section in a document
        "strong":       doNotRemove,       // Defines important text
        "style":        doNotRemove,       // Defines style information for a document
        "sub":          doNotRemove,       // Defines subscripted text
        "summary":      doNotRemove,       // Defines a visible heading for a <details> element
        "sup":          doNotRemove,       // Defines superscripted text
        "table":        doNotRemove,       // Defines a table
        "tbody":        doNotRemove,       // Groups the body content in a table
        "td":           doNotRemove,       // Defines a cell in a table
        "textarea":     doNotRemove,       // Defines a multiline input control (text area)
        "tfoot":        doNotRemove,       // Groups the footer content in a table
        "th":           doNotRemove,       // Defines a header cell in a table
        "thead":        doNotRemove,       // Groups the header content in a table
        "time":         doNotRemove,       // Defines a date/time
        "title":        doNotRemove,       // Defines a title for the document
        "tr":           doNotRemove,       // Defines a row in a table
        "track":        doNotRemove,       // Defines text tracks for media elements (<video> and <audio>)
        "u":            doNotRemove,       // Defines text that should be stylistically different from normal text
        "ul":           doNotRemove,       // Defines an unordered list
        "var":          doNotRemove,       // Defines a variable
        "video":        doNotRemove,       // Defines a video or movie
        "wbr":          doNotRemove        // Defines a possible line-break
    }
};

/**
 * Remove obsulete HTML 4 tags (replace where possible).
 *
 * Removes
 *    <basefont>, <dir>, <font>, <frame>, <frameset>, <noframes>, <tt>
 * Replaces
 *    <big>, <center>, <strike>
 */
wysihtml5ParserRules.tags.basefont = doRemove;     // Specifies a default color, size, and font for all text in a document
wysihtml5ParserRules.tags.big = {                  // Defines big text
    "rename_tag":     "span",
    "set_class":      "wysiwyg-font-size-larger"
};
wysihtml5ParserRules.tags.center   = {             // Defines centered text
    "rename_tag":     "span",
    "set_class":      "wysiwyg-text-align-center"
};
wysihtml5ParserRules.tags.dir      = doRemove;     // Defines a directory list
wysihtml5ParserRules.tags.font     = {             // Defines font, color, and size for text
    "rename_tag":     "span"
},
wysihtml5ParserRules.tags.frame    = doRemove;     // Defines a window (a frame) in a frameset
wysihtml5ParserRules.tags.frameset = doRemove;     // Defines a set of frames
wysihtml5ParserRules.tags.noframes = doRemove;     // Defines an alternate content for users that do not support frames
wysihtml5ParserRules.tags.strike   = {             // Defines strikethrough text
    "rename_tag":     "span",
    "set_attributes": {
        "style":      "text-decoration:line-through;"
    }
};
wysihtml5ParserRules.tags.tt       = {             // Defines teletype text
    "rename_tag":     "span"
}
