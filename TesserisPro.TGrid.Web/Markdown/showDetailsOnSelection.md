####showDetailsOnSelection.

Enables or disables details on selection. If the **rowClick** setting is defined, it is set to *false*.

**Value:** *true* or *false*.

**Default value:** *false*.
    
To make details working on selection you should define an html details template in the TGrid description.

**Example:**

#####For Knockout
<!--Start the highlighter-->
<pre class="brush: html">
	<div data-bind="tgrid: { provider: itemsProvider, showDetailsOnSelection: true}">
	</div>
</pre>
#####
Example of the grid with details settings and a details template:

<pre class="brush: html">
	<div data-bind="tgrid: { provider: itemsProvider, showDetailsOnSelection: true}">
		  <script type="text/html">
			<column data-g-member="Name">
			</column>
		    <details>
                <div>This is a sample of row details </div>
            </details>
        </script>
	</div>
</pre>

#####For Angular

<pre class="brush: html">
	<t-grid id="test-angular" provider="dataProvider" showDetailsOnSelection="true">
	</t-grid>
</pre>
#####
Example of the grid with details settings,a details template and one column:
<pre class="brush: html">
	<div ng-app="SampleModule"> 
        <div ng-controller="ctrl">
			<t-grid id="test-angular" provider="dataProvider" showDetailsOnSelection="true">
				<script type="text/html">
					<column data-g-member="Name">
					</column>
					<details>
						<div>This is a sample of table row details </div>
					</details>
				</script>
			</t-grid>
		</div>
    </div>
</pre>

#####
<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>