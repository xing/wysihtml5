(function(wysihtml5) {
  wysihtml5.commands.getAttributeValue = {
    exec: function (code,attr){
      return code.substring(parseInt(code.indexOf(attr))+attr.length + 2,code.length).split("\" ")[0];
    }  
  };
}(wysihtml5));