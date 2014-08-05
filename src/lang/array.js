wysihtml5.lang.array = function(arr) {
  return {
    /**
     * Check whether a given object exists in an array
     *
     * @example
     *    wysihtml5.lang.array([1, 2]).contains(1);
     *    // => true
     *
     * Can be used to match array with array. If intersection is found true is returned
     */
    contains: function(needle) {
      if (Array.isArray(needle)) {
        for (var i = needle.length; i--;) {
          if (wysihtml5.lang.array(arr).indexOf(needle[i]) !== -1) {
            return true;
          }
        }
        return false;
      } else {
        return wysihtml5.lang.array(arr).indexOf(needle) !== -1;
      }
    },

    /**
     * Check whether a given object exists in an array and return index
     * If no elelemt found returns -1
     *
     * @example
     *    wysihtml5.lang.array([1, 2]).indexOf(2);
     *    // => 1
     */
    indexOf: function(needle) {
        if (arr.indexOf) {
          return arr.indexOf(needle);
        } else {
          for (var i=0, length=arr.length; i<length; i++) {
            if (arr[i] === needle) { return i; }
          }
          return -1;
        }
    },

    /**
     * Substract one array from another
     *
     * @example
     *    wysihtml5.lang.array([1, 2, 3, 4]).without([3, 4]);
     *    // => [1, 2]
     */
    without: function(arrayToSubstract) {
      arrayToSubstract = wysihtml5.lang.array(arrayToSubstract);
      var newArr  = [],
          i       = 0,
          length  = arr.length;
      for (; i<length; i++) {
        if (!arrayToSubstract.contains(arr[i])) {
          newArr.push(arr[i]);
        }
      }
      return newArr;
    },

    /**
     * Return a clean native array
     *
     * Following will convert a Live NodeList to a proper Array
     * @example
     *    var childNodes = wysihtml5.lang.array(document.body.childNodes).get();
     */
    get: function() {
      var i        = 0,
          length   = arr.length,
          newArray = [];
      for (; i<length; i++) {
        newArray.push(arr[i]);
      }
      return newArray;
    },

    /**
     * Creates a new array with the results of calling a provided function on every element in this array.
     * optionally this can be provided as second argument
     *
     * @example
     *    var childNodes = wysihtml5.lang.array([1,2,3,4]).map(function (value, index, array) {
            return value * 2;
     *    });
     *    // => [2,4,6,8]
     */
    map: function(callback, thisArg) {
      if (Array.prototype.map) {
        return arr.map(callback, thisArg);
      } else {
        var len = arr.length >>> 0,
            A = new Array(len),
            i = 0;
        for (; i < len; i++) {
           A[i] = callback.call(thisArg, arr[i], i, arr);
        }
        return A;
      }
    },

    /* ReturnS new array without duplicate entries
     *
     * @example
     *    var uniq = wysihtml5.lang.array([1,2,3,2,1,4]).unique();
     *    // => [1,2,3,4]
     */
    unique: function() {
      var vals = [],
          max = arr.length,
          idx = 0;

      while (idx < max) {
        if (!wysihtml5.lang.array(vals).contains(arr[idx])) {
          vals.push(arr[idx]);
        }
        idx++;
      }
      return vals;
    }

  };
};
