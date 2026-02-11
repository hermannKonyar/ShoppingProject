using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    [Route("api/[controller]")]
    public class ErrorController : Controller
    {
        [HttpGet("not-found")]
        public IActionResult NotFoundError()
        {
            return NotFound(new ProblemDetails { Title = "Not Found" });
        }

        [HttpGet("unauthorized")]
        public IActionResult UnauthorizedError() // 401
        {
            return Unauthorized(new ProblemDetails { Title = "Unauthorized" });
        }

        [HttpGet("forbidden")]
        public IActionResult ForbiddenError()
        { // 403                
            return StatusCode(403, new ProblemDetails { Title = "Forbidden" });
        }

        [HttpGet("bad-request")]
        public IActionResult BadRequestError()
        { // 400
            return BadRequest(new ProblemDetails { Title = "Bad Request" });
        }

        [HttpGet("server-error")]
        public IActionResult ServerError()
        { // 500
            throw new Exception("This is a server error");
        }   

        [HttpGet("validation-error")]
        public IActionResult ValidationError()
        { // 422
            ModelState.AddModelError("Problem1", "This is first error");
            ModelState.AddModelError("Problem2", "This is second error");
            return ValidationProblem();
        }   
    }
}