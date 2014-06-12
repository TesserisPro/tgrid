
### Columns usage scenario:

First, you need  values for grid. For example, you have grid rows in JavaScript:

<!--Start the highlighter-->
<pre class="brush: js">
    var items = [
         { Name: "John", Surname: "Figgins", Age: "20", detail_Name: "First name:  John"},
         { Name: "Sharilyn", Surname: "Ham", Age: "52", detail_Name: "First name: Sharilyn"}
        //... more items
    ];
</pre>
#####
Simple columns markup in HTML:

<pre class="brush: html">
    <column data-g-member="Name">  
    </column>
    <column data-g-member="Surame">  
    </column>
    <column data-g-member="Age">  
    </column>
</pre>
#####

Result:

![Simple columns markup](../Content/images/imagesForDocs/columnGeneral.jpg)

### Custom templates:

Grid markup with custom **cell template**:

##### For Knockout
<pre class="brush: html">
    <column data-g-member="Name">
        <cell>
            <span style="color: red;" data-bind="text: item.Name"></span>               
        </cell>
    </column>
</pre>
##### For Angular
<pre class="brush: html">
    <column data-g-member="Name">
        <cell>
           <span style="color: red;">{{item.item.Name}}</span>             
        </cell>
    </column>
</pre>
#####
Column's 'Name' values will be red. 

Result:

![Cell template columns markup](../Content/images/imagesForDocs/columnCellTemplate.jpg)

Column **header template**. In header can be used binding or value, you can set custom style options:

##### For Knockout and for Angular
<pre class="brush: html">
    <column data-g-member="Name">
       <header>
            <span style="color: green;"> First Name</span>
        </header>
    </column>
</pre>
#####
Result:

![Header template columns markup](../Content/images/imagesForDocs/columnHeaderTemplate.jpg)

**Cell details template**. Code below shows how toggle details on click on grid cell.

##### For Knockout
<pre class="brush: html">
    <column data-g-member="Name">
        <cell>
            <span style="display: inline-block;" data-bind="text: item.Name">...</span>
            <a href data-bind="click: function () { toggleDetailsForCell(0); }, clickBubble: false">...</a>
        </cell>
        <celldetail>
            <div>
                <div>This is a sample of cell details: </div>
				<!--You can bind value from javascript items array. 
				detail_Name - is the property of item in items array.-->
                <div style="color: #444;" data-bind="text: item.detail_Name"></div>
            </div>
        </celldetail>
    </column>
</pre>
##### For Angular
<pre class="brush: html">
    <column data-g-member="Name">
        <cell>
			<span>{{item.item.Name}}</span>
			<a href ng-click="item.toggleDetailsForCell(0, item, items); $event.stopPropagation();">...</a> 
		</cell>
		<celldetail>
			<div>
				<div>This is a sample of cell details: </div>
				<div style="color: #444;">{{item.item.detail_Name}}</div>
			</div>
		</celldetail>
    </column>
</pre>
#####
Result:

![Cell template details columns markup](../Content/images/imagesForDocs/columnCellDetailsTemplate.jpg)

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>
