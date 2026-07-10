namespace BakimAPI.DTOs
{
    public class KayitOlDto
    {
        public string Ad { get; set; } = string.Empty;

        public string Soyad { get; set; } = string.Empty;

        public string KullaniciAdi { get; set; } = string.Empty;

        public string Eposta { get; set; } = string.Empty;

        public string Sifre { get; set; } = string.Empty;

        public string Rol { get; set; } = "Kullanici";
    }
}