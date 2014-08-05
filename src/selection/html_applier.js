/**
 * Inspired by the rangy CSS Applier module written by Tim Down and licensed under the MIT license.
 * http://code.google.com/p/rangy/
 *
 * changed in order to be able ...
 *    - to use custom tags
 *    - to detect and replace similar css classes via reg exp
 */
(function(wysihtml5, rangy) {
  var defaultTagName = "span";

  var REG_EXP_WHITE_SPACE = /\s+/g;

  function hasClass(el, cssClass, regExp) {
    if (!el.className) {
      return false;
    }

    var matchingClassNames = el.className.match(regExp) || [];
    return matchingClassNames[matchingClassNames.length - 1] === cssClass;
  }

  function hasStyleAttr(el, regExp) {
    if (!el.getAttribute || !el.getAttribute('style')) {
      return false;
    }
    var matchingStyles = el.getAttribute('style').match(regExp);
    return  (el.getAttribute('style').match(regExp)) ? true : false;
  }

  function addStyle(el, cssStyle, regExp) {
    if (el.getAttribute('style')) {
      removeStyle(el, regExp);
      if (el.getAttribute('style') && !(/^\s*$/).test(el.getAttribute('style'))) {
        el.setAttribute('style', cssStyle + ";" + el.getAttribute('style'));
      } else {
        el.setAttribute('style', cssStyle);
      }
    } else {
      el.setAttribute('style', cssStyle);
    }
  }

  function addClass(el, cssClass, regExp) {
    if (el.className) {
      removeClass(el, regExp);
      el.className += " " + cssClass;
    } else {
      el.className = cssClass;
    }
  }

  function removeClass(el, regExp) {
    if (el.className) {
      el.className = el.className.replace(regExp, "");
    }
  }

  function removeStyle(el, regExp) {
    var s,
        s2 = [];
    if (el.getAttribute('style')) {
      s = el.getAttribute('style').split(';');
      for (var i = s.length; i--;) {
        if (!s[i].match(regExp) && !(/^\s*$/).test(s[i])) {
          s2.push(s[i]);
        }
      }
      if (s2.length) {
        el.setAttribute('style', s2.join(';'));
      } else {
        el.removeAttribute('style');
      }
    }
  }

  function getMatchingStyleRegexp(el, style) {
    var regexes = [],
        sSplit = style.split(';'),
        elStyle = el.getAttribute('style');

    if (elStyle) {
      elStyle = elStyle.replace(/\s/gi, '').toLowerCase();
      regexes.push(new RegExp("(^|\\s|;)" + style.replace(/\s/gi, '').replace(/([\(\)])/gi, "\\$1").toLowerCase().replace(";", ";?").replace(/rgb\\\((\d+),(\d+),(\d+)\\\)/gi, "\\s?rgb\\($1,\\s?$2,\\s?$3\\)"), "gi"));

      for (var i = sSplit.length; i-- > 0;) {
        if (!(/^\s*$/).test(sSplit[i])) {
          regexes.push(new RegExp("(^|\\s|;)" + sSplit[i].replace(/\s/gi, '').replace(/([\(\)])/gi, "\\$1").toLowerCase().replace(";", ";?").replace(/rgb\\\((\d+),(\d+),(\d+)\\\)/gi, "\\s?rgb\\($1,\\s?$2,\\s?$3\\)"), "gi"));
        }
      }
      for (var j = 0, jmax = regexes.length; j < jmax; j++) {
        if (elStyle.match(regexes[j])) {
          return regexes[j];
        }
      }
    }

    return false;
  }

  function isMatchingAllready(node, tags, style, className) {
    if (style) {
      return getMatchingStyleRegexp(node, style);
    } else if (className) {
      return wysihtml5.dom.hasClass(node, className);
    } else {
      return rangy.dom.arrayContains(tags, node.tagName.toLowerCase());
    }
  }

  function areMatchingAllready(nodes, tags, style, className) {
    for (var i = nodes.length; i--;) {
      if (!isMatchingAllready(nodes[i], tags, style, className)) {
        return false;
      }
    }
    return nodes.length ? true : false;
  }

  function removeOrChangeStyle(el, style, regExp) {

    var exactRegex = getMatchingStyleRegexp(el, style);
    if (exactRegex) {
      // adding same style value on property again removes style
      removeStyle(el, exactRegex);
      return "remove";
    } else {
      // adding new style value changes value
      addStyle(el, style, regExp);
      return "change";
    }
  }

  function hasSameClasses(el1, el2) {
    return el1.className.replace(REG_EXP_WHITE_SPACE, " ") == el2.className.replace(REG_EXP_WHITE_SPACE, " ");
  }

  function replaceWithOwnChildren(el) {
    var parent = el.parentNode;
    while (el.firstChild) {
      parent.insertBefore(el.firstChild, el);
    }
    parent.removeChild(el);
  }

  function elementsHaveSameNonClassAttributes(el1, el2) {
    if (el1.attributes.length != el2.attributes.length) {
      return false;
    }
    for (var i = 0, len = el1.attributes.length, attr1, attr2, name; i < len; ++i) {
      attr1 = el1.attributes[i];
      name = attr1.name;
      if (name != "class") {
        attr2 = el2.attributes.getNamedItem(name);
        if (attr1.specified != attr2.specified) {
          return false;
        }
        if (attr1.specified && attr1.nodeValue !== attr2.nodeValue) {
          return false;
        }
      }
    }
    return true;
  }

  function isSplitPoint(node, offset) {
    if (rangy.dom.isCharacterDataNode(node)) {
      if (offset == 0) {
        return !!node.previousSibling;
      } else if (offset == node.length) {
        return !!node.nextSibling;
      } else {
        return true;
      }
    }

    return offset > 0 && offset < node.childNodes.length;
  }

  function splitNodeAt(node, descendantNode, descendantOffset, container) {
    var newNode;
    if (rangy.dom.isCharacterDataNode(descendantNode)) {
      if (descendantOffset == 0) {
        descendantOffset = rangy.dom.getNodeIndex(descendantNode);
        descendantNode = descendantNode.parentNode;
      } else if (descendantOffset == descendantNode.length) {
        descendantOffset = rangy.dom.getNodeIndex(descendantNode) + 1;
        descendantNode = descendantNode.parentNode;
      } else {
        newNode = rangy.dom.splitDataNode(descendantNode, descendantOffset);
      }
    }
    if (!newNode) {
      if (!container || descendantNode !== container) {

        newNode = descendantNode.cloneNode(false);
        if (newNode.id) {
          newNode.removeAttribute("id");
        }
        var child;
        while ((child = descendantNode.childNodes[descendantOffset])) {
          newNode.appendChild(child);
        }
        rangy.dom.insertAfter(newNode, descendantNode);

      }
    }
    return (descendantNode == node) ? newNode :  splitNodeAt(node, newNode.parentNode, rangy.dom.getNodeIndex(newNode), container);
  }

  function Merge(firstNode) {
    this.isElementMerge = (firstNode.nodeType == wysihtml5.ELEMENT_NODE);
    this.firstTextNode = this.isElementMerge ? firstNode.lastChild : firstNode;
    this.textNodes = [this.firstTextNode];
  }

  Merge.prototype = {
    doMerge: function() {
      var textBits = [], textNode, parent, text;
      for (var i = 0, len = this.textNodes.length; i < len; ++i) {
        textNode = this.textNodes[i];
        parent = textNode.parentNode;
        textBits[i] = textNode.data;
        if (i) {
          parent.removeChild(textNode);
          if (!parent.hasChildNodes()) {
            parent.parentNode.removeChild(parent);
          }
        }
      }
      this.firstTextNode.data = text = textBits.join("");
      return text;
    },

    getLength: function() {
      var i = this.textNodes.length, len = 0;
      while (i--) {
        len += this.textNodes[i].length;
      }
      return len;
    },

    toString: function() {
      var textBits = [];
      for (var i = 0, len = this.textNodes.length; i < len; ++i) {
        textBits[i] = "'" + this.textNodes[i].data + "'";
      }
      return "[Merge(" + textBits.join(",") + ")]";
    }
  };

  function HTMLApplier(tagNames, cssClass, similarClassRegExp, normalize, cssStyle, similarStyleRegExp, container) {
    this.tagNames = tagNames || [defaultTagName];
    this.cssClass = cssClass || ((cssClass === false) ? false : "");
    this.similarClassRegExp = similarClassRegExp;
    this.cssStyle = cssStyle || "";
    this.similarStyleRegExp = similarStyleRegExp;
    this.normalize = normalize;
    this.applyToAnyTagName = false;
    this.container = container;
  }

  HTMLApplier.prototype = {
    getAncestorWithClass: function(node) {
      var cssClassMatch;
      while (node) {
        cssClassMatch = this.cssClass ? hasClass(node, this.cssClass, this.similarClassRegExp) : (this.cssStyle !== "") ? false : true;
        if (node.nodeType == wysihtml5.ELEMENT_NODE && node.getAttribute("contenteditable") != "false" &&  rangy.dom.arrayContains(this.tagNames, node.tagName.toLowerCase()) && cssClassMatch) {
          return node;
        }
        node = node.parentNode;
      }
      return false;
    },

    // returns parents of node with given style attribute
    getAncestorWithStyle: function(node) {
      var cssStyleMatch;
      while (node) {
        cssStyleMatch = this.cssStyle ? hasStyleAttr(node, this.similarStyleRegExp) : false;

        if (node.nodeType == wysihtml5.ELEMENT_NODE && node.getAttribute("contenteditable") != "false" && rangy.dom.arrayContains(this.tagNames, node.tagName.toLowerCase()) && cssStyleMatch) {
          return node;
        }
        node = node.parentNode;
      }
      return false;
    },

    getMatchingAncestor: function(node) {
      var ancestor = this.getAncestorWithClass(node),
          matchType = false;

      if (!ancestor) {
        ancestor = this.getAncestorWithStyle(node);
        if (ancestor) {
          matchType = "style";
        }
      } else {
        if (this.cssStyle) {
          matchType = "class";
        }
      }

      return {
        "element": ancestor,
        "type": matchType
      };
    },

    // Normalizes nodes after applying a CSS class to a Range.
    postApply: function(textNodes, range) {
      var firstNode = textNodes[0], lastNode = textNodes[textNodes.length - 1];

      var merges = [], currentMerge;

      var rangeStartNode = firstNode, rangeEndNode = lastNode;
      var rangeStartOffset = 0, rangeEndOffset = lastNode.length;

      var textNode, precedingTextNode;

      for (var i = 0, len = textNodes.length; i < len; ++i) {
        textNode = textNodes[i];
        precedingTextNode = null;
        if (textNode && textNode.parentNode) {
          precedingTextNode = this.getAdjacentMergeableTextNode(textNode.parentNode, false);
        }
        if (precedingTextNode) {
          if (!currentMerge) {
            currentMerge = new Merge(precedingTextNode);
            merges.push(currentMerge);
          }
          currentMerge.textNodes.push(textNode);
          if (textNode === firstNode) {
            rangeStartNode = currentMerge.firstTextNode;
            rangeStartOffset = rangeStartNode.length;
          }
          if (textNode === lastNode) {
            rangeEndNode = currentMerge.firstTextNode;
            rangeEndOffset = currentMerge.getLength();
          }
        } else {
          currentMerge = null;
        }
      }
      // Test whether the first node after the range needs merging
      if(lastNode && lastNode.parentNode) {
        var nextTextNode = this.getAdjacentMergeableTextNode(lastNode.parentNode, true);
        if (nextTextNode) {
          if (!currentMerge) {
            currentMerge = new Merge(lastNode);
            merges.push(currentMerge);
          }
          currentMerge.textNodes.push(nextTextNode);
        }
      }
      // Do the merges
      if (merges.length) {
        for (i = 0, len = merges.length; i < len; ++i) {
          merges[i].doMerge();
        }
        // Set the range boundaries
        range.setStart(rangeStartNode, rangeStartOffset);
        range.setEnd(rangeEndNode, rangeEndOffset);
      }
    },

    getAdjacentMergeableTextNode: function(node, forward) {
        var isTextNode = (node.nodeType == wysihtml5.TEXT_NODE);
        var el = isTextNode ? node.parentNode : node;
        var adjacentNode;
        var propName = forward ? "nextSibling" : "previousSibling";
        if (isTextNode) {
          // Can merge if the node's previous/next sibling is a text node
          adjacentNode = node[propName];
          if (adjacentNode && adjacentNode.nodeType == wysihtml5.TEXT_NODE) {
            return adjacentNode;
          }
        } else {
          // Compare element with its sibling
          adjacentNode = el[propName];
          if (adjacentNode && this.areElementsMergeable(node, adjacentNode)) {
            return adjacentNode[forward ? "firstChild" : "lastChild"];
          }
        }
        return null;
    },

    areElementsMergeable: function(el1, el2) {
      return rangy.dom.arrayContains(this.tagNames, (el1.tagName || "").toLowerCase())
        && rangy.dom.arrayContains(this.tagNames, (el2.tagName || "").toLowerCase())
        && hasSameClasses(el1, el2)
        && elementsHaveSameNonClassAttributes(el1, el2);
    },

    createContainer: function(doc) {
      var el = doc.createElement(this.tagNames[0]);
      if (this.cssClass) {
        el.className = this.cssClass;
      }
      if (this.cssStyle) {
        el.setAttribute('style', this.cssStyle);
      }
      return el;
    },

    applyToTextNode: function(textNode) {
      var parent = textNode.parentNode;
      if (parent.childNodes.length == 1 && rangy.dom.arrayContains(this.tagNames, parent.tagName.toLowerCase())) {

        if (this.cssClass) {
          addClass(parent, this.cssClass, this.similarClassRegExp);
        }
        if (this.cssStyle) {
          addStyle(parent, this.cssStyle, this.similarStyleRegExp);
        }
      } else {
        var el = this.createContainer(rangy.dom.getDocument(textNode));
        textNode.parentNode.insertBefore(el, textNode);
        el.appendChild(textNode);
      }
    },

    isRemovable: function(el) {
      return rangy.dom.arrayContains(this.tagNames, el.tagName.toLowerCase()) &&
              wysihtml5.lang.string(el.className).trim() === "" &&
              (
                !el.getAttribute('style') ||
                wysihtml5.lang.string(el.getAttribute('style')).trim() === ""
              );
    },

    undoToTextNode: function(textNode, range, ancestorWithClass, ancestorWithStyle) {
      var styleMode = (ancestorWithClass) ? false : true,
          ancestor = ancestorWithClass || ancestorWithStyle,
          styleChanged = false;
      if (!range.containsNode(ancestor)) {
        // Split out the portion of the ancestor from which we can remove the CSS class
        var ancestorRange = range.cloneRange();
            ancestorRange.selectNode(ancestor);

        if (ancestorRange.isPointInRange(range.endContainer, range.endOffset) && isSplitPoint(range.endContainer, range.endOffset)) {
            splitNodeAt(ancestor, range.endContainer, range.endOffset, this.container);
            range.setEndAfter(ancestor);
        }
        if (ancestorRange.isPointInRange(range.startContainer, range.startOffset) && isSplitPoint(range.startContainer, range.startOffset)) {
            ancestor = splitNodeAt(ancestor, range.startContainer, range.startOffset, this.container);
        }
      }

      if (!styleMode && this.similarClassRegExp) {
        removeClass(ancestor, this.similarClassRegExp);
      }

      if (styleMode && this.similarStyleRegExp) {
        styleChanged = (removeOrChangeStyle(ancestor, this.cssStyle, this.similarStyleRegExp) === "change");
      }
      if (this.isRemovable(ancestor) && !styleChanged) {
        replaceWithOwnChildren(ancestor);
      }
    },

    applyToRange: function(range) {
        var textNodes;
        for (var ri = range.length; ri--;) {
            textNodes = range[ri].getNodes([wysihtml5.TEXT_NODE]);

            if (!textNodes.length) {
              try {
                var node = this.createContainer(range[ri].endContainer.ownerDocument);
                range[ri].surroundContents(node);
                this.selectNode(range[ri], node);
                return;
              } catch(e) {}
            }

            range[ri].splitBoundaries();
            textNodes = range[ri].getNodes([wysihtml5.TEXT_NODE]);
            if (textNodes.length) {
              var textNode;

              for (var i = 0, len = textNodes.length; i < len; ++i) {
                textNode = textNodes[i];
                if (!this.getMatchingAncestor(textNode).element) {
                  this.applyToTextNode(textNode);
                }
              }

              range[ri].setStart(textNodes[0], 0);
              textNode = textNodes[textNodes.length - 1];
              range[ri].setEnd(textNode, textNode.length);

              if (this.normalize) {
                this.postApply(textNodes, range[ri]);
              }
            }

        }
    },

    undoToRange: function(range) {
      var textNodes, textNode, ancestorWithClass, ancestorWithStyle;
      for (var ri = range.length; ri--;) {

          textNodes = range[ri].getNodes([wysihtml5.TEXT_NODE]);
          if (textNodes.length) {
            range[ri].splitBoundaries();
            textNodes = range[ri].getNodes([wysihtml5.TEXT_NODE]);
          } else {
            var doc = range[ri].endContainer.ownerDocument,
                node = doc.createTextNode(wysihtml5.INVISIBLE_SPACE);
            range[ri].insertNode(node);
            range[ri].selectNode(node);
            textNodes = [node];
          }

          for (var i = 0, len = textNodes.length; i < len; ++i) {
            if (range[ri].isValid()) {
              textNode = textNodes[i];

              ancestor = this.getMatchingAncestor(textNode);
              if (ancestor.type === "style") {
                this.undoToTextNode(textNode, range[ri], false, ancestor.element);
              } else if (ancestor.element) {
                this.undoToTextNode(textNode, range[ri], ancestor.element);
              }
            }
          }

          if (len == 1) {
            this.selectNode(range[ri], textNodes[0]);
          } else {
            range[ri].setStart(textNodes[0], 0);
            textNode = textNodes[textNodes.length - 1];
            range[ri].setEnd(textNode, textNode.length);

            if (this.normalize) {
              this.postApply(textNodes, range[ri]);
            }
          }

      }
    },

    selectNode: function(range, node) {
      var isElement       = node.nodeType === wysihtml5.ELEMENT_NODE,
          canHaveHTML     = "canHaveHTML" in node ? node.canHaveHTML : true,
          content         = isElement ? node.innerHTML : node.data,
          isEmpty         = (content === "" || content === wysihtml5.INVISIBLE_SPACE);

      if (isEmpty && isElement && canHaveHTML) {
        // Make sure that caret is visible in node by inserting a zero width no breaking space
        try { node.innerHTML = wysihtml5.INVISIBLE_SPACE; } catch(e) {}
      }
      range.selectNodeContents(node);
      if (isEmpty && isElement) {
        range.collapse(false);
      } else if (isEmpty) {
        range.setStartAfter(node);
        range.setEndAfter(node);
      }
    },

    getTextSelectedByRange: function(textNode, range) {
      var textRange = range.cloneRange();
      textRange.selectNodeContents(textNode);

      var intersectionRange = textRange.intersection(range);
      var text = intersectionRange ? intersectionRange.toString() : "";
      textRange.detach();

      return text;
    },

    isAppliedToRange: function(range) {
      var ancestors = [],
          appliedType = "full",
          ancestor, styleAncestor, textNodes;

      for (var ri = range.length; ri--;) {

        textNodes = range[ri].getNodes([wysihtml5.TEXT_NODE]);
        if (!textNodes.length) {
          ancestor = this.getMatchingAncestor(range[ri].startContainer).element;

          return (ancestor) ? {
            "elements": [ancestor],
            "coverage": appliedType
          } : false;
        }

        for (var i = 0, len = textNodes.length, selectedText; i < len; ++i) {
          selectedText = this.getTextSelectedByRange(textNodes[i], range[ri]);
          ancestor = this.getMatchingAncestor(textNodes[i]).element;
          if (ancestor && selectedText != "") {
            ancestors.push(ancestor);

            if (wysihtml5.dom.getTextNodes(ancestor, true).length === 1) {
              appliedType = "full";
            } else if (appliedType === "full") {
              appliedType = "inline";
            }
          } else if (!ancestor) {
            appliedType = "partial";
          }
        }

      }

      return (ancestors.length) ? {
        "elements": ancestors,
        "coverage": appliedType
      } : false;
    },

    toggleRange: function(range) {
      var isApplied = this.isAppliedToRange(range),
          parentsExactMatch;

      if (isApplied) {
        if (isApplied.coverage === "full") {
          this.undoToRange(range);
        } else if (isApplied.coverage === "inline") {
          parentsExactMatch = areMatchingAllready(isApplied.elements, this.tagNames, this.cssStyle, this.cssClass);
          this.undoToRange(range);
          if (!parentsExactMatch) {
            this.applyToRange(range);
          }
        } else {
          // partial
          if (!areMatchingAllready(isApplied.elements, this.tagNames, this.cssStyle, this.cssClass)) {
            this.undoToRange(range);
          }
          this.applyToRange(range);
        }
      } else {
        this.applyToRange(range);
      }
    }
  };

  wysihtml5.selection.HTMLApplier = HTMLApplier;

})(wysihtml5, rangy);
