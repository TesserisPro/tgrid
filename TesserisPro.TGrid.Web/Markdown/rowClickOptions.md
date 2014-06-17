####rowClick

Sets row click handler function name, which can be used in your sample view model to set your action on row click. Handler function has 2 parameters: *item* and *event*. *Item* is an element of your itemsProvider array, binded to clicked row. *Event* is mouse event click.

If **rowClick** is defined, then **selectionMode** is set to 'none' and **showDetailsOnSelection** is set to 'false'.

**Value:** any string.

**Default value:** null.

[rowClick in Grid Settings](#!/GridSettings/rowClick)

Example of dynamic change **rowClick** grid setting:

#####For Knockout
In HTML you should define **options** setting:

<pre class="brush: html">
	<input type="button" value="Set Row Click" data-bind="click: rowClick" />
    <div data-bind="tgrid: { provider: itemsProvider, options: gridOptions}">
        <script type="text/html">
            <column data-g-member="Name">
            </column>
        </script>
    </div>
</pre>
#####
In Javascript in knockout view model you should have observable variable with name equals **options** value. 
You can change grid options dynamically after grid loading. In example below grid setting **rowClick**
can be changed using function 'rowClick'.

<pre class="brush: js">
 function vm() {
    var self = this;
    self.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
    self.gridOptions = ko.observable();

    self.rowClick = function () {
        self.gridOptions().rowClick = "sayHello";
        self.gridOptions().applyHandler();
    }
    self.sayHello = function (item, event) {
        alert("Hello " + item.Name);
    }
}
</pre>

#####For Angular
In HTML you should define **options** setting:
<pre class="brush: html">
<div ng-app="SampleModule">
  <div ng-controller="ctrl">
	<input type="button" value="Set Row Click" ng-click="rowClick();"/>
	<t-grid id="test-angular" provider="dataProvider" options="gridOptions">
		<script type="text/html">
            <column  data-g-member="Name"> 
            </column>
		</script>
	</t-grid>
  </div>
</div>
</pre>
#####
In Javascript in angular controller you should have variable with name equals **options** value. 
You can change grid options dynamically after grid loading. In example below grid setting **rowClick**
can be changed using function 'rowClick'.

<pre class="brush:js">
 var sampleModule = angular.module("SampleModule", ['TGrid'])
    .controller("ctrl", function ctrl($scope) {
        $scope.dataProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
        $scope.gridOptions;
		$scope.rowClick = function () {
            $scope.gridOptions.rowClick = "sayHello";
            $scope.gridOptions.applyHandler();
		}
		$scope.sayHello = function(item, event){
			alert("Hello " + item.Name);
		}
	})
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>