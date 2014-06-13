### Options Columns

options.columns is type of TesserisPro.TGrid.ColumnInfo[]
Class TesserisPro.TGrid.ColumnInfo:
<!--Start the highlighter-->
<pre class="brush:js">
class ColumnInfo {
    public header: Template;
    public cell: Template;
    public cellDetail: Template;
    public width: string;
    public device: string;
    public sortMemberPath: string;
    public groupMemberPath: string;
    public member: string;
    public resizable: boolean;
    public filterMemberPath: string;
    public notSized: boolean;
    public enableFiltering: boolean;
    public enableSorting: boolean;
    public enableGrouping: boolean;
}
</pre>
class TesserisPro.TGrid.Template:

<pre class="brush:js">
class Template {
    private content;
    constructor(prototype: HTMLElement);
    public applyTemplate(element: HTMLElement): void;
    public getContent(): string;
}
</pre>
<script type="text/javascript">
    SyntaxHighlighter.highlight();
</script>