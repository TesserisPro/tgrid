/// <reference path="../Scripts/_references.ts" />
/// <reference path="../../MobileGrid/Grid/Scripts/TGrid.ts" />
test("Options parser general test", function () {
    var testElement = $("<div data-bind='grid: items'>\
            <script type = 'text/html' > \
                <column data-g-width='10' data-g-views='mobile,desktop' > \
                    <header>\
                        <span>Name </span>\
                    </header>\
                    <cell>\
                        <span data-bind='html: name'></span>\
                    </cell>\
                </column>\
                <column data-g-width='10' data-g-views='mobile,desktop'>\
                    <header>Type</header>\
                    <cell data-bind='html: type' />\
                </column>\
            </script>\
          </div>");

    var options = new TesserisPro.TGrid.Options(testElement);

    var grid = new TesserisPro.TGrid.Grid(testElement, options);

    var table = grid.table;
    equal(options.columnHeaders.length, 2);
});
//# sourceMappingURL=options.js.map
