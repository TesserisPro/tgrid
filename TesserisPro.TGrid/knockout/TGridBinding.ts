//=====================================================================================
//
// The Tesseris Free License
//
// Copyright(c) 2014 Tesseris Pro LLC
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this 
// software and associated documentation files(the "Software"), to deal in the Software 
// without restriction, including without limitation the rights to use, copy, modify,
// merge, publish, distribute, sublicense, and / or sell copies of the Software, and to 
// permit persons to whom the Software is furnished to do so, subject to the following
// conditions:
  
// 1. The above copyright notice and this permission notice shall be included in all 
//    copies or substantial portions of the Software.
//
// 2. Any software that fully or partially contains or uses materials covered by 
//    this license shall notify users about this notice and above copyright.The 
//    notification can be made in "About box" and / or site main web - page footer.The 
//    notification shall contain name of Tesseris Pro company and name of the Software 
//    covered by current license.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
// PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//
//=====================================================================================


/// <reference path="../Scripts/typings/knockout/knockout.d.ts" />
/// <reference path="../Scripts/typings/knockout.mapping/knockout.mapping.d.ts" />
/// <reference path="../Scripts/typings/extenders.d.ts" />
/// <reference path="../TGrid.ts" />
/// <reference path="../SortDescriptor.ts" />


class TGridBindingHandler implements KnockoutBindingHandler  {
 
