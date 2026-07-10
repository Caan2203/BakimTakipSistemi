using BakimAPI.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace BakimAPI.Servisler
{
    public class TokenServisi
    {
        private readonly IConfiguration _configuration;

        public TokenServisi(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string TokenOlustur(Kullanici kullanici)
        {
            var anahtar = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Anahtar"]!)
            );

            var kimlikBilgileri = new[]
            {
                new Claim(ClaimTypes.Name, kullanici.KullaniciAdi),
                new Claim(ClaimTypes.Role, kullanici.Rol),
                new Claim("KullaniciId", kullanici.Id.ToString())
            };

            var kimlik = new SigningCredentials(
                anahtar,
                SecurityAlgorithms.HmacSha256
            );

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Veren"],
                audience: _configuration["Jwt:HedefKitle"],
                claims: kimlikBilgileri,
                expires: DateTime.Now.AddHours(8),
                signingCredentials: kimlik
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}