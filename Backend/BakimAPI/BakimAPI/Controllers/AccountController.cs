using Microsoft.AspNetCore.Mvc;

namespace BakimAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        [HttpPost("change-password")]
        public IActionResult ChangePassword(ChangePasswordDto dto)
        {
            // Şimdilik demo
            if (dto.CurrentPassword != "1234")
            {
                return BadRequest(new
                {
                    message = "Mevcut şifre yanlış."
                });
            }

            return Ok(new
            {
                message = "Şifre başarıyla değiştirildi."
            });
        }
    }

    public class ChangePasswordDto
    {
        public string CurrentPassword { get; set; }

        public string NewPassword { get; set; }
    }
}