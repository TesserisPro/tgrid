using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TGrid.Demo.Models;

namespace TGrid.Demo.Controllers
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
            listOfDemosDesktop.Add(new UIModel { title = "Simple grid without paging", url = "SimpleGridWithoutPaging", htmlUrl = "SimpleGridWithoutPagingHtml", cssUrl = "StyleCss", jsUrl = "scriptjs" });            
            listOfDemosDesktop.Add(new UIModel { title = "Cell template", url = "CellTemplate", htmlUrl = "SimpleGridWithoutPagingHtml", cssUrl = "StyleCss", jsUrl = "scriptjs" });            
            listOfDemosDesktop.Add(new UIModel { title = "Header template", url = "HeaderTemplate", htmlUrl = "SimpleGridWithoutPagingHtml", cssUrl = "StyleCss", jsUrl = "scriptjs" });            
            listOfDemosDesktop.Add(new UIModel { title = "Details template", url = "DetailsTemplate", htmlUrl = "SimpleGridWithoutPagingHtml", cssUrl = "StyleCss", jsUrl = "scriptjs" });            
            listOfDemosDesktop.Add(new UIModel { title = "Custom actions to open details", url = "CustomActionsToOpenDetails", htmlUrl = "SimpleGridWithoutPagingHtml", cssUrl = "StyleCss", jsUrl = "scriptjs" });
            listOfDemosDesktop.Add(new UIModel { title = "Paging", url = "Paging", htmlUrl = "SimpleGridWithoutPagingHtml", cssUrl = "StyleCss", jsUrl = "scriptjs" });
            listOfDemosDesktop.Add(new UIModel { title = "Virtualization/lazy loading", url = "lazyLoadingMobile", htmlUrl = "SimpleGridWithoutPagingHtml", cssUrl = "StyleCss", jsUrl = "scriptjs" }); 
            listOfDemosDesktop.Add(new UIModel { title = "Custom items provider", url = "CustomItemsProvider", htmlUrl = "SimpleGridWithoutPagingHtml", cssUrl = "StyleCss", jsUrl = "scriptjs" });
            listOfDemosDesktop.Add(new UIModel { title = "Grouping", url = "Grouping", htmlUrl = "SimpleGridWithoutPagingHtml", cssUrl = "StyleCss", jsUrl = "scriptjs" });
            listOfDemosDesktop.Add(new UIModel { title = "Grouping with virtualization", url = "GroupingWithVirtualization", htmlUrl = "SimpleGridWithoutPagingHtml", cssUrl = "StyleCss", jsUrl = "scriptjs" });
            listOfDemosDesktop.Add(new UIModel { title = "Editing with cell template", url = "EditingWithCellTemplate", htmlUrl = "SimpleGridWithoutPagingHtml", cssUrl = "StyleCss", jsUrl = "scriptjs" });
            listOfDemosDesktop.Add(new UIModel { title = "Performance - 100000 rows with virtualization", url = "RowsWithVirtualization", htmlUrl = "SimpleGridWithoutPagingHtml", cssUrl = "StyleCss", jsUrl = "scriptjs" });
            listOfDemosDesktop.Add(new UIModel { title = "Performance - 100000 rows with paging", url = "RowsWithPaging", htmlUrl = "SimpleGridWithoutPagingHtml", cssUrl = "StyleCss", jsUrl = "scriptjs" });

            List<UIModel> listOfDemosMobile = new List<UIModel>();
            listOfDemosMobile.Add(new UIModel { title = "Simple grid without paging mobile", url = "SimpleGridWithoutPagingMobile", htmlUrl = "SimpleGridWithoutPagingMobileHtml", cssUrl = "StyleCss", jsUrl = "scriptjs" });
            listOfDemosMobile.Add(new UIModel { title = "Cell template mobile", url = "CellTemplateMobile", htmlUrl = "SimpleGridWithoutPagingHtml", cssUrl = "StyleCss", jsUrl = "scriptjs" });
            listOfDemosMobile.Add(new UIModel { title = "Header template mobile", url = "HeaderTemplateMobile", htmlUrl = "SimpleGridWithoutPagingHtml", cssUrl = "StyleCss", jsUrl = "scriptjs" });
            listOfDemosMobile.Add(new UIModel { title = "Details template mobile", url = "DetailsTemplateMobile", htmlUrl = "SimpleGridWithoutPagingHtml", cssUrl = "StyleCss", jsUrl = "scriptjs" });
            listOfDemosMobile.Add(new UIModel { title = "Paging mobile", url = "PagingMobile", htmlUrl = "SimpleGridWithoutPagingHtml", cssUrl = "StyleCss", jsUrl = "scriptjs" });
            listOfDemosMobile.Add(new UIModel { title = "Virtualization/lazy loading mobile", url = "lazyLoadingMobile", htmlUrl = "SimpleGridWithoutPagingHtml", cssUrl = "StyleCss", jsUrl = "scriptjs" });
            listOfDemosMobile.Add(new UIModel { title = "Grouping mobile", url = "GroupingMobile", htmlUrl = "SimpleGridWithoutPagingHtml", cssUrl = "StyleCss", jsUrl = "scriptjs" });

            return Json(new { desktop = listOfDemosDesktop, mobile = listOfDemosMobile }, JsonRequestBehavior.AllowGet);
        }
    }
}
