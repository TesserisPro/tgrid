using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Web.Mvc;
using System.Web.Security;

namespace TGrid.Demo.Models
{
    public class UIModel
    {
        public string title { set; get; }
        public string url { set; get; }
        public string htmlUrl { set; get; }
        public string cssUrl { set; get; }
        public string jsUrl { set; get; }
    }
}
