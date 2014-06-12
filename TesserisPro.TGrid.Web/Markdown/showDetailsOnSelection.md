####showDetailsOnSelection.

Enables or disables details on selection. If **rowClick** is defined, is set to *false*.

**Value:** *true* or *false*.

**Default value:** *false*.
    
To make details working on selection you should define html details template in TGrid description.

**Example:**

#####For Knockout
<!--Start the highlighter-->
<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, showDetailsOnSelection: true}">
	</div>
</pre>
#####
Example of grid with details settings and details template:

<pre class="brush: html">
	<div id="test-knockout" data-bind="tgrid: { provider: itemsProvider, showDetailsOnSelection: true}">
		  <script type="text/html">
			<column data-g-member="Name">
			</column>
		    <details>
                <div>
                    <div>This is a sample of row details </div>
                </div>
            </details>
        </script>
	</div>
</pre>

#####For Angular

<pre class="brush: html">
	<t-grid id="test-angular" provider="itemsProvider" showDetailsOnSelection="true">
	</t-grid>
</pre>
#####
Example of grid with details settings and details template, and one column:
<pre class="brush: html">
	<div ng-app="SampleModule"> 
        <div ng-controller="ctrl">
			<t-grid id="test-angular" provider="itemsProvider" showDetailsOnSelection="true">
				<script type="text/html">
					<column data-g-member="Name">
					</column>
					<details>
						<div>
						<div>This is a sample of table row details </div>
						</div>
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