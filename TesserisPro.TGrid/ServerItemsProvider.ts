/// <reference path="SortDescriptor.ts" />
/// <reference path="FilterDescriptor.ts" />

module TesserisPro.TGrid {

    export class ServerItemsProvider implements IItemProvider {
        private urlGetItems: string;
        private urlGetTotalNumber: string;
        private items: Array<any>;
        private path: string;

        constructor(urlGetItems: string, urlGetTotalNumber: string, path: string) {
            this.urlGetItems = urlGetItems;
            this.urlGetTotalNumber = urlGetTotalNumber;
            this.path = path;
        }

        public getItems(firstItem: number,
            itemsNumber: number,
            sortDescriptors: Array<SortDescriptor>,
            filterDescriptors: Array<FilterDescriptor>,
            collapsedFilterDescriptors: Array<FilterDescriptor>,
            callback: (items: Array<any>, firstItem: number, itemsNumber: number) => void): void {
                var xmlhttp = new XMLHttpRequest();

                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        this.items = JSON.parse(xmlhttp.responseText);
                        callback( this.items, firstItem, itemsNumber);
                    }
                }
                xmlhttp.open("POST", this.urlGetItems.toString(), true);
                xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xmlhttp.setRequestHeader("Accept", "application/json");
                var object = { firstItem: firstItem, itemsNumber: itemsNumber, sortDescriptors: sortDescriptors, filterDescriptors: filterDescriptors, collapsedFilterDescriptors: collapsedFilterDescriptors };
                xmlhttp.send(object);
        }

        public getTotalItemsCount(filterDescriptors: Array<FilterDescriptor>, callback: (total: number) => void): void {
            var xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    callback(xmlhttp.response);
                }
            }
            xmlhttp.open("POST", this.urlGetTotalNumber.toString(), true);
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xmlhttp.setRequestHeader("Accept", "application/json");
            xmlhttp.send({ filterDescriptors: filterDescriptors });
        }
    }
}