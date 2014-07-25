###data-g-group-member

This property is used to define an item's property for grouping. 

**Value:** Defines an item's property name, which value will be used for grouping in the grid.

**Default value:** property **data-g-member**.
		
**Example**:
<!--Start the highlighter-->
<pre class="brush: html">
	<column data-g-member="Age" data-g-group-member = "AgeGroup"> </column>
</pre>
#####

JavaScript array of items.
<pre class="brush: js">
	var items = [
        { Name: "John", Surname: "Doe", Age: "33 years 6 month", AgeGroup: "33" }
		{ Name: "Angela", Surname: "Smith", Age: "33 years 3 month", AgeGroup: "33" }
        //... more items
	];
</pre>
#####
<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>