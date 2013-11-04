module TesserisPro.TGrid {

    export class FooterViewModel {
        public totalCount: number;
        public selectedItem: any;
        public currentPage: number;
        public totalPages: number;

        constructor(totalCount: number, selectedItem: any, currentPage: number, totalPages: number) {
            this.totalCount = totalCount;
            this.selectedItem = selectedItem;
            this.currentPage = currentPage;
            this.totalPages = totalPages;
        }
       
    }

}