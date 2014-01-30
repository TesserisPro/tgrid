//=====================================================================================
//
// The Tesseris Free License
//
// Copyright(c) 2014 Tesseris Pro LLC
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this
// software and associated documentation files(the "Software"), to deal in the Software
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and / or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to the following
// conditions:
var TesserisPro;
(function (TesserisPro) {
    // 1. The above copyright notice and this permission notice shall be included in all
    //    copies or substantial portions of the Software.
    //
    // 2. Any software that fully or partially contains or uses materials covered by
    //    this license shall notify users about this notice and above copyright.The
    //    notification can be made in "About box" and / or site main web - page footer.The
    //    notification shall contain name of Tesseris Pro company and name of the Software
    //    covered by current license.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
    // INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
    // PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    // HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
    // OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
    // SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    //
    //=====================================================================================
    (function (TGrid) {
        var KnockoutFilterPopupViewModel = (function () {
            function KnockoutFilterPopupViewModel(container, onCloseFilterPopup) {
                this.container = container;
                this.onCloseFilterPopup = onCloseFilterPopup;
                this.path = ko.observable("");
            }
            KnockoutFilterPopupViewModel.prototype.onCloseFilterPopup = function () {
            };

            KnockoutFilterPopupViewModel.prototype.onApply = function () {
                this.condition = this.container.getElementsByTagName("select")[0].selectedIndex;
                if (this.condition != 0 /* None */) {
                    this.value = this.container.getElementsByTagName("input")[0].value;
                    var filterDescriptor = new TesserisPro.TGrid.FilterDescriptor(this.path(), this.value, this.condition);
                    var grid = TesserisPro.TGrid.Grid.getGridObject(this.container);
                    grid.setFilters(filterDescriptor, this.path());
                } else {
                    TesserisPro.TGrid.Grid.getGridObject(this.container).removeFilters(this.path());
                }
                hideElement(this.container);
                this.onCloseFilterPopup();
            };

            KnockoutFilterPopupViewModel.prototype.onClear = function () {
                TesserisPro.TGrid.Grid.getGridObject(this.container).removeFilters(this.path());
                hideElement(this.container);
                this.onCloseFilterPopup();
            };

            KnockoutFilterPopupViewModel.prototype.onClose = function () {
                hideElement(this.container);
                this.onCloseFilterPopup();
            };

            KnockoutFilterPopupViewModel.prototype.onOpen = function (options, column) {
                TesserisPro.TGrid.Grid.getGridObject(this.container).setDefaultFilterPopUpValues();
                this.columnInfo = column;
                this.path(column.filterMemberPath);
                for (var i = 0; i < options.filterDescriptors.length; i++) {
                    if (options.filterDescriptors[i].path == column.filterMemberPath) {
                        this.container.getElementsByTagName("input")[0].value = options.filterDescriptors[i].value;
                        this.container.getElementsByTagName("select")[0].selectedIndex = options.filterDescriptors[i].condition;
                    }
                }
            };

            KnockoutFilterPopupViewModel.prototype.getColumnInfo = function () {
                return this.columnInfo;
            };
            return KnockoutFilterPopupViewModel;
        })();
        TGrid.KnockoutFilterPopupViewModel = KnockoutFilterPopupViewModel;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=KnockoutFilterPopupViewModel.js.map
