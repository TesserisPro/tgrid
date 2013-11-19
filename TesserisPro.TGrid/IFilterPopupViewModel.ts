module TesserisPro.TGrid {

    export interface IFilterPopupViewModel {
        //container: HTMLElement;
        //path: string;
        //value: string;
        //condition: FilterCondition;

        onApply();
        onClear();
        onClose();
    }
}