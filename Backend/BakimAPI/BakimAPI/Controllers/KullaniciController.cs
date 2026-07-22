using Microsoft.EntityFrameworkCore;
using BakimAPI.Data;
using BakimAPI.DTOs;
using BakimAPI.Models;
using Microsoft.AspNetCore.Mvc;
using BakimAPI.Servisler;

namespace BakimAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class KullaniciController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly TokenServisi _tokenServisi;

    public KullaniciController(
        ApplicationDbContext context,
        TokenServisi tokenServisi)
    {
        _context = context;
        _tokenServisi = tokenServisi;
    }

    [HttpPost("kayit")]
    public async Task<IActionResult> KayitOl(KayitOlDto dto)
    {
        if (await _context.Kullanicilar.AnyAsync(x => x.KullaniciAdi == dto.KullaniciAdi))
        {
            return BadRequest("Bu kullanıcı adı kullanılmaktadır.");
        }

        if (await _context.Kullanicilar.AnyAsync(x => x.Eposta == dto.Eposta))
        {
            return BadRequest("Bu e-posta adresi kullanılmaktadır.");
        }

        Kullanici kullanici = new Kullanici
        {
            Ad = dto.Ad,
            Soyad = dto.Soyad,
            KullaniciAdi = dto.KullaniciAdi,
            Eposta = dto.Eposta,
            Sifre = global::BCrypt.Net.BCrypt.HashPassword(dto.Sifre),
            Rol = "Personel",
            OlusturmaTarihi = DateTime.Now
        };

        _context.Kullanicilar.Add(kullanici);
        await _context.SaveChangesAsync();

        return Ok("Kullanıcı başarıyla oluşturuldu.");
    }

    [HttpPost("giris")]
    public async Task<IActionResult> GirisYap(GirisYapDto dto)
    {
        var kullanici = await _context.Kullanicilar
            .FirstOrDefaultAsync(x => x.KullaniciAdi == dto.KullaniciAdi);

        if (kullanici == null)
        {
            return BadRequest("Kullanıcı bulunamadı.");
        }

        bool sifreDogru = global::BCrypt.Net.BCrypt.Verify(dto.Sifre, kullanici.Sifre);

        if (!sifreDogru)
        {
            return BadRequest("Şifre hatalı.");
        }

        // Son giriş tarihini güncelle
        kullanici.LastLogin = DateTime.Now;
        await _context.SaveChangesAsync();

        string token = _tokenServisi.TokenOlustur(kullanici);

        return Ok(new
        {
            Mesaj = "Giriş başarılı.",
            Token = token,
            Kullanici = kullanici.KullaniciAdi,
            Rol = kullanici.Rol,
            Ad = kullanici.Ad,
            Soyad = kullanici.Soyad,
            LastLogin = kullanici.LastLogin
        });
    }
}