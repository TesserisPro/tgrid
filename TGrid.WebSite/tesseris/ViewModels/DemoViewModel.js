var DemoViewModel = function () {
    var self = this;

    self.currentDemo = ko.observable("SimpleGridWithoutPaging");

    self.currentDemoUrl = ko.computed(function () { return window.location.href + "?demo=" + self.currentDemo(); });

    self.demos = ko.observableArray([
        { title: "Simple grid without paging", url: "SimpleGridWithoutPaging" },
        { title: "Simple grid without paging mobile", url: "SimpleGridWithoutPagingMobile" },
        { title: "Cell template", url: "CellTemplate" },
        { title: "Cell template mobile", url: "CellTemplateMobile" },
        { title: "Header template", url: "HeaderTemplate" },
        { title: "Header template mobile", url: "HeaderTemplateMobile" },
        { title: "Details template", url: "DetailsTemplate" },
        { title: "Details template mobile", url: "DetailsTemplateMobile" },
        { title: "Custom actions to open details", url: "CustomActionsToOpenDetails" },
        { title: "Paging", url: "Paging" },
        { title: "Paging mobile", url: "PagingMobile" },
        { title: "Virtualization/lazy loading", url: "LazyLoading" },
        { title: "Virtualization/lazy loading mobile", url: "lazyLoadingMobile" },
        { title: "Custom items provider", url: "CustomItemsProvider" },
        { title: "Grouping", url: "Grouping" },
        { title: "Grouping mobile", url: "GroupingMobile" },
        { title: "Grouping with virtualization", url: "GroupingWithVirtualization" },
        { title: "Editing with cell template", url: "EditingWithCellTemplate" },
        { title: "Performance - 100000 rows with virtualization", url: "RowsWithVirtualization" },
        { title: "Performance - 100000 rows with paging", url: "RowsWithPaging" }
    ]);

    self.openDemo = function (demoItem) {
        self.currentDemo(demoItem.url);
        $.ajax({
            type: "post",
            url: 'Code',
            success: function (response) {
                $("#html").append(response);
            }
        })
    }

    self.currentCodeName = ko.observable("HTML");

    //self.currentCode

    self.codes = ko.observableArray([
        { name: "HTML" },
        { name: "CSS" },
        { name: "JS" }
    ]);

    self.showCode = function (codeName) {
        self.currentCodeName(codeName.name);
        if (codeName.name == "HTML") {
            //$.ajax({
            //    type: "post",
            //    url: 'Code',
            //    success: function (response) {
            //        $("#html").append(response);
            //    }
            //})
        }
        if (codeName.name == "CSS") {
            $("#css").css({ "background": "green", "width":"200px", "height":"200px" })
        }
        if (codeName.name == "JS") {
            $("#js").css({ "background": "yellow", "width": "200px", "height": "200px" })
        }
    }

}