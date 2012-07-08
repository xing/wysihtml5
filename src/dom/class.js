(function(wysihtml5) {
  var supportsClassList = wysihtml5.browser.supportsClassList(),
      api               = wysihtml5.dom;

  api.addClass = function(element, className) {
    var classList;
    if (supportsClassList && ((classList = element.classList) != null)) {
      return classList.add(className);
    }
    if (api.hasClass(element, className)) {
      return;
    }
    element.className += " " + className;
  };

  api.removeClass = function(element, className) {
    var classList;
    if (supportsClassList && ((classList = element.classList) != null)) {
      return classList.remove(className);
    }

    element.className = element.className.replace(new RegExp("(^|\\s+)" + className + "(\\s+|$)"), " ");
  };

  api.hasClass = function(element, className) {
    var classList;
    if (supportsClassList && ((classList = element.classList) != null)) {
      return classList.contains(className);
    }

    var elementClassName = element.className;
    return (elementClassName.length > 0 && (elementClassName == className || new RegExp("(^|\\s)" + className + "(\\s|$)").test(elementClassName)));
  };
})(wysihtml5);
