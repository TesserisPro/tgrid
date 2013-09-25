/// <reference path="../Scripts/_references.ts" />
/// <reference path="../../TesserisPro.TGrid/TGrid.ts" />
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

    var options = new TesserisPro.TGrid.Options(testElement, TesserisPro.TGrid.Framework.Angular);

    equal(options.columnHeaders.length, 2);
});

test("TGrid builder test", function () {
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

    var options = new TesserisPro.TGrid.Options(testElement, TesserisPro.TGrid.Framework.Angular);
    var grid = new TesserisPro.TGrid.Grid(testElement, options);
    var table = grid.table;

    ok(true, "Test is ok");
});
//# sourceMappingURL=options.js.map
