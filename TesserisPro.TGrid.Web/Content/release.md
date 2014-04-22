# TGrid Releases
## 0.2.3
 * Added possibility for columns to don't have fixed size
 * Item provider now have 'AddCollection' method
 * Added onready handler, called when grid is loaded
 * Added possibility to enable and disable sorting, filtering and grouping for single column
 * Added method Clear to ArrayItemsProvider and IItemsProvider to delete all items in itemsProvider
 * Bug 251 - Cell border disappears after extending column
 * Bug 252 - Footer template: input of incorrect numbers leads to wrong page numbering
 * Bug 254 - IItemsProvider has wrong members names
 * Bug 255 - Gird was not auto-configured correctly
 * Bug 313 - Some properties do not work properly when being dynamically reconfigured
 * Bug 326 - Column resize doesn't work, if cell template contains a table, 
 * Bug 333 - Problem with column borders when grouping with Angular.
 * Bug 334 - Scrolling down after collapsing of top group in IE9
 * Bug 336 - Editing with cell template: can't input text to empty row
 * Bug 338 - Group collapsing mobile / Angular: group collapsed by click on group name only
 * Bug 341 - Dynamic Reconfiguration: data of deleted column

## 0.2.2
 * Added possibility to change grid options from view model (controller) thought binding.
 * Items provider allows to add items and notify grid to refresh.
 * Bug 222 - In demo 'Grouping with virtualization' key 'arrow down' doesn't work properly on next loaded page after applying grouping
 * Bug 228 - Mobile frame blinks before the loading demo page
 * Bug 229 - In demo 'virtual scrolling of 100000 rows' key 'arrow Up' doesn't work correct.
 * Bug 230 - Grid crashes if no <script> tag is inside div with binding
 * Bug 231 - If provider is bound on ko.observable grid fails
 * Bug 241 - There shouldn't be jQuery in Options.ts
 * Bug 243 - IE Paging: not working scroller
 * Bug 248 - Demo 'Paging with 100000 rows'. Redundant  class 'desktop' is added, every time when I choose any page

## 0.2.1 
 * IE9 support added
 * Add keyboard support
 * Bugfixing

## 0.1.2
 * Minor bugfixing
 * Nuget package created

## 0.1
 * Initial release all major functions are suported
 
