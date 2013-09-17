test("Options parser general test", function () {
    var testElement = $("<div data-bind='grid: items'>\
            <script type = 'text/html' > \
                <column data-g-width='10' data-g-views='mobile,descktop' > \
                    <header>\
                        <span>Name </span>\
                    </header>\
                    <cell>\
                        <span data-bind='html: name'></span>\
                    </cell>\
                </column>\
                <column data-g-width='10' data-g-views='mobile,descktop'>\
                    <header>Type</header>\
                    <cell data-bind='html: type' />\
                </column>\
            </script>\
          </div>");

    var options = new TesserisPro.TGrid.Options(testElement);

    equal(options.data, testElement);
});
