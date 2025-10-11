const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyBzq7_dcpD_nFFYgsaiBi29WhH3jXwl7BA",
    authDomain: "uxlab-d9fc2.firebaseapp.com",
    projectId: "uxlab-d9fc2",
    storageBucket: "uxlab-d9fc2.firebasestorage.app",
    messagingSenderId: "1053111628107",
    appId: "1:1053111628107:web:ec521731253306060c78ce",
    measurementId: "G-WJRP8BB4HC"
  };

const lawContent = {
  'hick': { title: "Hick's Law", shortDescription: "Waktu untuk mengambil keputusan bertambah seiring banyaknya dan rumitnya pilihan.", detailedDescription: "Hick's Law menyatakan bahwa waktu yang dibutuhkan untuk membuat keputusan meningkat secara logaritmik dengan jumlah pilihan yang tersedia. Semakin banyak opsi yang diberikan kepada user, semakin lama waktu yang dibutuhkan untuk memilih.", keyTakeaways: ["Batasi jumlah pilihan dalam menu utama (maksimal 7 item)","Gunakan progressive disclosure untuk menyembunyikan opsi lanjutan","Kelompokkan pilihan yang mirip untuk mengurangi cognitive load","Prioritaskan opsi yang paling sering digunakan"], images: [{src: "/hicks.webp",alt: "Contoh menu dengan banyak pilihan",description: "Menu dengan terlalu banyak pilihan dapat membingungkan user dan memperlambat pengambilan keputusan"}], examples: ["Menu restoran dengan 50+ item vs menu dengan kategori yang jelas","Form pendaftaran dengan 20 field vs form bertahap","Dashboard dengan 15 widget vs dashboard yang terorganisir"]},
  'fitts': { title: "Fitts's Law", shortDescription: "Waktu untuk mencapai target dipengaruhi oleh ukuran dan jaraknya.", detailedDescription: "Fitts's Law menjelaskan bahwa waktu yang dibutuhkan untuk bergerak ke target adalah fungsi dari jarak ke target dan ukuran target. Target yang lebih besar dan lebih dekat lebih mudah dicapai.", keyTakeaways: ["Buat tombol penting cukup besar untuk mudah diklik","Letakkan elemen penting di area yang mudah dijangkau","Manfaatkan edge screen untuk target yang sering digunakan","Pertimbangkan ukuran jari untuk desain mobile"], images: [{src: "/fitts.svg",alt: "Ilustrasi Fitts's Law",description: "Target besar dan dekat lebih mudah dicapai daripada target kecil dan jauh"}], examples: ["Tombol 'Submit' yang besar vs tombol kecil","Menu hamburger di pojok kiri atas (edge screen)","Tombol back di iOS yang memanfaatkan edge screen"]},
  'jakob': { title: "Jakob's Law", shortDescription: "User menyukai pola yang sudah familiar.", detailedDescription: "Jakob's Law menyatakan bahwa user menghabiskan sebagian besar waktu mereka di website lain. Oleh karena itu, mereka lebih menyukai interface yang mengikuti pola yang sudah familiar dan diharapkan.", keyTakeaways: ["Gunakan ikon standar yang sudah dikenal user","Letakkan elemen di posisi yang diharapkan","Ikuti konvensi platform (iOS vs Android)","Hindari desain yang terlalu kreatif untuk fungsi dasar"], images: [{src: "/UXLab.svg",alt: "Contoh ikon familiar",description: "Ikon standar seperti home, profile, dan settings lebih mudah dikenali user"}], examples: ["Ikon rumah untuk home, ikon gear untuk settings","Logo di kiri atas, menu di kanan atas","Tombol back di kiri atas untuk mobile"]},
  'miller': { title: "Miller's Law", shortDescription: "Short-term memory rata-rata 7±2 item.", detailedDescription: "Miller's Law didasarkan pada penelitian yang menunjukkan bahwa kapasitas short-term memory manusia terbatas pada 7±2 item. Ini berarti kita hanya bisa mengingat sekitar 5-9 item dalam waktu singkat.", keyTakeaways: ["Batasi menu utama maksimal 7 item","Gunakan chunking untuk mengelompokkan informasi","Berikan feedback visual untuk membantu mengingat","Hindari overload informasi dalam satu layar"], images: [{src: "/UXLab.svg",alt: "Contoh chunking informasi",description: "Mengelompokkan informasi dalam chunk yang mudah diingat"}], examples: ["Nomor telepon: 0812-3456-7890 (chunked) vs 081234567890","Menu dengan 5 kategori vs menu dengan 15 item","Form dengan section yang jelas vs form panjang"]},
  'proximity': { title: "Law of Proximity", shortDescription: "Elemen yang berdekatan dipersepsikan memiliki keterkaitan.", detailedDescription: "Law of Proximity menyatakan bahwa elemen visual yang berdekatan dipersepsikan sebagai satu kelompok atau memiliki hubungan. Ini adalah prinsip dasar dalam desain visual dan UX.", keyTakeaways: ["Gunakan whitespace untuk memisahkan kelompok yang berbeda","Letakkan elemen terkait berdekatan","Gunakan visual grouping untuk meningkatkan scanability","Pertimbangkan jarak dalam grid layout"], images: [{src: "/window.svg",alt: "Contoh grouping dengan proximity",description: "Elemen yang berdekatan terlihat sebagai satu kelompok"}], examples: ["Form dengan label dekat input field","Card design dengan elemen terkait berdekatan","Navigation menu dengan item terkait dalam grup"]},
  'peak-end': { title: "Peak-End Rule", shortDescription: "Pengalaman dinilai dari puncak emosional dan akhir.", detailedDescription: "Peak-End Rule menyatakan bahwa pengalaman dinilai berdasarkan puncak emosional (baik positif maupun negatif) dan bagaimana pengalaman berakhir, bukan rata-rata keseluruhan pengalaman.", keyTakeaways: ["Pastikan akhir pengalaman selalu positif","Ciptakan momen yang memorable","Minimalkan friction di tengah proses","Berikan feedback yang jelas di setiap langkah"], images: [{src: "/UXLab.svg",alt: "Grafik Peak-End Rule",description: "Pengalaman dinilai dari puncak dan akhir, bukan rata-rata"}], examples: ["Checkout process dengan konfirmasi yang menyenangkan","Onboarding dengan welcome message yang hangat","Error handling yang helpful dan tidak menyalahkan user"]},
  'serial-position': { title: "Serial Position Effect", shortDescription: "Item di awal dan akhir lebih mudah diingat.", detailedDescription: "Serial Position Effect menjelaskan bahwa item di posisi awal (primacy effect) dan akhir (recency effect) dalam sebuah daftar lebih mudah diingat daripada item di tengah.", keyTakeaways: ["Letakkan informasi penting di awal dan akhir list","Gunakan breadcrumb untuk navigasi","Highlight item terakhir yang diakses","Pertimbangkan urutan dalam menu dan form"], images: [{src: "/UXLab.svg",alt: "Contoh serial position effect",description: "Item pertama dan terakhir lebih mudah diingat"}], examples: ["Menu dengan item penting di awal dan akhir","Form dengan field penting di awal","Search results dengan item relevan di posisi awal"]},
  'similarity': { title: "Law of Similarity", shortDescription: "Elemen yang mirip dipersepsikan sebagai satu kelompok.", detailedDescription: "Law of Similarity menyatakan bahwa elemen visual yang memiliki karakteristik yang sama (warna, bentuk, ukuran, orientasi) akan dipersepsikan sebagai satu kelompok atau memiliki hubungan.", keyTakeaways: ["Gunakan warna konsisten untuk elemen yang terkait","Buat tombol dengan style yang sama untuk fungsi serupa","Gunakan typography yang konsisten untuk hierarki","Kelompokkan elemen dengan bentuk atau ukuran yang mirip"], images: [{src: "/UXLab.svg",alt: "Contoh law of similarity",description: "Elemen dengan warna dan bentuk yang sama terlihat sebagai satu kelompok"}], examples: ["Tombol dengan warna yang sama untuk fungsi serupa","Card design dengan style yang konsisten","Navigation menu dengan ikon yang seragam"]},
  'closure': { title: "Law of Closure", shortDescription: "Mata cenderung melengkapi bentuk yang tidak lengkap.", detailedDescription: "Law of Closure menjelaskan bahwa otak manusia cenderung melengkapi bentuk atau pola yang tidak lengkap untuk menciptakan gambaran yang utuh dan bermakna.", keyTakeaways: ["Gunakan bentuk yang tidak lengkap untuk menarik perhatian","Manfaatkan whitespace untuk menciptakan ilusi bentuk","Gunakan loading states yang menunjukkan progress","Buat desain yang memungkinkan user melengkapi pola"], images: [{src: "/UXLab.svg",alt: "Contoh law of closure",description: "Bentuk yang tidak lengkap membuat user ingin melengkapinya"}], examples: ["Loading spinner yang menunjukkan progress","Card design dengan border yang tidak lengkap","Icon yang menggunakan negative space"]},
  'continuity': { title: "Law of Continuity", shortDescription: "Mata mengikuti garis dan kurva yang halus.", detailedDescription: "Law of Continuity menyatakan bahwa mata manusia cenderung mengikuti garis dan kurva yang halus, dan mempersepsikan elemen yang berada dalam garis yang sama sebagai satu kelompok.", keyTakeaways: ["Gunakan garis untuk memandu mata user","Buat flow yang natural dalam layout","Gunakan alignment yang konsisten","Manfaatkan kurva untuk menciptakan flow yang halus"], images: [{src: "/UXLab.svg",alt: "Contoh law of continuity",description: "Garis dan kurva memandu mata user mengikuti alur yang diinginkan"}], examples: ["Timeline dengan garis yang menghubungkan event","Form dengan flow yang natural dari atas ke bawah","Carousel dengan indikator yang menunjukkan progress"]}
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function uploadLaws() {
  console.log('Memulai upload materi ke Firesto re...');
  const promises = Object.keys(lawContent).map(key => {
    const content = lawContent[key];
    const docRef = doc(db, 'laws', key);
    console.log(`Menyiapkan: ${content.title}`);
    return setDoc(docRef, content);
  });

  try {
    await Promise.all(promises);
    console.log('Berhasil! Semua materi telah diunggah ke Firestore.');
    process.exit(0);
  } catch (error) {
    console.error('Gagal mengunggah data:', error);
    process.exit(1);
  }
}

uploadLaws();