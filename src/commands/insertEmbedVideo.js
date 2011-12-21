(function(wysihtml5) {
  wysihtml5.commands.insertEmbedVideo = {
    /**     
     * @example
     *    wysihtml5.commands.insertEmbedVideo.exec(element, "insertEmbedVideo", "<iframe width="560" height="315" src="http://www.youtube.com/embed/dJfSS0ZXYdo" frameborder="0" allowfullscreen></iframe>");
     */
    exec: function(element, command, value) {
      var code = value.src,
	  attributes = {
	    src: wysihtml5.commands.getAttributeValue.exec(code,"src"),
	    width: wysihtml5.commands.getAttributeValue.exec(code,"width"),
	    height: wysihtml5.commands.getAttributeValue.exec(code,"height")
	  },
	  obj = (Object.create) ? Object.create(attributes) : new Object(attributes); //Object.create doesn't work in IE8
      wysihtml5.commands.insertVideo.exec(element, command, obj);
    },

    state: function(element) {
      wysihtml5.commands.insertVideo.state(element);
    },

    value: function(element) {
      wysihtml5.commands.insertVideo.value(element);
    }
  };
}(wysihtml5));