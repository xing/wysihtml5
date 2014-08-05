if (wysihtml5.browser.supported()) {
  module("wysihtml5.quirks.cleanPastedHTML");

  test("Basic test", function(assert) {
    assert.htmlEqual(
      wysihtml5.quirks.cleanPastedHTML("<u>See: </u><a href=\"http://www.google.com\"><u><b>best search engine</b></u></a>"),
      "<u>See: </u><a href=\"http://www.google.com\"><b>best search engine</b></a>",
      "Correctly removed <u> within <a>"
    );
  });

  test("Non-breakable space test", function(assert) {
    assert.htmlEqual(
      wysihtml5.quirks.cleanPastedHTML("test&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"),
      "test &nbsp; &nbsp; ",
      "Correctly split nonbreakable spaces"
    );
  });
}
