# TGrid Releases
## next
 * Add optional itemProvider single method for items & itemsCount: getItemsAndTotalCount

## 0.2.5
 * Added 'rowclick' handler to customize row click action
 * Added possibility to hide grid header
 * Added documentation on site [Documentation page](http://grid.tesseris.com/Home/Documentation)
 * Replaced images by SVG base64 in CSS
 * Adding possibility to set column width in percent
 * Adding restriction for 'enableVirtualScroll'. 'Virtualization/LazyLoading' works only if items count is more, then 100.
 * Bug - Custom actions to open details Knockout: last row is opened with any actions
 * Bug - Second click on grouping button doesn't hide grouping menu,second click on mobile menu button doesn't hide mobile menu
 * Bug - Group collapsing is not enabled by works in Angular in mobile mode
 * Bug - If grouping and filtering is enabled,filter popup doesn't hide by clicking on the grouping button.
 * Bug - Grid settings with Grouping: resizing column leads to collapse first column (with group names)
 * Bug - Incorrect placement of filtering popup
 * Bug - Removing 'overflow: hidden' in some styles, transfering some styles 'overflow' from inline to css.
 * Bug - Wrong idea of 'path' displaying in filter popup template
 * Bug - Filter popup is cutted when grid is at the bottom of the page and has no items
 * Bug - Changing styles to '.tgrid-mobile-container .selected' doesn't have '!important' flag
 * Bug - Dynamic reconfiguration demo page: demo shouldn't show detail columns after deleting all columns
 * Bug - Fix capture scroll after dynamic reconfiguration
 * Bug - Virtual scroll with grouping doesn't works if rows height is less then grid max-height.
 * Bug - Dynamic reconfiguration of enablePaging doesn't work properly.
 * Bug - If option "ShowDetailsOnSelection" is set to false, all details, opened on custom action, can be closed by click on row
 * Bug - Column borders shifted a little bit, if resize column to get horizontal scroll and scroll to right.
 * Bug - If ServerItemProvider is used, there isn't '...' after last page of paging block on first load.

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
 
