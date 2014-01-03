/// <reference path="../ItemViewModel.ts" />
/// <reference path="../scripts/typings/knockout/knockout.d.ts"/>
module TesserisPro.TGrid {

    export class KnockoutItemViewModel extends ItemViewModel {

        public item: KnockoutObservable<any>;

        public setObservable(item: any) {
            this.item = ko.observable(item);
        }

        public setItemValue(value: any): void {
            this.item(value);
            this.item.valueHasMutated();
            this.item.notifySubscribers(value);
        }
    }
}