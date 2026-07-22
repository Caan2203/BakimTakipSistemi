export const dashboardPdfOlustur = (data) => {
    const raporTarihi = new Date().toLocaleString("tr-TR");

    const raporData = {
        raporTarihi,
        toplamUrun: data.toplamUrun,
        bakimdakiUrun: data.aktifZimmet,
        toplamPersonel: data.personel,
        toplamBakim: data.toplamBakim,
        yaklasanBakim: data.bekleyenBakim
    };

    console.log("Yönetim Özeti Raporu:", raporData);
};