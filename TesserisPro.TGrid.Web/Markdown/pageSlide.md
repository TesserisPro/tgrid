####pageSlide

Sets how many pages should be visible (to the left and to the right from current) in a pager.

**Value:** a number from 1 to  the total pages count.

**Default value:** *1*.

**Example:**

#####For Knockout
<!--Start the highlighter-->
<pre class="brush: html">
	<div data-bind="tgrid: { provider: itemsProvider, enablePaging: true, pageSlide: 3}">
	</div>
</pre>

#####For Angular

<pre class="brush: html">
	<t-grid provider="dataProvider" enablePaging="true" pageSlide="3">
	</t-grid>
</pre>

#####

<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>
