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
            routes.push(new routing.routes.NavigationRoute(currentNode.routeName, rootUrl + currentNode.file + ".md", { cacheView: true, isDefault: j == 0 ? true : false }));
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
        name: "General",
        path: "General",
        nodes: [
            {
                name: "general",
                routeName: "general",
                file: "general"
            }
        ]
    },
    {
        name: "Grid Settings",
        path: "GridSettings",
        nodes: [
            {
                name: "general settings",
                routeName: "general_settings",
                file: "gridSettings"
            },
            {
                name: "itemsProvider",
                routeName: "itemsProvider",
                file: "itemsProvider"
            },
            {
                name: "captureScroll",
                routeName: "captureScroll",
                file: "captureScroll"
            },
            {
                name: "enableCollapsing",
                routeName: "enableCollapsing",
                file: "enableCollapsing"
            },
            {
                name: "enableFiltering",
                routeName: "enableFiltering",
                file: "enableFiltering"
            },
            {
                name: "enableGrouping",
                routeName: "enableGrouping",
                file: "enableGrouping"
            },
            {
                name: "enablePaging",
                routeName: "enablePaging",
                file: "enablePaging"
            },
            {
                name: "enableSorting",
                routeName: "enableSorting",
                file: "enableSorting"
            },
            {
                name: "enableVirtualScroll",
                routeName: "enableVirtualScroll",
                file: "enableVirtualScroll"
            },
            {
                name: "hideHeader",
                routeName: "hideHeader",
                file:"hideHeader"
            },
            {
                name: "options",
                routeName: "options",
                file: "options"
            },
            {
                name: "pageSize",
                routeName: "pageSize",
                file: "pageSize"
            },
            {
                name: "pageSlide",
                routeName: "pageSlide",
                file: "pageSlide"
            },
            {
                name: "ready",
                routeName: "ready",
                file: "ready"
            },
            {
                name: "rowClick",
                routeName: "rowClick",
                file: "rowClick"
            },
            {
                name: "selectionMode",
                routeName: "selectionMode",
                file: "selectionMode"
            },
            {
                name: "showDetailsOnSelection",
                routeName: "showDetailsOnSelection",
                file: "showDetailsOnSelection"
            }
        ],
    },
    {
        name: "Columns Definitions",
        path: "ColumnsDefinitions",
        nodes: [
            {
                name: "columns general",
                routeName: "columns_general",
                file: "columnsGeneral"
            },
            {
                name: "data-g-member",
                routeName: "data-g-member",
                file: "dataGMember"
            },
            {
                name: "data-g-enable-grouping",
                routeName: "data-g-enable-grouping",
                file: "dataGEnableGrouping"
            },
            {
                name: "data-g-enable-filtering",
                routeName: "data-g-enable-filtering",
                file: "dataGEnableFiltering"
            },
            {
                name: "data-g-enable-sorting",
                routeName: "data-g-enable-sorting",
                file: "dataGEnableSorting"
            },
            {
                name: "data-g-filter-member",
                routeName: "data-g-filter-member",
                file: "dataGFilterMember"
            },
            {
                name: "data-g-group-member",
                routeName: "data-g-group-member",
                file: "dataGGroupMember"
            },
            {
                name: "data-g-not-sized",
                routeName: "data-g-not-sized",
                file: "dataGNotSized"
            },
            {
                name: "data-g-resizable",
                routeName: "data-g-resizable",
                file: "dataGResizable"
            },
            {
                name: "data-g-sort-member",
                routeName: "data-g-sort-member",
                file: "dataGSortMember"
            },
            {
                name: "data-g-views",
                routeName: "data-g-views",
                file: "dataGViews"
            },
            {
                name: "data-g-width",
                routeName: "data-g-width",
                file: "dataGWidth"
            }
        ]
    }
];