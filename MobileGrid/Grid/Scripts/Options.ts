module TesserisPro.TGrid {

    class Options {
        public data: any;
        public columnHeaders: Array<string>;
        public dataProvider: (fromItem: number, toItem: number) => Array<any>;
        public mobileViewMaxWidth: number;
        public pageSize: number;
        public currentPage: number;
    }

}