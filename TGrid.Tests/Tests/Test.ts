/// <reference path="../Scripts/typings/qunit/qunit.d.ts" />
/// <reference path="../Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="../../MobileGrid/Grid/Scripts/Options.ts" />


test("Options parser general test", () => {
    var testElement = $(
        "<div data-bind='grid: items'>\
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
    
    


});
