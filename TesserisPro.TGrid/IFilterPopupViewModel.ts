module TesserisPro.TGrid {

    export interface IFilterPopupViewModel {
        onOpen(options: Options, column: ColumnInfo);
        onApply();
        onClear();
        onClose();
        getColumnInfo(): ColumnInfo;
        onCloseFilterPopup();
    }
}