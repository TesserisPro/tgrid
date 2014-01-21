var TesserisPro;
(function (TesserisPro) {
    /// <reference path="SortDescriptor.ts" />
    /// <reference path="FilterDescriptor.ts" />
    (function (TGrid) {
        var ServerItemsProvider = (function () {
            function ServerItemsProvider(urlGetItems, urlGetTotalNumber, path) {
                this.urlGetItems = urlGetItems;
                this.urlGetTotalNumber = urlGetTotalNumber;
                this.path = path;
            }
            ServerItemsProvider.prototype.getItems = function (firstItem, itemsNumber, sortDescriptors, filterDescriptors, collapsedFilterDescriptors, callback) {
                var xmlhttp = new XMLHttpRequest();

                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        this.items = JSON.parse(xmlhttp.responseText);
                        callback(this.items, firstItem, itemsNumber);
                    }
                };
                xmlhttp.open("POST", this.urlGetItems.toString(), true);
                xmlhttp.setRequestHeader("Content-type", "application/json");
                xmlhttp.setRequestHeader("Accept", "application/json");
                xmlhttp.send(JSON.stringify({ firstItem: firstItem, itemsNumber: itemsNumber, sortDescriptors: sortDescriptors, filterDescriptors: filterDescriptors, collapsedFilterDescriptors: collapsedFilterDescriptors }));
            };

            ServerItemsProvider.prototype.getTotalItemsCount = function (filterDescriptors, callback) {
                var xmlhttp = new XMLHttpRequest();

                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        var count = parseInt(xmlhttp.response);
                        callback(count);
                    }
                };
                xmlhttp.open("POST", this.urlGetTotalNumber.toString(), true);
                xmlhttp.setRequestHeader("Content-type", "application/json");
                xmlhttp.setRequestHeader("Accept", "application/json");
                xmlhttp.send(JSON.stringify(filterDescriptors));
            };
            return ServerItemsProvider;
        })();
        TGrid.ServerItemsProvider = ServerItemsProvider;
    })(TesserisPro.TGrid || (TesserisPro.TGrid = {}));
    var TGrid = TesserisPro.TGrid;
})(TesserisPro || (TesserisPro = {}));
//# sourceMappingURL=ServerItemsProvider.js.map
