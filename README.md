# TGrid

*Grid for your HTML5 applications*

**Developed by [Tesseris Pro LLC](http://www.tesseris.com)**

TypeScript, Angular and Knockout compatible, fully customizable grid with rich functionality. 

TGrid can work on any device and any screen resolution. It dynamically adjusts content for screen and even changes the layout. TGrid grid supports any (really any) number of rows that can be loaded dynamically when user scrolls or selects page. 

[Project site](http://grid.tesseris.com) | [Demo page](http://grid.tesseris.com/Home/Demo)

### Supported browsers:

* Iternet Explorer 9+
* Mozilla Firefox 
* Google Chrome
* Safari
* iPhone/iPad
* Android 4+ 
* Windows Phone are supprorted.

## Features

* Knockout.js and Angular support.
* No dependcy on JQuery or any other libraries.
* Angular or Knockout.JS support are atteched as modules.
* Posibility to implement adapter for another technology.
* TypeScript compatible. TGrid is developed on TypeScript.
* Fully customizable. Header, Cell, Details, Footer are fully customizable with templates.
* Custom user actions support.
* Paging.
* Virtualization/lazy loading.
* Predefined set of item providers and possiblity to create custom provider. Custom item provider should only support sorting and filtering.
* Filtering, grouping and sorting.
* Grouping and group collapsing with virtualization and paging.
* Editing with cell template.
* Automatic swtich to mobile mode depending on @media.
* Fully customizable with CSS. No hardcoded styles.
* Free and open source.

## Usage

Please see all samples with code at [Demo page](http://grid.tesseris.com/Home/Demo)

**If this overview and demo page with code samples are not enogth, please submit an issue**

### Simple TGrid usage scenerio:

Grid rows in JavaScript:

    var items = [
        { Name: "John", Surname: "Doe", Age: "33" }
        //... more items
    ];

Simple knockout view model in JavaScript:

    function vm() {
        var self = this;
        self.nameColumnTitle = "First Name";
        self.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
    };
    
 Apply view-model binding (see [Knockout.js](http://knockoutjs.com/) for details):

    $(function () {
        ko.applyBindings(new vm());
    });

Grid marckup in HTML:

    <div data-bind="tgrid: {provider: itemsProvider}">
       <script type="text/html">  
           <column data-g-member="Name">  
           </column>  
           <column data-g-member="Surname">  
           </column>  
           <column data-g-member="Age">  
           </column>  
       </script>  
    </div>

### Custom templates:

Grid marckup with custom cell template:

    <div data-bind="tgrid: { provider: itemsProvider }">
         <script type="text/html">
             <column data-g-member="Name">
                 <cell>
                     <span style="color: red;" data-bind="text: item.Name"></span>               
                 </cell>
             </column>
             <column data-g-member="Surname">
                 <cell>
                     // Simple Knockout binding in template
                     <span data-bind="text: item.Surname"></span>
                 </cell>
             </column>
             <column data-g-member="Age">           
                 <cell>
                     <span style="color: red;" data-bind="text: item.Age"></span>
                 </cell>
             </column>
         </script>
     </div>

Grid cell is bound to following datacontext (TypeScript code):

    export class ItemViewModel {
        public model: any;
        public item: any;
        public grid: TGrid;
        public isGroupHeader: boolean;
    }

Editing with templates:

    <div data-bind="tgrid: { provider: itemsProvider }">
        <script type="text/html">
            <column data-g-member="name">
                <cell>
                    <span style="color: green;" data-bind="text: item.Name, event: { click: model.toggleActive }, css: { hidden: model.editingItem() == item }"></span>                                    
                    <input class="hidden" style="color: red;" data-bind="value: item.Name, css: { visible: model.editingItem() == item} "></input>                   
                </cell>
            </column>
            <column data-g-member="key">
                <cell>
                    <span data-bind="text: item.Surname, event: { click: model.toggleActive }, css: { hidden: model.editingItem() == item } "></span>
                    <input class="hidden" data-bind="value: item.Surname, css: { visible: model.editingItem() == item }"></input>
                </cell>
            </column>
            <column data-g-member="Age">           
                <cell>
                    <span style="color: red;" data-bind="text: item.Age, event: { click: model.toggleActive }, css: { hidden: model.editingItem() == item }"></span>
                    <input class="hidden" style="color: red;" data-bind="value: item.Age, css: { visible: model.editingItem() == item }"></input>
                </cell>
            </column>
        </script>
    </div>

See more at [Demo page](http://grid.tesseris.com/Home/Demo)
