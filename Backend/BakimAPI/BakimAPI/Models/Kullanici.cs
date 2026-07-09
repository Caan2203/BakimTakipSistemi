namespace BakimAPI.Models
{
    public class Kullanici
    {
        public int Id { get; set; }

        public string Ad { get; set; } = string.Empty;

        public string Soyad { get; set; } = string.Empty;

        public string KullaniciAdi { get; set; } = string.Empty;

        public string Eposta { get; set; } = string.Empty;

        public string Sifre { get; set; } = string.Empty;

        public string Rol { get; set; } = "Personel";

        public DateTime OlusturmaTarihi { get; set; } = DateTime.Now;
    }
}