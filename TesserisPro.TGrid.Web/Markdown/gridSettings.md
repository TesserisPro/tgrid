##TGrid settings

Grid settings are defined in a TGrid template, implemented in a knockout binding or in an angular directive 't-grid'.
Some of TGrid settings have default values and this is not required to define them in the template. One required setting is **provider**.

#####For Knockout
<!--Start the highlighter-->
<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider}">
	</div>
</pre>

#####For Angular

<pre class="brush: html">
	<t-grid id="test-angular" provider="itemsProvider">
	</t-grid>
</pre>

#####

The value of *provider* should be defined in the view model in Knockout and in the controller in Angular.

A simple **Knockout view model** in JavaScript:

<pre class="brush: js">
    function vm() {
        var self = this;
        self.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
    };
</pre>
#####
In **Angular** you define a **main module** with a controller, where a dataProvider is instantiated.

<pre class="brush: js">
    var sampleModule = angular.module("SampleModule", ['TGrid'])
		 .controller("ctrl", function ctrl($scope) {
		 	$scope.itemsProvider = new TesserisPro.TGrid.ArrayItemsProvider(items);
		 })
</pre>
#####
The *items* is an array in JavaScript:

<pre class="brush: js">
    var items = [
        { Name: "John", Surname: "Doe", Age: "33" }
        //... more items
    ];
</pre>
#####

The TGrid template with many grid settings:

#####For Knockout
<!--Start the highlighter-->
<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, enableFiltering: true }">
	</div>
</pre>

#####For Angular

<pre class="brush: html">
	<t-grid id="test-angular" provider="itemsProvider" enablefiltering ="true" enablesorting ="true">
	</t-grid>
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>

