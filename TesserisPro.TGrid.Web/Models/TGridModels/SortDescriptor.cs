using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TesserisPro.TGrid.Web.Models.TGridModels
{
    public class SortDescriptor
    {
        private string path;
        private bool acs;

        public SortDescriptor(string path, bool acs)
        {
            this.path = path;
            this.acs = acs;
        }

        public string Path
        {
            get
            {
                return this.path;
            }
        }

        public bool Acs
        {
            get 
            { 
                return this.acs; 
            }
        }
    }
}