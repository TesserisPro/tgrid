var DocsViewModel = function () {
    var self = this;
    self.sections = ko.observableArray(sections);
    self.currentSectionPath = ko.observable("");
  
    var sectionRoutes = [];
    for (var i = 0; i < self.sections().length; i++) {
        var routes = [];
        var currentSection = self.sections()[i];
        for (var j = 0; j < currentSection.nodes.length; j++) {
            var currentNode = currentSection.nodes[j];
            routes.push(new routing.routes.NavigationRoute(currentNode.name, rootUrl + currentNode.file + ".md", { cacheView: true, isDefault: j == 0 ? true: false }));
        }

        sectionRoutes.push(new routing.routes.VirtualRoute(currentSection.path, routes, { isDefault: i == 0 ? true : false }));
    }

    router.registerRoutes(sectionRoutes);

    router.currentRoute.subscribe(function (currentRoute) {
        if(currentRoute && currentRoute.parrentRoute){
            self.currentSectionPath(currentRoute.parrentRoute.pattern);
        }
    });
};

var sections = [
    {
        name: "Table Properties",
        path: "TableProperties",
        nodes: [
            {
                name: "general",
                file: "tableProperties"
            },
            {
                name: "itemsProvider",
                file: "itemsProvider"
            },
            {
                name: "captureScroll",
                file: "captureScroll"
            },
            {
                name: "enableCollapsing",
                file: "enableCollapsing"
            },
            {
                name: "enableFiltering",
                file: "enableFiltering"
            },
            {
                name: "enableGrouping",
                file: "enableGrouping"
            },
            {
                name: "enablePaging",
                file: "enablePaging"
            },
            {
                name: "enableSorting",
                file: "enableSorting"
            },
            {
                name: "enableVirtualScroll",
                file: "enableVirtualScroll"
            },
            {
                name: "hideHeader",
                file:"hideHeader"
            },
            {
                name: "options",
                file: "options"
            },
            {
                name: "pageSize",
                file: "pageSize"
            },
            {
                name: "pageSlide",
                file: "pageSlide"
            },
            {
                name: "ready",
                file: "ready"
            },
            {
                name: "rowClick",
                file: "rowClick"
            },
            {
                name: "selectionMode",
                file: "selectionMode"
            },
            {
                name: "showDetailsOnSelection",
                file: "showDetailsOnSelection"
            }
        ],
    },
    {
        name: "Column Properties",
        path: "ColumnProperties",
        nodes: [
            {
                name: "data-g-member",
                file: "dataGMember"
            },
            {
                name: "data-g-enable-grouping",
                file: "dataGEnableGrouping"
            },
            {
                name: "data-g-enable-filtering",
                file: "dataGEnableFiltering"
            },
            {
                name: "data-g-enable-sorting",
                file: "dataGEnableSorting"
            },
            {
                name: "data-g-filter-member",
                file: "dataGFilterMember"
            },
            {
                name: "data-g-group-member",
                file: "dataGGroupMember"
            },
            {
                name: "data-g-not-sized",
                file: "dataGNotSized"
            },
            {
                name: "data-g-resizable",
                file: "dataGResizable"
            },
            {
                name: "data-g-sort-member",
                file: "dataGSortMember"
            },
            {
                name: "data-g-views",
                file: "dataGViews"
            },
            {
                name: "data-g-width",
                file: "dataGWidth"
            },
            {
                name: "data-g-width-percent",
                file: "dataGWidthPercent"
            }
        ]
    }
];