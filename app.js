class Kisi {
    constructor(ad, soyad, mail) {
        this.ad = ad;
        this.soyad = soyad;
        this.mail = mail;
    }
}

class Util {
    static bosAlanKontrolEt(...alanlar) {
        let sonuc = true;
        alanlar.forEach(alan => {
            if (alan.length === 0) {
                sonuc = false;
                return false;
            }
        });

        return sonuc;
    }

    static emailGecerliMi(email) {
        const re =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    }
}


class Ekran {
    constructor() {
        this.ad = document.getElementById('ad');
        this.soyad = document.getElementById('soyad');
        this.mail = document.getElementById('mail');
        this.ekleGuncelleButon = document.querySelector('.kaydetGuncelle');        
        this.form = document.getElementById('form-rehber');
        this.form.addEventListener('submit', this.kaydetGuncelle.bind(this));
        this.kisiListesi = document.querySelector('.kisi-listesi');
        this.kisiListesi.addEventListener('click', this.guncelleVeyaSil);       
        this.depo = new Depo();
        this.secilenSatir = undefined;
        this.kisileriEkranaYazdir();
    }

    alanlariTemizle() {
        this.ad.value = '';
        this.soyad.value = '';
        this.mail.value = '';
    }
   
    guncelleVeyaSil(e) {
        const tiklanmaYeri = e.target;       
        if (tiklanmaYeri.classList.contains('btn--delete')) {
            this.secilenSatir = tiklanmaYeri.parentElement.parentElement;
            //console.log(this.secilenSatir);
            this.kisiyiEkrandanSil();
        }
        else if (tiklanmaYeri.classList.contains('btn--edit')) {            
            this.secilenSatir = tiklanmaYeri.parentElement.parentElement;           
            console.log(this.ekleGuncelleButon);            
            this.ekleGuncelleButon.value = 'Güncelle';
            this.ad.value = this.secilenSatir.cells[0].textContent;
            this.soyad.value = this.secilenSatir.cells[1].textContent;
            this.mail.value = this.secilenSatir.cells[2].textContent;

        }

    }

    kisiyiEkrandaGuncelle() {

        const sonuc=this.depo.kisiyiGuncelle(kisi,this.secilenSatir.cells[2].textContent);

        if(sonuc){
            this.secilenSatir.cells[0].textContent = kisi.ad;
            this.secilenSatir.cells[1].textContent = kisi.soyad;
            this.secilenSatir.cells[2].textContent = kisi.mail;
    
    
            this.alanlariTemizle();
            this.secilenSatir = undefined;
            this.ekleGuncelleButon.value = 'Kaydet';
            this.bilgiOlustur('Kisi güncellendi', true);
        }else{
            this.bilgiOlustur('Yazdığınız mail kullanımda',false);
        }       

       

        /*       const eskiKisi=new Kisi(this.secilenSatir.cells[0].textContent,this.secilenSatir.cells[1].textContent,this.secilenSatir.cells[2].textContent); */

        /* const guncellenmiskisi=new Kisi(this.ad.value,this.soyad.value,this.mail.value); */
    }

    kisiyiEkrandanSil() {
        this.secilenSatir.remove();
        const silinecekMail = this.secilenSatir.cells[2].textContent;

        this.depo.kisiSil(silinecekMail);
        this.alanlariTemizle();
        this.secilenSatir = undefined;
        this.bilgiOlustur('Kişi rehberden silindi', true);
    }

    kisileriEkranaYazdir() {
        this.depo.tumKisiler.forEach(kisi => {
            this.kisiyiEkranaEkle(kisi);
        });
    }

    kisiyiEkranaEkle(kisi) {
        const olusturulanTR = document.createElement('tr');
        olusturulanTR.innerHTML = `<td>${kisi.ad}</td>
        <td>${kisi.soyad}</td>
        <td>${kisi.mail}</td>
        <td>
            <button class="btn btn--edit"><i class="far fa-edit"></i></button>
            <button class="btn btn--delete"><i class="far fa-trash-alt"></i></button>
        </td>`;
        this.kisiListesi.appendChild(olusturulanTR);

    }


