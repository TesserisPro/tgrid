using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using MarkdownDeep;

namespace TesserisPro.TGrid.Web.HttpHandlers
{
    public class MarkdownHandler : IHttpHandler
    {
        public bool IsReusable
        {
            get { return true; }
        }

        public void ProcessRequest(HttpContext context)
        {
            var lastSlashIndex = context.Request.Url.AbsolutePath.LastIndexOf('/');
            var fileName = context.Request.Url.AbsolutePath.Substring(lastSlashIndex + 1);
            var filePath = context.Server.MapPath(Path.Combine("Markdown",fileName));
            string markdownString = String.Empty;

            try
            {
                 markdownString = File.ReadAllText(filePath);
            }
            catch (FileNotFoundException exc)
            {

            }

            var markdownTransformer = new Markdown();
            string html = markdownTransformer.Transform(markdownString);

            context.Response.Write(html);
        }
    }
}