using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TesserisPro.TGrid.Web.Models.TGridModels
{
    public class Item
    {
        public int? Number { get; private set; }
        public string Brand { get; private set; }
        public string Type { get; private set; }
        public int? Year { get; private set; }
        public int? EnginePower { get; private set; }
        public string Cabin { get; private set; }
        public string PictureName { get; private set; }
        public Dictionary<string, string> collapsedValue { get; set; }

        public Item(int number, string brand, string type, int year, int enginePower, string cabin, string pictureName)
        {
            this.Number = number;
            this.Brand = brand;
            this.Type = type;
            this.Year = year;
            this.EnginePower = enginePower;
            this.Cabin = cabin;
            this.PictureName = pictureName;
        }

        public Item()
        {
            this.Number = null;
            this.Brand = String.Empty;
            this.Type = String.Empty;
            this.Year = null;
            this.EnginePower = null;
            this.Cabin = String.Empty;
            this.PictureName = String.Empty;
        }
    }
}