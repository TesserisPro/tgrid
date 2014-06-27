####rowClick

Sets a row click handler function name, which can be used in your sample view model to set your action on a row click. 
The handler function has 2 parameters: an *item* and an *event*. 
The *item* is an element of your itemsProvider array, binded to the clicked row. 
The *event* is a mouse event click.

If the **rowClick** setting is defined, then the **selectionMode** setting is set to 'none' and the **showDetailsOnSelection** setting is set to 'false'.

**Value:** a string.

**Default value:** null.

[rowClick in Grid Settings](#!/GridSettings/rowClick)

Example of a dynamic change the **rowClick** grid setting:

#####For Knockout
In HTML you should define an **options** setting:

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
In Javascript in a knockout view model you should have an observable variable with a name that equals the **options** value. 
You can change the grid options dynamically after the grid loading. In the example below the grid setting **rowClick**
can be changed using the function 'rowClick'.

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
In HTML you should define an **options** setting:
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
In Javascript in an angular controller you should have a variable with a name that equals the **options** value. 
You can change the grid options dynamically after the grid loading. In the example below the grid setting **rowClick**
can be changed using the function 'rowClick'.

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