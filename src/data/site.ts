export const SITE = {
  name: 'Köklü Ata Kickboks',
  legalName: 'Köklü Ata Spor Kulübü',
  url: 'https://kokluatakickboks.com',
  phone: '+905427601388',
  phoneDisplay: '0542 760 13 88',
  email: 'tanerryilmaz97@gmail.com',
  instagram: 'https://www.instagram.com/kokluataspor/',
  maps: 'https://goo.gl/maps/y17bwBkiAAzugrG68',
  address: {
    street: 'Yeşilova Mah. 4032/5 Sk. No:7C',
    district: 'Bornova',
    city: 'İzmir',
    postal: '35100',
    country: 'TR',
  },
  geo: { lat: 38.4482, lng: 27.2094 },
  founded: 2017,
  rating: { value: 4.9, count: 80 },
  area: 250,
  whatsappText: 'Merhaba, kickboks dersleri hakkında bilgi almak istiyorum.',
};

export const whatsapp = (text = SITE.whatsappText) =>
  `https://wa.me/${SITE.phone.replace('+', '')}?text=${encodeURIComponent(text)}`;

export const NAV = [
  { href: '/kickboks-dersleri-bornova/', label: 'Dersler' },
  { href: '/antrenor/', label: 'Antrenör' },
  { href: '/salonumuz/', label: 'Salon' },
  { href: '/basarilarimiz/', label: 'Başarılar' },
  { href: '/iletisim/', label: 'İletişim' },
];

export const PROGRAMS = [
  {
    slug: 'kickboks-dersleri-bornova',
    title: 'Grup Kickboks',
    short: 'Genç ve yetişkin gruplarında haftada 2-4 seans. Teknik, kondisyon ve sparring.',
    img: '/img/grup-kickboks-dersleri.webp',
    tag: '12+ yaş',
  },
  {
    slug: 'ozel-kickboks-dersi',
    title: 'Özel Ders',
    short: 'Birebir antrenman. Hedefine göre program, sıfırdan ya da müsabaka hazırlığı.',
    img: '/img/birebir-1.webp',
    tag: 'Birebir',
  },
  {
    slug: 'functional-training-bornova',
    title: 'Functional Training',
    short: 'Vücut ağırlığı, kettlebell ve ip ile bütünsel güç ve dayanıklılık.',
    img: '/img/salonumuz-7.webp',
    tag: 'Kondisyon',
  },
  {
    slug: 'genc-kickboks',
    title: 'Genç Kickboks',
    short: '12-17 yaş için disiplin, özgüven ve lisanslı sporculuk yolu.',
    img: '/img/gururlarimiz-15.webp',
    tag: 'Gençler',
  },
  {
    slug: 'kadin-kickboks',
    title: 'Kadın Kickboks',
    short: 'Savunma, form ve stres atma odaklı kadın grupları.',
    img: '/img/gururlarimiz-3.webp',
    tag: 'Kadınlar',
  },
];

export const SCHEDULE = [
  { day: 'Pazartesi', slots: [{ time: '20:00 – 21:00', group: 'Kickboks Genç' }] },
  { day: 'Salı', slots: [{ time: '19:30 – 20:30', group: 'Kickboks Yetişkin' }] },
  { day: 'Çarşamba', slots: [{ time: '20:00 – 21:00', group: 'Kickboks Genç' }] },
  { day: 'Perşembe', slots: [{ time: '19:30 – 20:30', group: 'Kickboks Yetişkin' }] },
  { day: 'Cuma', slots: [] },
  { day: 'Cumartesi', slots: [] },
  { day: 'Pazar', slots: [] },
];

export const BENEFITS = [
  { icon: '/img/1-healthcare.png', title: 'Sağlık', text: 'Kalp-damar sistemini güçlendirir, dayanıklılığı artırır.' },
  { icon: '/img/2-strength.png', title: 'Güç', text: 'Kol, bacak, sırt ve karın kaslarını aynı anda çalıştırır.' },
  { icon: '/img/3-slim-body.png', title: 'Kilo', text: 'Seans başına 800-1000 kalori. En verimli yakım.' },
  { icon: '/img/4-fight.png', title: 'Savunma', text: 'Gerçek hayatta işe yarayan refleks ve teknik.' },
  { icon: '/img/5-reduce-stress.png', title: 'Stres', text: 'Torbaya vurmak kadar iyi gelen az şey var.' },
  { icon: '/img/6-selfconfident.png', title: 'Özgüven', text: 'Ringde kazandığın duruş, dışarıda da seninle.' },
];

export const REVIEWS = [
  { name: 'Veli & üye', text: 'Taner hocadan oğlum grup, ben birebir eğitim alıyorum. Çocuklarla iletişimi, motive edici yönü ve teknik bilgisini aktarabilmesi çok kıymetli. Her dakikası dolu dolu geçen bir antrenman temposu.', stars: 5 },
  { name: 'Üye', text: 'Beklediğimin kat kat fazlasını karşılayan; eğitmeninin ilgili olduğu, samimi, sıcak ve profesyonel bir ortam.', stars: 5 },
  { name: 'Üye', text: 'Dövüş eğitimimin ilk adımını atmamda bana çok yardımcı olmuş bir kulüp. Antrenmanların kalitesi bakımından tavsiye edebileceğim bir yer.', stars: 5 },
];

export const FAQ = [
  { q: 'Kaç yaşından itibaren başlanabilir?', a: 'Grup derslerimize 12 yaş ve üzeri katılabilir. Daha küçük yaşlar için kulübümüzün karate ve cimnastik branşları var.' },
  { q: 'Haftada kaç gün gelmeliyim?', a: 'Gelişim için haftada 2-3 seans öneriyoruz. Programı size uygun günlere göre birlikte belirliyoruz.' },
  { q: 'Ne getirmeliyim?', a: 'Şort, tişört, boks eldiveni ve el bandajı. İlk derste eldiven salondan verilir.' },
  { q: 'Deneme dersi var mı?', a: 'Evet. İlk dersi izleyebilir ya da katılabilirsiniz; WhatsApp\'tan yazmanız yeterli.' },
  { q: 'Hiç spor yapmadım, olur mu?', a: 'Herkes sıfırdan başlar. Gruplar seviyeye göre ayrılır, temposu size göre ayarlanır.' },
  { q: 'Otopark var mı?', a: 'Evet, salon önünde ücretsiz park alanı mevcut.' },
];
