using System;
using System.IO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous]
    public class FallbackController : Controller
    {
        public IActionResult Index()
        {
            Console.WriteLine("docker run --name dev -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=P@$$w0rd -p 5432:5432 -d postgres:latest");
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"), "text/html");
        }
    }
}