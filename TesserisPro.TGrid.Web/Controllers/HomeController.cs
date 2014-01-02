using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TesserisPro.TGrid.Web.Models;

namespace TesserisPro.TGrid.Web
{
    public class HomeController : Controller
    {

        private static UIModel model = new UIModel();
        //
        // GET: /Home/

        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Demo(string demo)
        {
            if (String.IsNullOrEmpty(demo))
            {
                return View();
            }

            return View(demo);
        }

        public ActionResult Code(string code)
        {
            return PartialView(code);
        }

        public ActionResult Ui()
        {
            List<UIModel> listOfDemosDesktop = new List<UIModel>();
            listOfDemosDesktop.Add(new UIModel
            {
                title = "Simple grid without paging",
                url = "Knockout/SimpleGridWithoutPaging",
                htmlUrl = "Knockout/SimpleGridWithoutPagingHtml",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/scriptjs",
                angularUrl = "Angular/SimpleGridWithoutPaging",
                angularHtmlUrl = "Angular/SimpleGridWithoutPagingHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/scriptjs"
            });
            listOfDemosDesktop.Add(new UIModel
            {
                title = "Cell template",
                url = "Knockout/CellTemplate",
                htmlUrl = "Knockout/CellTemplateHtml",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/scriptjs",
                angularUrl = "Angular/CellTemplate",
                angularHtmlUrl = "Angular/CellTemplateHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/scriptjs"
            });
            listOfDemosDesktop.Add(new UIModel
            {
                title = "Header template",
                url = "Knockout/HeaderTemplate",
                htmlUrl = "Knockout/HeaderTemplateHtml",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/scriptjs",
                angularUrl = "Angular/HeaderTemplate",
                angularHtmlUrl = "Angular/HeaderTemplateHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/scriptjs"
            });
            listOfDemosDesktop.Add(new UIModel
            {
                title = "Details template",
                url = "Knockout/DetailsTemplate",
                htmlUrl = "Knockout/DetailsTemplateHtml",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/scriptjs",
                angularUrl = "Angular/DetailsTemplate",
                angularHtmlUrl = "Angular/DetailsTemplateHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/scriptjs"
            });
            listOfDemosDesktop.Add(new UIModel
            {
                title = "Custom actions to open details",
                url = "Knockout/CustomActionsToOpenDetails",
                htmlUrl = "Knockout/CustomActionsToOpenDetailsHtml",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/scriptjs",
                angularUrl = "Angular/CustomActionsToOpenDetails",
                angularHtmlUrl = "Angular/CustomActionsToOpenDetailsHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/scriptjs"
            });
            listOfDemosDesktop.Add(new UIModel
            {
                title = "Paging",
                url = "Knockout/Paging",
                htmlUrl = "Knockout/PagingHtml",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/scriptjs",
                angularUrl = "Angular/Paging",
                angularHtmlUrl = "Angular/PagingHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/scriptjs"
            });
            listOfDemosDesktop.Add(new UIModel
            {
                title = "Virtualization/lazy loading",
                url = "Knockout/lazyLoading",
                htmlUrl = "Knockout/lazyLoadingHtmlKnock",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/scriptjs",
                angularUrl = "Angular/lazyLoading",
                angularHtmlUrl = "Angular/lazyLoadingHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/scriptjs"
            });
            listOfDemosDesktop.Add(new UIModel
            {
                title = "Custom items provider",
                url = "Knockout/CustomItemsProvider",
                htmlUrl = "Knockout/CustomItemsProviderHtmlKnock",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/scriptjs",
                angularUrl = "Angular/CustomItemsProvider",
                angularHtmlUrl = "Angular/CustomItemsProviderHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/scriptjs"
            });
            listOfDemosDesktop.Add(new UIModel
            {
                title = "Filtering",
                url = "Knockout/Filtering",
                htmlUrl = "Knockout/FilteringHtml",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/scriptjs",
                angularUrl = "Angular/Filtering",
                angularHtmlUrl = "Angular/FilteringHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/scriptjs"
            });
            listOfDemosDesktop.Add(new UIModel
            {
                title = "Grouping",
                url = "Knockout/Grouping",
                htmlUrl = "Knockout/GroupingHtml",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/scriptjs",
                angularUrl = "Angular/Grouping",
                angularHtmlUrl = "Angular/GroupingHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/scriptjs"
            });
            listOfDemosDesktop.Add(new UIModel
            {
                title = "Filtering, grouping and sorting",
                url = "Knockout/FilteringGroupingSorting",
                htmlUrl = "Knockout/FilteringGroupingSortingHtml",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/scriptjs",
                angularUrl = "Angular/FilteringGroupingSorting",
                angularHtmlUrl = "Angular/FilteringGroupingSortingHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/scriptjs"
            });
            listOfDemosDesktop.Add(new UIModel
            {
                title = "Grouping with virtualization",
                url = "Knockout/GroupingWithVirtualization",
                htmlUrl = "Knockout/GroupingWithVirtualizationHtmlKnock",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/scriptjs",
                angularUrl = "Angular/GroupingWithVirtualization",
                angularHtmlUrl = "Angular/GroupingWithVirtualizationHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/scriptjs"
            });
            listOfDemosDesktop.Add(new UIModel
            {
                title = "Editing with cell template",
                url = "Knockout/EditingWithCellTemplate",
                htmlUrl = "Knockout/EditingWithCellTemplateHtml",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/jaEditingWithCellTemplateKnockout",
                angularUrl = "Angular/EditingWithCellTemplate",
                angularHtmlUrl = "Angular/EditingWithCellTemplateHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/jaEditingWithCellTemplateAngular"
            });
            listOfDemosDesktop.Add(new UIModel
            {
                title = "Virtual scrolling of 100000 rows",
                url = "Knockout/RowsWithVirtualization",
                htmlUrl = "Knockout/RowsWithVirtualizationHtml",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/Js100000RowsKnockout",
                angularUrl = "Angular/RowsWithVirtualization",
                angularHtmlUrl = "Angular/RowsWithVirtualizationHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/Js100000RowsAngular"
            });
            listOfDemosDesktop.Add(new UIModel
            {
                title = "Paging with 100000 rows",
                url = "Knockout/Performance100000RowsWithPaging",
                htmlUrl = "Knockout/Performance100000RowsWithPagingHtml",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/Js100000RowsKnockout",
                angularUrl = "Angular/Performance100000RowsWithPaging",
                angularHtmlUrl = "Angular/Performance100000RowsWithPagingHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/Js100000RowsAngular"
            });

            List<UIModel> listOfDemosMobile = new List<UIModel>();
            listOfDemosMobile.Add(new UIModel
            {
                title = "Simple grid without paging mobile",
                url = "Knockout/SimpleGridWithoutPagingMobile",
                htmlUrl = "Knockout/SimpleGridWithoutPagingMobileHtml",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/scriptjs",
                angularUrl = "Angular/SimpleGridWithoutPagingMobile",
                angularHtmlUrl = "Angular/SimpleGridWithoutPagingMobileHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/scriptjs"
            });
            listOfDemosMobile.Add(new UIModel
            {
                title = "Cell template mobile",
                url = "Knockout/CellTemplateMobile",
                htmlUrl = "Knockout/CellTemplateMobileHtml",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/scriptjs",
                angularUrl = "Angular/CellTemplateMobile",
                angularHtmlUrl = "Angular/CellTemplateMobileHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/scriptjs"
            });
            //listOfDemosMobile.Add(new UIModel { title = "Header template mobile", url = "HeaderTemplateMobile", htmlUrl = "SimpleGridWithoutPagingHtml", cssUrl = "Knockout/StyleCss", jsUrl = "Knockout/scriptjs" });
            listOfDemosMobile.Add(new UIModel
            {
                title = "Details template mobile",
                url = "Knockout/DetailsTemplateMobile",
                htmlUrl = "Knockout/DetailsTemplateMobileHtml",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/scriptjs",
                angularUrl = "Angular/DetailsTemplateMobile",
                angularHtmlUrl = "Angular/DetailsTemplateMobileHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/scriptjs"
            });
            listOfDemosMobile.Add(new UIModel
            {
                title = "Paging mobile",
                url = "Knockout/PagingMobile",
                htmlUrl = "Knockout/PagingMobileHtml",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/scriptjs",
                angularUrl = "Angular/PagingMobile",
                angularHtmlUrl = "Angular/PagingMobileHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/scriptjs"
            });
            listOfDemosMobile.Add(new UIModel
            {
                title = "Virtualization/lazy loading mobile",
                url = "Knockout/lazyLoadingMobile",
                htmlUrl = "Knockout/lazyLoadingMobileHtmlKnock",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/scriptjs",
                angularUrl = "Angular/lazyLoadingMobile",
                angularHtmlUrl = "Angular/lazyLoadingMobileHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/scriptjs"
            });
            listOfDemosMobile.Add(new UIModel
            {
                title = "Grouping mobile",
                url = "Knockout/GroupingMobile",
                htmlUrl = "Knockout/GroupingMobileHtml",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/scriptjs",
                angularUrl = "Angular/GroupingMobile",
                angularHtmlUrl = "Angular/GroupingMobileHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/scriptjs"
            });
            listOfDemosMobile.Add(new UIModel
            {
                title = "Filtering mobile",
                url = "Knockout/FilteringMobile",
                htmlUrl = "Knockout/FilteringMobileHtml",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/scriptjs",
                angularUrl = "Angular/FilteringMobile",
                angularHtmlUrl = "Angular/FilteringMobileHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/scriptjs"
            });
            listOfDemosMobile.Add(new UIModel
            {
                title = "Filtering, grouping and sorting mobile",
                url = "Knockout/FilteringGroupingSortingMobile",
                htmlUrl = "Knockout/FilteringGroupingSortingMobileHtml",
                cssUrl = "Knockout/StyleCss",
                jsUrl = "Knockout/scriptjs",
                angularUrl = "Angular/FilteringGroupingSortingMobile",
                angularHtmlUrl = "Angular/FilteringGroupingSortingMobileHtml",
                angularCssUrl = "Angular/StyleCss",
                angularJsUrl = "Angular/scriptjs"
            });

            return Json(new { desktop = listOfDemosDesktop, mobile = listOfDemosMobile }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult Purchase(string purchase)
        {
            if (String.IsNullOrEmpty(purchase))
            {
                return View();
            }

            return View(purchase);
        }
        public ActionResult Download(string download)
        {
            if (String.IsNullOrEmpty(download))
            {
                return View();
            }

            return View(download);
        }
    }
}
