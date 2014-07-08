## TGrid

*Grid for your HTML5 applications*

**Developed by [Tesseris Pro LLC](http://www.tesseris.com)**

TypeScript, Angular and Knockout compatible, fully customizable grid with rich functionality. 

TGrid can work on any device and any screen resolution. It dynamically adjusts content for screen and even changes the layout. TGrid grid supports any (really any) number of rows that can be loaded dynamically when user scrolls or selects page. 

### Supported browsers:

* Internet Explorer 9+
* Mozilla Firefox 
* Google Chrome
* Safari
* iPhone/iPad
* Android 4+ 
* Windows Phone are supporrted.

## Features

* Knockout.js and Angular support.
* No dependency on JQuery or any other libraries.
* Angular or Knockout.JS support are attached as modules.
* Possibility to implement adapter for another technology.
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

Please see all samples with code at [Demo page](http://grid.tesseris.com/Home/Demo).

**If this overview and demo page with code samples are not enougth, please submit an issue**.

### Simple TGrid usage scenario:

##### For Knockout

Grid rows in JavaScript:

<!-- Start the highlighter. -->
<pre class="brush: js">
    var items = [
        { Name: "John", Surname: "Doe", Age: "33" }
        //... more items
    ];
</pre>

#####

Simple **Knockout view model** in JavaScript:

<pre class="brush: js">
    function vm() {
        var self = this;
        self.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
    };
</pre>
 
#####   

 Apply view-model binding (see [Knockout.js](http://knockoutjs.com/) for details):

<pre class="brush: js">
    $(function () {
        ko.applyBindings(new vm());
    });
</pre>

#####

Grid markup in HTMLfor Knockout:

<pre class="brush: html">
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
</pre>

#####For Angular

Grid rows in JavaScript:

<pre class="brush: js">
    var items = [
        { Name: "John", Surname: "Doe", Age: "33" }
        //... more items
    ];
</pre>

#####

In **Angular** you define **main module** with controller, where dataProvider is intantiated.

<pre class="brush: js">
    var sampleModule = angular.module("SampleModule", ['TGrid'])
		 .controller("ctrl", function ctrl($scope) {
		 	$scope.dataProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
		 })
</pre>

#####

Grid markup in HTML for Angular:

<!-- Start the highlighter. -->
<pre class="brush: html">
    <div ng-app="SampleModule">
		<div ng-controller="ctrl">
			<t-grid id="test-angular" provider="dataProvider" enablePaging="true">
				<script type="text/html">
					<column data-g-member="Name">
					</column>
					<column data-g-member="Surname">
					</column>
					<column data-g-member="Age">
					</column>
				</script>
			</t-grid>
		</div>
	</div>
</pre>

### Custom templates:

Grid marckup with custom cell template:

##### For Knockout

<pre class="brush: html">
    <div data-bind="tgrid: { provider: itemsProvider }">
         <script type="text/html">
             <column data-g-member="Name">
                 <cell>
                     <span style="color: #b6424e;" data-bind="text: item.Name"></span>               
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
                     <span style="color: #b6424e;" data-bind="text: item.Age"></span>
                 </cell>
             </column>
         </script>
     </div>
</pre>

#####For Angular

<pre class="brush: html">
    <div ng-app="SampleModule"> 
        <div ng-controller="ctrl">
            <t-grid id="test-angular" provider="dataProvider">
                <script type="text/html">
                    <column data-g-member ="Name">
                        <cell>
                            <span style="color: #b6424e;">{{item.item.Name}}</span>
                        </cell>
                    </column>
                    <column data-g-member ="Surname">
                        <cell>
                            <span>{{item.item.Surname}}</span>
                        </cell>
                    </column>
                    <column data-g-member ="Age">
                        <cell>
                            <span style="color: #b6424e;">{{item.item.Age}}</span>
                        </cell>
                    </column>
                </script>
            </t-grid>
        </div>
    </div>
</pre>

#####

Grid cell is bound to following datacontext (TypeScript code):

<!-- Start the highlighter. -->
<pre class="brush: js">
    export class ItemViewModel {
        public model: any;
        public item: any;
        public grid: TGrid;
        public isGroupHeader: boolean;
    }
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>