    public init(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext): void {
        var options = TGridBindingHandler.getOptions(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
        // Create grid after all other bindings are ready
        setTimeout(function () { var grid = new TesserisPro.TGrid.Grid(element, options, valueAccessor().provider); }, 1);
    }

    public update(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext): void {
        
        var grid = TesserisPro.TGrid.Grid.getGridObject(element);

        if (grid != null) {
            var options = TGridBindingHandler.getOptions(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext); 
            grid.options = options;
            grid.updateBody();
        }
    }

    public static getOptions(element: HTMLElement, valueAccessor: () => any, allBindingsAccessor: () => any, viewModel: any, bindingContext: KnockoutBindingContext): TesserisPro.TGrid.Options {
        var options = new TesserisPro.TGrid.Options(element, TesserisPro.TGrid.Framework.Knockout);
        
        options.parentViewModel = viewModel;       

        var groupBySortDescriptor = "";
        if (isObservable(valueAccessor().groupBy)) {
            groupBySortDescriptor = valueAccessor().groupBy();
        } else {
            groupBySortDescriptor = valueAccessor().groupBy;
        }
        if (groupBySortDescriptor != undefined) {
            for (var i = 0; i < groupBySortDescriptor.length; i++) {
                options.groupBySortDescriptors.push(new TesserisPro.TGrid.SortDescriptor(groupBySortDescriptor[i], true));
            }
        }
        if (isObservable(valueAccessor().enablePaging)) {
            if (typeof valueAccessor().enablePaging() == "boolean") {
                options.enablePaging = valueAccessor().enablePaging();
            } else {
                options.enablePaging = valueAccessor().enablePaging == "true" ? true : false;
            }
        } else {
            if (typeof valueAccessor().enablePaging == "boolean") {
                options.enablePaging = valueAccessor().enablePaging;
            } else {
                options.enablePaging = valueAccessor().enablePaging == "true" ? true : false;
            }
        }

        if (isObservable(valueAccessor().pageSize)) {
            options.pageSize = valueAccessor().pageSize();
        } else {
            options.pageSize = valueAccessor().pageSize;
        }
        options.pageSize = (isNaN(options.pageSize) || options.pageSize < 1 ) ? 10 : options.pageSize;

        if (isObservable(valueAccessor().selectMode)) {
            options.selectionMode = valueAccessor().selectMode();
        } else {
            options.selectionMode = valueAccessor().selectMode;
        }
        if (isNaN(options.selectionMode)) {
            options.selectionMode = 1;
        }                
        
        if (isObservable(valueAccessor().enableVirtualScroll)) {
            if (typeof valueAccessor().enableVirtualScroll() == "boolean") {
                options.enableVirtualScroll = valueAccessor().enableVirtualScroll();
            } else {
                options.enableVirtualScroll = valueAccessor().enableVirtualScroll == "true" ? true : false;
            }
        } else {
            if (typeof valueAccessor().enableVirtualScroll == "boolean") {
                options.enableVirtualScroll = valueAccessor().enableVirtualScroll;
            } else {
                options.enableVirtualScroll = valueAccessor().enableVirtualScroll == "true" ? true : false;
            }
        }

        if (isObservable(valueAccessor().enableCollapsing)) {
            if (typeof valueAccessor().enableCollapsing() == "boolean") {
                options.enableCollapsing = valueAccessor().enableCollapsing();
            } else {
                options.enableCollapsing = valueAccessor().enableCollapsing == "true" ? true : false;
            }
        } else {
            if (typeof valueAccessor().enableCollapsing == "boolean") {
                options.enableCollapsing = valueAccessor().enableCollapsing;
            } else {
                options.enableCollapsing = valueAccessor().enableCollapsing == "true" ? true : false;
            }
        }

        if (isObservable(valueAccessor().showDetailsOnSelection)) {
            if (typeof valueAccessor().showDetailsOnSelection() == "boolean") {
                options.openDetailsOnSelection = valueAccessor().showDetailsOnSelection();
            } else {
                options.openDetailsOnSelection = valueAccessor().showDetailsOnSelection == "true" ? true : false;
            }
        } else {
            if (typeof valueAccessor().showDetailsOnSelection == "boolean") {
                options.openDetailsOnSelection = valueAccessor().showDetailsOnSelection;
            } else {
                options.openDetailsOnSelection = valueAccessor().showDetailsOnSelection == "true" ? true : false;
            }
        }

        var selectionMode = isObservable(valueAccessor().selectionMode) ? valueAccessor().selectionMode() : valueAccessor().selectionMode;
        if (selectionMode == "multi") {
            options.selectionMode = TesserisPro.TGrid.SelectionMode.Multi;
        }

        if (selectionMode == "single") {
            options.selectionMode = TesserisPro.TGrid.SelectionMode.Single;
        }

        if (selectionMode == "none") {
            options.selectionMode = TesserisPro.TGrid.SelectionMode.None;
        }

        if (isObservable(valueAccessor().enableSorting)) {
            if (typeof valueAccessor().enableSorting() == "boolean") {
                options.enableSorting = valueAccessor().enableSorting();
            } else {
                options.enableSorting = valueAccessor().enableSorting == "true" ? true : false;
            }
        } else {
            if (typeof valueAccessor().enableSorting == "boolean") {
                options.enableSorting = valueAccessor().enableSorting;
            } else {
                options.enableSorting = valueAccessor().enableSorting == "true" ? true : false;
            }
        }

        if (isObservable(valueAccessor().enableGrouping)) {
            if (typeof valueAccessor().enableGrouping() == "boolean") {
                options.enableGrouping = valueAccessor().enableGrouping();
            } else {
                options.enableGrouping = valueAccessor().enableGrouping == "true" ? true : false;
            }
        } else {
            if (typeof valueAccessor().enableGrouping == "boolean") {
                options.enableGrouping = valueAccessor().enableGrouping;
            } else {
                options.enableGrouping = valueAccessor().enableGrouping == "true" ? true : false;
            }
        }    

        if (isObservable(valueAccessor().enableFiltering)) {
            if (typeof valueAccessor().enableFiltering() == "boolean") {
                options.enableFiltering = valueAccessor().enableFiltering();
            } else {
                options.enableFiltering = valueAccessor().enableFiltering == "true" ? true : false;
            }
        } else {
            if (typeof valueAccessor().enableFiltering == "boolean") {
                options.enableFiltering = valueAccessor().enableFiltering;
            } else {
                options.enableFiltering = valueAccessor().enableFiltering == "true" ? true : false;
            }
        }

        if (isObservable(valueAccessor().pageSlide)) {
            options.pageSlide = valueAccessor().pageSlide();
        } else {
            options.pageSlide = valueAccessor().pageSlide;
        }
        options.pageSlide = (isNaN(options.pageSlide) || options.pageSlide < 1) ? 1 : options.pageSlide;

        return options;
    }    
}

ko.bindingHandlers.tgrid = new TGridBindingHandler();