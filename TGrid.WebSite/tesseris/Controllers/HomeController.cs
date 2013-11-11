using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TGrid.Demo.Controllers
{
    public class HomeController : Controller
    {
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
        [HttpPost]
        public ActionResult Code()
        {
            return PartialView("SimpleGridWithoutPagingHtml");
        }

    }
}
