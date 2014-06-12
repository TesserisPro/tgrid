###data-g-member

Describes what property in data should be displayed in current column and element in items provider.
    
**Value:** item's  property name, which value will be used for this grid column.

**Default value:** there is no default value. 	

**Example:**
<!--Start the highlighter-->
<pre class="brush: html">
	<column data-g-member="Name"> </column>
</pre>
#####   
Javascript array of items, where every array element is javascript object with "Name" filed refferenced in column.

<!--Start the highlighter-->
<pre class="brush: html">
	var items = [
        { Name: "John", Surname: "Doe", Age: "33" }
        //... more items
	];
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>