    bilgiOlustur(mesaj, durum) {
        const uyariDivi = document.querySelector('.bilgi');

        uyariDivi.innerHTML = mesaj;

        uyariDivi.classList.add(durum ? 'bilgi--success' : 'bilgi--error');


        /*         const olusturulanBilgi = document.createElement('div');
                olusturulanBilgi.textContent = mesaj;
                olusturulanBilgi.className = 'bilgi'; */
        /* if(durum)
        {
            olusturulanBilgi.classList.add('bilgi--success');
        }else{
            olusturulanBilgi.classList.add('bilgi--error');
        } */

        // olusturulanBilgi.classList.add(durum ? 'bilgi--success' : 'bilgi--error');

        // document.querySelector('.container').insertBefore(olusturulanBilgi, this.form);

        //setTimeOut-setInterval    

        setTimeout(function () {
            uyariDivi.className = 'bilgi';
        }, 2000)

    }

    kaydetGuncelle(e) {
        e.preventDefault();
        const kisi = new Kisi(this.ad.value, this.soyad.value, this.mail.value);
        const sonuc = Util.bosAlanKontrolEt(kisi.ad, kisi.soyad, kisi.mail);
        const emailGecerliMi = Util.emailGecerliMi(this.mail.value);
        console.log(this.mail.value + "için email kontrolü sonuc:" + emailGecerliMi);

        //tum alanlar doldurma
        if (sonuc) {
            if (!emailGecerliMi) {
                this.bilgiOlustur('Geçerli bir mail yazınız', false);
                return;
            }
            //yeni kisiyi ekrana ekler
            if (this.secilenSatir) {
                this.kisileriEkranaYazdir(kisi);
            } else {
                const sonuc=this.depo.kisiEkle(kisi);
                console.log("sonuc :"+sonuc+"kaydetgüncelle içinde");
                if(sonuc)
                {
                    this.bilgiOlustur('Basarıyla Eklendi', true);
                    this.kisiyiEkranaEkle(kisi);
                    this.alanlariTemizle();
                    //localstorage ekler 
                }else{
                    this.bilgiOlustur('Bu mail kullanımda',false);
                }
          
            }

           
        } else {
            this.bilgiOlustur('Boş alanları doldurunuz!', false);
        }
    }

}

class Depo {
    //uygulama ilk açıldığında veriler getirilir.
    constructor() {
        this.tumKisiler = this.kisileriGetir();
    }

    emailEssizmi(mail) {
        const sonuc = this.tumKisiler.find(kisi => {
            return kisi.mail === mail;
        });

        if (sonuc) {
            console.log(mail + " kullanımda");
            return false;
        }
        else {
            console.log(mail + " kullanımda değil ekleme güncelleme yapılabilir!");
        }
    }

    kisileriGetir() {
        let tumKisilerLocal;
        if (localStorage.getItem('tumKisiler') === null) {
            tumKisilerLocal = [];
        } else {
            tumKisilerLocal = JSON.parse(localStorage.getItem('tumKisiler'));
        }
        return tumKisilerLocal;

    }
    kisiEkle(kisi) {
        if (this.emailEssizmi(kisi.mail)) {
            this.tumKisiler.push(kisi);
            localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));
            return true;
        }else{
            return false;
        }

    }
    kisiSil(mail) {
        this.tumKisiler.forEach((kisi, index) => {
            if (kisi.mail === mail) {
                this.tumKisiler.splice(index, 1);
            }
        });
        localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));
    }
    kisiyiGuncelle(guncellenmisKisi, mail) {

        if(guncellenmisKisi.mail===mail){
            this.tumKisiler.forEach((kisi, index) => {
                if (kisi.mail === mail) {
                    this.tumKisiler[index] = guncellenmisKisi;
                    localStorage.setItem('tumKisiler', JSON.stringify(this.tumKisiler));
                    return true;
                }
            });
            return true;
        }

        if(this.emailEssizmi(guncellenmisKisi.mail))
        {
            console.log(guncellenmisKisi.mail+" için kontrol yapılıyor ve sonuc:güncelleme yapabilirsin!");

            
        }
        else{
            console.log(guncellenmisKisi.mail+" mail kullanımda güncelleme yapılamaz!");
            return false;
        }


        
    }
}

document.addEventListener('DOMContentLoaded', function (e) {
    const ekran = new Ekran();
});