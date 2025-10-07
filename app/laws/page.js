"use client";
import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../../lib/AuthContext';
import { 
  saveUserProgress, 
  getUserProgress, 
  saveSimulationResult, 
  getUserStats 
} from '../../lib/firestore';

// placeholder
const lawContent = {
  'hick': {
    title: "Hick's Law",
    shortDescription: "Waktu untuk mengambil keputusan bertambah seiring banyaknya dan rumitnya pilihan.",
    detailedDescription: "Hick's Law menyatakan bahwa waktu yang dibutuhkan untuk membuat keputusan meningkat secara logaritmik dengan jumlah pilihan yang tersedia. Semakin banyak opsi yang diberikan kepada user, semakin lama waktu yang dibutuhkan untuk memilih.",
    keyTakeaways: [
      "Batasi jumlah pilihan dalam menu utama (maksimal 7 item)",
      "Gunakan progressive disclosure untuk menyembunyikan opsi lanjutan",
      "Kelompokkan pilihan yang mirip untuk mengurangi cognitive load",
      "Prioritaskan opsi yang paling sering digunakan"
    ],
    images: [
      {
        src: "/hicks.webp",
        alt: "Contoh menu dengan banyak pilihan",
        description: "Menu dengan terlalu banyak pilihan dapat membingungkan user dan memperlambat pengambilan keputusan"
      }
    ],
    examples: [
      "Menu restoran dengan 50+ item vs menu dengan kategori yang jelas",
      "Form pendaftaran dengan 20 field vs form bertahap",
      "Dashboard dengan 15 widget vs dashboard yang terorganisir"
    ]
  },
  'fitts': {
    title: "Fitts's Law",
    shortDescription: "Waktu untuk mencapai target dipengaruhi oleh ukuran dan jaraknya.",
    detailedDescription: "Fitts's Law menjelaskan bahwa waktu yang dibutuhkan untuk bergerak ke target adalah fungsi dari jarak ke target dan ukuran target. Target yang lebih besar dan lebih dekat lebih mudah dicapai.",
    keyTakeaways: [
      "Buat tombol penting cukup besar untuk mudah diklik",
      "Letakkan elemen penting di area yang mudah dijangkau",
      "Manfaatkan edge screen untuk target yang sering digunakan",
      "Pertimbangkan ukuran jari untuk desain mobile"
    ],
    images: [
      {
        src: "/fitts.svg",
        alt: "Ilustrasi Fitts's Law",
        description: "Target besar dan dekat lebih mudah dicapai daripada target kecil dan jauh"
      }
    ],
    examples: [
      "Tombol 'Submit' yang besar vs tombol kecil",
      "Menu hamburger di pojok kiri atas (edge screen)",
      "Tombol back di iOS yang memanfaatkan edge screen"
    ]
  },
  'jakob': {
    title: "Jakob's Law",
    shortDescription: "User menyukai pola yang sudah familiar.",
    detailedDescription: "Jakob's Law menyatakan bahwa user menghabiskan sebagian besar waktu mereka di website lain. Oleh karena itu, mereka lebih menyukai interface yang mengikuti pola yang sudah familiar dan diharapkan.",
    keyTakeaways: [
      "Gunakan ikon standar yang sudah dikenal user",
      "Letakkan elemen di posisi yang diharapkan",
      "Ikuti konvensi platform (iOS vs Android)",
      "Hindari desain yang terlalu kreatif untuk fungsi dasar"
    ],
    images: [
      {
        src: "/UXLab.svg",
        alt: "Contoh ikon familiar",
        description: "Ikon standar seperti home, profile, dan settings lebih mudah dikenali user"
      }
    ],
    examples: [
      "Ikon rumah untuk home, ikon gear untuk settings",
      "Logo di kiri atas, menu di kanan atas",
      "Tombol back di kiri atas untuk mobile"
    ]
  },
  'miller': {
    title: "Miller's Law",
    shortDescription: "Short-term memory rata-rata 7±2 item.",
    detailedDescription: "Miller's Law didasarkan pada penelitian yang menunjukkan bahwa kapasitas short-term memory manusia terbatas pada 7±2 item. Ini berarti kita hanya bisa mengingat sekitar 5-9 item dalam waktu singkat.",
    keyTakeaways: [
      "Batasi menu utama maksimal 7 item",
      "Gunakan chunking untuk mengelompokkan informasi",
      "Berikan feedback visual untuk membantu mengingat",
      "Hindari overload informasi dalam satu layar"
    ],
    images: [
      {
        src: "/UXLab.svg",
        alt: "Contoh chunking informasi",
        description: "Mengelompokkan informasi dalam chunk yang mudah diingat"
      }
    ],
    examples: [
      "Nomor telepon: 0812-3456-7890 (chunked) vs 081234567890",
      "Menu dengan 5 kategori vs menu dengan 15 item",
      "Form dengan section yang jelas vs form panjang"
    ]
  },
  'proximity': {
    title: "Law of Proximity",
    shortDescription: "Elemen yang berdekatan dipersepsikan memiliki keterkaitan.",
    detailedDescription: "Law of Proximity menyatakan bahwa elemen visual yang berdekatan dipersepsikan sebagai satu kelompok atau memiliki hubungan. Ini adalah prinsip dasar dalam desain visual dan UX.",
    keyTakeaways: [
      "Gunakan whitespace untuk memisahkan kelompok yang berbeda",
      "Letakkan elemen terkait berdekatan",
      "Gunakan visual grouping untuk meningkatkan scanability",
      "Pertimbangkan jarak dalam grid layout"
    ],
    images: [
      {
        src: "/window.svg",
        alt: "Contoh grouping dengan proximity",
        description: "Elemen yang berdekatan terlihat sebagai satu kelompok"
      }
    ],
    examples: [
      "Form dengan label dekat input field",
      "Card design dengan elemen terkait berdekatan",
      "Navigation menu dengan item terkait dalam grup"
    ]
  },
  'peak-end': {
    title: "Peak-End Rule",
    shortDescription: "Pengalaman dinilai dari puncak emosional dan akhir.",
    detailedDescription: "Peak-End Rule menyatakan bahwa pengalaman dinilai berdasarkan puncak emosional (baik positif maupun negatif) dan bagaimana pengalaman berakhir, bukan rata-rata keseluruhan pengalaman.",
    keyTakeaways: [
      "Pastikan akhir pengalaman selalu positif",
      "Ciptakan momen yang memorable",
      "Minimalkan friction di tengah proses",
      "Berikan feedback yang jelas di setiap langkah"
    ],
    images: [
      {
        src: "/UXLab.svg",
        alt: "Grafik Peak-End Rule",
        description: "Pengalaman dinilai dari puncak dan akhir, bukan rata-rata"
      }
    ],
    examples: [
      "Checkout process dengan konfirmasi yang menyenangkan",
      "Onboarding dengan welcome message yang hangat",
      "Error handling yang helpful dan tidak menyalahkan user"
    ]
  },
  'serial-position': {
    title: "Serial Position Effect",
    shortDescription: "Item di awal dan akhir lebih mudah diingat.",
    detailedDescription: "Serial Position Effect menjelaskan bahwa item di posisi awal (primacy effect) dan akhir (recency effect) dalam sebuah daftar lebih mudah diingat daripada item di tengah.",
    keyTakeaways: [
      "Letakkan informasi penting di awal dan akhir list",
      "Gunakan breadcrumb untuk navigasi",
      "Highlight item terakhir yang diakses",
      "Pertimbangkan urutan dalam menu dan form"
    ],
    images: [
      {
        src: "/UXLab.svg",
        alt: "Contoh serial position effect",
        description: "Item pertama dan terakhir lebih mudah diingat"
      }
    ],
    examples: [
      "Menu dengan item penting di awal dan akhir",
      "Form dengan field penting di awal",
      "Search results dengan item relevan di posisi awal"
    ]
  },
  'similarity': {
    title: "Law of Similarity",
    shortDescription: "Elemen yang mirip dipersepsikan sebagai satu kelompok.",
    detailedDescription: "Law of Similarity menyatakan bahwa elemen visual yang memiliki karakteristik yang sama (warna, bentuk, ukuran, orientasi) akan dipersepsikan sebagai satu kelompok atau memiliki hubungan.",
    keyTakeaways: [
      "Gunakan warna konsisten untuk elemen yang terkait",
      "Buat tombol dengan style yang sama untuk fungsi serupa",
      "Gunakan typography yang konsisten untuk hierarki",
      "Kelompokkan elemen dengan bentuk atau ukuran yang mirip"
    ],
    images: [
      {
        src: "/UXLab.svg",
        alt: "Contoh law of similarity",
        description: "Elemen dengan warna dan bentuk yang sama terlihat sebagai satu kelompok"
      }
    ],
    examples: [
      "Tombol dengan warna yang sama untuk fungsi serupa",
      "Card design dengan style yang konsisten",
      "Navigation menu dengan ikon yang seragam"
    ]
  },
  'closure': {
    title: "Law of Closure",
    shortDescription: "Mata cenderung melengkapi bentuk yang tidak lengkap.",
    detailedDescription: "Law of Closure menjelaskan bahwa otak manusia cenderung melengkapi bentuk atau pola yang tidak lengkap untuk menciptakan gambaran yang utuh dan bermakna.",
    keyTakeaways: [
      "Gunakan bentuk yang tidak lengkap untuk menarik perhatian",
      "Manfaatkan whitespace untuk menciptakan ilusi bentuk",
      "Gunakan loading states yang menunjukkan progress",
      "Buat desain yang memungkinkan user melengkapi pola"
    ],
    images: [
      {
        src: "/UXLab.svg",
        alt: "Contoh law of closure",
        description: "Bentuk yang tidak lengkap membuat user ingin melengkapinya"
      }
    ],
    examples: [
      "Loading spinner yang menunjukkan progress",
      "Card design dengan border yang tidak lengkap",
      "Icon yang menggunakan negative space"
    ]
  },
  'continuity': {
    title: "Law of Continuity",
    shortDescription: "Mata mengikuti garis dan kurva yang halus.",
    detailedDescription: "Law of Continuity menyatakan bahwa mata manusia cenderung mengikuti garis dan kurva yang halus, dan mempersepsikan elemen yang berada dalam garis yang sama sebagai satu kelompok.",
    keyTakeaways: [
      "Gunakan garis untuk memandu mata user",
      "Buat flow yang natural dalam layout",
      "Gunakan alignment yang konsisten",
      "Manfaatkan kurva untuk menciptakan flow yang halus"
    ],
    images: [
      {
        src: "/UXLab.svg",
        alt: "Contoh law of continuity",
        description: "Garis dan kurva memandu mata user mengikuti alur yang diinginkan"
      }
    ],
    examples: [
      "Timeline dengan garis yang menghubungkan event",
      "Form dengan flow yang natural dari atas ke bawah",
      "Carousel dengan indikator yang menunjukkan progress"
    ]
  }
};

function DetailedExplanation({ law }) {
  const lawKey = law.key.split('-')[0]; 
  const content = lawContent[lawKey] || {
    title: law.title,
    shortDescription: law.desc,
    detailedDescription: "Penjelasan detail untuk " + law.title + " akan segera tersedia.",
    keyTakeaways: [
      "Key takeaway 1 akan ditambahkan",
      "Key takeaway 2 akan ditambahkan",
      "Key takeaway 3 akan ditambahkan"
    ],
    images: [
      {
        src: law.img,
        alt: "Ilustrasi " + law.title,
        description: "Deskripsi gambar akan ditambahkan"
      }
    ],
    examples: [
      "Contoh aplikasi 1",
      "Contoh aplikasi 2",
      "Contoh aplikasi 3"
    ]
  };

  return (
      <div>
        <h2 style={{
          textAlign:'center',
          fontSize:'32px',
          fontWeight:'bold',
          fontFamily:'Satoshi',
          background: 'linear-gradient(135deg, #d8e63c 0%, #a8d83c 50%, #8eb940 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom:'20px',
          //textShadow:'0 2px 4px rgba(100,100,100, 100)'
        }}>
          Get to Know
        </h2>
      
      <div style={{marginBottom:'30px'}}>
        <p style={{opacity:0.9, lineHeight:1.7, fontSize:'20px', fontWeight:400, marginBottom:'16px'}}>
          {content.detailedDescription}
        </p>
      </div>

      <div style={{marginBottom:'30px'}}>
        <h3 style={{fontSize:'24px', fontWeight:600, marginBottom:'16px', color:'#ffffff'}}>
          Key Takeaways
        </h3>
        <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
          {content.keyTakeaways.map((takeaway, index) => (
            <div key={index} style={{
              display:'flex',
              alignItems:'flex-start',
              gap:'16px'
            }}>
              <div style={{
                width: 28, 
                height: 28,
                padding: 10, 
                borderRadius: 18, 
                outline: '1px white solid', 
                outlineOffset: '-1px', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', 
                display: 'inline-flex',
                flexShrink: 0
              }}>
                <div style={{
                  alignSelf: 'stretch', 
                  textAlign: 'center', 
                  color: 'white', 
                  fontSize: 16, 
                  fontFamily: 'Satoshi', 
                  fontStyle: 'italic', 
                  fontWeight: '400', 
                  wordWrap: 'break-word'
                }}>
                  {index + 1}.
                </div>
              </div>
              <div style={{
                flex: 1,
                padding:'12px 0',
                display:'flex',
                alignItems:'center'
              }}>
                <span style={{opacity:0.9, lineHeight:1.6, fontSize:'20px', color:'white'}}>{takeaway}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{marginBottom:'30px'}}>
        <h3 style={{fontSize:'22px', fontWeight:600, marginBottom:'16px', color:'#ffffff'}}>
          Contoh Aplikasi
        </h3>
        <div style={{display:'grid', gap:'16px'}}>
          {content.examples.map((example, index) => (
            <div key={index} style={{
              padding:'16px',
              background:'rgba(255, 255, 255, 0.05)',
              borderRadius:'12px',
              border:'1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <span style={{opacity:0.9, lineHeight:1.6}}>{example}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{marginBottom:'30px'}}>
        <h3 style={{fontSize:'22px', fontWeight:600, marginBottom:'16px', color:'#ffffff'}}>
          Ilustrasi
        </h3>
        <div style={{display:'grid', gap:'20px'}}>
          {content.images.map((image, index) => (
            <div key={index} style={{
              textAlign:'center',
              padding:'20px',
              background:'rgba(255, 255, 255, 0.05)',
              borderRadius:'12px',
              border:'1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <img 
                src={image.src} 
                alt={image.alt}
                style={{
                  maxWidth:'100%',
                  height:'auto',
                  borderRadius:'8px',
                  marginBottom:'12px'
                }}
              />
              <p style={{
                opacity:0.8,
                fontSize:'14px',
                lineHeight:1.5,
                fontStyle:'italic'
              }}>
                {image.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LawsPage() {
  // console.log('Laws page rendered');
  const { currentUser } = useAuth();
  const [userStats, setUserStats] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const baseItems = useMemo(() => {
    return [
      { key: 'hick', title: "Hick's Law", desc: 'Waktu untuk mengambil keputusan bertambah seiring banyaknya dan rumitnya pilihan.', img: '/hicks.webp', hasGame: true },
      { key: 'fitts', title: "Fitts's Law", desc: 'Waktu untuk mencapai target dipengaruhi oleh ukuran dan jaraknya.', img: '/fitts.svg', hasGame: true },
      { key: 'jakob', title: "Jakob's Law", desc: 'User menyukai pola yang sudah familiar.', img: '/jakob.svg', hasGame: true },
      { key: 'miller', title: "Miller's Law", desc: 'Short-term memory rata-rata 7±2 item.', img: '/miller.svg', hasGame: true },
      { key: 'proximity', title: 'Law of Proximity', desc: 'Elemen yang berdekatan dipersepsikan memiliki keterkaitan.', img: '/proximity.svg', hasGame: true },
      { key: 'peak-end', title: 'Peak-End Rule', desc: 'Pengalaman dinilai dari puncak emosional dan akhir.', img: '/peakend.svg', hasGame: true },
      { key: 'serial-position', title: 'Serial Position Effect', desc: 'Item di awal dan akhir lebih mudah diingat.', img: '/serial.svg', hasGame: true },
      { key: 'similarity', title: 'Law of Similarity', desc: 'Elemen yang mirip dipersepsikan sebagai satu kelompok.', img: '/similarity.svg', hasGame: false },
      { key: 'closure', title: 'Law of Closure', desc: 'Mata cenderung melengkapi bentuk yang tidak lengkap.', img: '/closure.svg', hasGame: false },
      { key: 'continuity', title: 'Law of Continuity', desc: 'Mata mengikuti garis dan kurva yang halus.', img: '/continuity.svg', hasGame: false },
    ];
  }, []);

  const items = useMemo(() => {
    const result = [];
    for (let i = 0; i < 20; i++) {
      const baseItem = baseItems[i % baseItems.length];
      result.push({
        ...baseItem,
        key: `${baseItem.key}-${i}`
      });
    }
    return result;
  }, [baseItems]);

  const [active, setActive] = useState(0);
  const [isPaused, setPaused] = useState(false);
  const [gameMode, setGameMode] = useState(null); 
  const [gameType, setGameType] = useState(null); 
  
  const [fittsStart, setFittsStart] = useState(null);
  const [fittsResult, setFittsResult] = useState({ nearLarge: null, farSmall: null });
  
  const [jakobStart, setJakobStart] = useState(null);
  const [jakobResult, setJakobResult] = useState({ normal: null, unique: null, errors: 0 });
  const [jakobMode, setJakobMode] = useState(null); 
  
  const [millerSeq, setMillerSeq] = useState([]);
  const [millerShown, setMillerShown] = useState(false);
  const [millerInput, setMillerInput] = useState('');
  const [millerResult, setMillerResult] = useState({ five: null, ten: null });
  const [millerStart, setMillerStart] = useState(null);
  
  const [proxSpacing, setProxSpacing] = useState('tight'); 
  const [proximityGroups, setProximityGroups] = useState({});
  const [proximityStart, setProximityStart] = useState(null);

  const [peakEndFlow, setPeakEndFlow] = useState('A'); 
  const [peakEndStep, setPeakEndStep] = useState(0);
  const [peakEndRating, setPeakEndRating] = useState(null);
 
  const [serialWords, setSerialWords] = useState([]);
  const [serialShown, setSerialShown] = useState(false);
  const [serialInput, setSerialInput] = useState('');
  const [serialResult, setSerialResult] = useState(null);

  const [similarityItems, setSimilarityItems] = useState([]);
  const [similarityGroups, setSimilarityGroups] = useState({});

  const [aestheticVersion, setAestheticVersion] = useState('basic');
  const [aestheticTask, setAestheticTask] = useState(0);
  const [aestheticResults, setAestheticResults] = useState({ basic: null, aesthetic: null });
  
  const [dohertyDelay, setDohertyDelay] = useState(100);
  const [dohertyTask, setDohertyTask] = useState(0);
  const [dohertyResults, setDohertyResults] = useState({ fast: null, slow: null });
  
  const [pragnanzVersion, setPragnanzVersion] = useState('complex');
  const [pragnanzTask, setPragnanzTask] = useState(0);
  const [pragnanzResults, setPragnanzResults] = useState({ complex: null, simple: null });
 
  const [occamVersion, setOccamVersion] = useState('long');
  const [occamStep, setOccamStep] = useState(0);
  const [occamResults, setOccamResults] = useState({ long: null, short: null });
 
  const [clickCostVersion, setClickCostVersion] = useState('multi');
  const [clickCostStep, setClickCostStep] = useState(0);
  const [clickCostResults, setClickCostResults] = useState({ single: null, multi: null });

  const [commonRegionGroups, setCommonRegionGroups] = useState({});
  const [commonRegionStart, setCommonRegionStart] = useState(null);
  
  const [fittsEdgeStart, setFittsEdgeStart] = useState(null);
  const [fittsEdgeResult, setFittsEdgeResult] = useState({ edge: null, center: null });

  const [progressiveVersion, setProgressiveVersion] = useState('all');
  const [progressiveTask, setProgressiveTask] = useState(0);
  const [progressiveResults, setProgressiveResults] = useState({ all: null, progressive: null });
  
  const [microVersion, setMicroVersion] = useState('basic');
  const [microAction, setMicroAction] = useState(0);
  const [microResults, setMicroResults] = useState({ basic: null, enhanced: null });
 
  const [navPrimacyVersion, setNavPrimacyVersion] = useState('first');
  const [navPrimacyTarget, setNavPrimacyTarget] = useState('settings');
  const [navPrimacyResults, setNavPrimacyResults] = useState({ first: null, middle: null });
 
  const [visibilityVersion, setVisibilityVersion] = useState('with');
  const [visibilityProgress, setVisibilityProgress] = useState(0);
  const [visibilityResults, setVisibilityResults] = useState({ with: null, without: null });

  const [consistencyVersion, setConsistencyVersion] = useState('consistent');
  const [consistencyTask, setConsistencyTask] = useState(0);
  const [consistencyResults, setConsistencyResults] = useState({ consistent: null, mixed: null });
  const [gameResults, setGameResults] = useState({ easy: null, hard: null });
  const [gameStartTime, setGameStartTime] = useState(null);
  const [targetButton, setTargetButton] = useState(null);
  const [gamePhase, setGamePhase] = useState('waiting'); 

  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        try {
          const stats = await getUserStats(currentUser.uid);
          setUserStats(stats);
          
          const progressPromises = baseItems.map(async (item) => {
            const progress = await getUserProgress(currentUser.uid, item.key);
            return { [item.key]: progress };
          });
          
          const progressResults = await Promise.all(progressPromises);
          const combinedProgress = progressResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
          setUserProgress(combinedProgress);
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };

    loadUserData();
  }, [currentUser]);

  const saveSimulation = async (lawId, simulationData) => {
    if (!currentUser) return;
    
    try {
      const result = await saveSimulationResult(currentUser.uid, {
        lawId,
        ...simulationData,
        timestamp: new Date().toISOString()
      });
      
      if (result) {
        setUserStats(prev => ({
          ...prev,
          totalSimulations: (prev?.totalSimulations || 0) + 1
        }));
      }
    } catch (error) {
      console.error('Error saving simulation:', error);
    }
  };

  const saveProgress = async (lawId, progressData) => {
    if (!currentUser) return;
    
    try {
      const result = await saveUserProgress(currentUser.uid, lawId, progressData);
      
      if (result) {
        setUserProgress(prev => ({
          ...prev,
          [lawId]: { ...prev[lawId], ...progressData }
        }));
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }; 

  const gapX = 280; 
  const curvePow = 2.0; 
  const curveMul = 48; 
  const half = items.length / 2;

  function handlePrev() {
    setActive(prev => (prev - 1 + items.length) % items.length);
  }
  
  const handleNext = () => {
    setActive(prev => (prev + 1) % items.length);
  };

  // GAMEEEEE LETSGOOO
  const startGame = (mode) => {
    setGameMode(mode);
    setGameType('hick');
    setGamePhase('ready');
    setGameStartTime(null);
    setTargetButton(null);
    
    setTimeout(() => {
      setGamePhase('playing');
      setGameStartTime(Date.now());
      const buttonCount = mode === 'easy' ? 3 : 12;
      setTargetButton(Math.floor(Math.random() * buttonCount));
    }, 2000);
  };

  const openFitts = () => {
    setGameType('fitts');
    setFittsStart(null);
    setFittsResult({ nearLarge: null, farSmall: null });
  };

  const openJakob = () => {
    setGameType('jakob');
    setJakobResult({ normal: null, unique: null, errors: 0 });
    setJakobMode('normal');
    setJakobStart(Date.now());
  };

  const openMiller = (len = 5) => {
    setGameType('miller');
    const seq = Array.from({ length: len }, () => Math.floor(Math.random() * 9)).join('');
    setMillerSeq(seq);
    setMillerShown(true);
    setMillerInput('');
    setTimeout(() => {
      setMillerShown(false);
      setMillerStart(Date.now());
    }, Math.max(1500, len * 250));
  };

  const openProximity = (spacing = 'tight') => {
    setGameType('proximity');
    setProxSpacing(spacing);
    setProximityGroups({});
    setProximityStart(Date.now());
  };

  const openPeakEnd = (flow = 'A') => {
    setGameType('peak-end');
    setPeakEndFlow(flow);
    setPeakEndStep(0);
    setPeakEndRating(null);
  };

  const openSerialPosition = () => {
    setGameType('serial-position');
    const words = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon'];
    setSerialWords(words);
    setSerialShown(true);
    setSerialInput('');
    setTimeout(() => setSerialShown(false), 3000);
  };

  const openSimilarity = () => {
    setGameType('similarity');
    const items = [
      { id: 1, type: 'button', color: 'blue', shape: 'round' },
      { id: 2, type: 'button', color: 'blue', shape: 'square' },
      { id: 3, type: 'link', color: 'red', shape: 'round' },
      { id: 4, type: 'link', color: 'red', shape: 'square' },
      { id: 5, type: 'input', color: 'green', shape: 'round' },
      { id: 6, type: 'input', color: 'green', shape: 'square' }
    ];
    setSimilarityItems(items);
    setSimilarityGroups({});
  };

  const openAestheticUsability = (version = 'basic') => {
    setGameType('aesthetic-usability');
    setAestheticVersion(version);
    setAestheticTask(0);
  };

  const openDoherty = (delay = 100) => {
    setGameType('doherty');
    setDohertyDelay(delay);
    setDohertyTask(0);
  };

  const openPragnanz = (version = 'complex') => {
    setGameType('pragnanz');
    setPragnanzVersion(version);
    setPragnanzTask(0);
  };

  const openOccam = (version = 'long') => {
    setGameType('occam');
    setOccamVersion(version);
    setOccamStep(0);
  };

  const openClickCost = (version = 'multi') => {
    setGameType('click-cost');
    setClickCostVersion(version);
    setClickCostStep(0);
  };

  const openCommonRegion = () => {
    setGameType('common-region');
    setCommonRegionGroups({});
    setCommonRegionStart(Date.now());
  };

  const openFittsEdge = () => {
    setGameType('fitts-edge');
    setFittsEdgeStart(null);
    setFittsEdgeResult({ edge: null, center: null });
  };

  const openProgressiveDisclosure = (version = 'all') => {
    setGameType('progressive-disclosure');
    setProgressiveVersion(version);
    setProgressiveTask(0);
  };

  const openMicroInteractions = (version = 'basic') => {
    setGameType('micro-interactions');
    setMicroVersion(version);
    setMicroAction(0);
  };

  const openNavigationPrimacy = (version = 'first') => {
    setGameType('navigation-primacy');
    setNavPrimacyVersion(version);
    setNavPrimacyTarget('settings');
  };

  const openVisibilityStatus = (version = 'with') => {
    setGameType('visibility-status');
    setVisibilityVersion(version);
    setVisibilityProgress(0);
  };

  const openConsistency = (version = 'consistent') => {
    setGameType('consistency');
    setConsistencyVersion(version);
    setConsistencyTask(0);
  };

  const handleButtonClick = (buttonIndex) => {
    if (gamePhase !== 'playing' || buttonIndex !== targetButton) return;
    
    const reactionTime = Date.now() - gameStartTime;
    setGameResults(prev => ({ ...prev, [gameMode]: reactionTime }));
    setGamePhase('result');
    
    // Save simulation result to Firebase
    if (currentUser) {
      saveSimulation('hick', {
        gameMode,
        reactionTime,
        completed: true,
        timestamp: new Date().toISOString()
      });
      
      // Save progress
      saveProgress('hick', {
        lastPlayed: new Date().toISOString(),
        completedSimulations: true,
        bestTime: reactionTime
      });
    }
  };

  const resetGame = () => {
    setGameMode(null);
    setGameType(null);
    setGameResults({ easy: null, hard: null });
    setGamePhase('waiting');
    setGameStartTime(null);
    setTargetButton(null);
  };

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen w-full" style={{color:'#ffffff', padding:0, overflow:'hidden'}}>
        <style>{`
          .laws-frame { position: relative; width: 100vw; height: 1024px; margin: 0; overflow: hidden; padding: 0; }
          .carousel-stage { position: absolute; left: 0; top: 120px; transform: none; width: 100vw; height: 650px; pointer-events: none; }
          .card { position: absolute; width: 200px; height: 200px; border-radius: 28px; overflow: hidden; will-change: transform, opacity, filter; }
          .card img, .card svg { width: 100%; height: 100%; object-fit: cover; display: block; }
          .card-inner { width: 100%; height: 100%; display: grid; place-items: center; }
          .card.active { box-shadow: 0 0 30px rgba(255,255,255,0.35), 0 6px 50px rgba(255,255,255,0.18); }
          .card:not(.active) { opacity: 0.95; }
          .nav-btn { pointer-events: all; cursor: pointer; width: 42px; height: 42px; display: grid; place-items: center; border-radius: 66px; outline: 1px solid #999999; background: transparent; color: #ffffff; }
          .nav-btn:hover { opacity: .9; }
          .fade-slide-in { animation: fadeSlideIn 700ms cubic-bezier(0.16, 1, 0.3, 1) both; }
          @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          .title-in { animation: titleIn 700ms cubic-bezier(0.16, 1, 0.3, 1) both; }
          @keyframes titleIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
          .desc-in { animation: descIn 850ms cubic-bezier(0.16, 1, 0.3, 1) both; }
          @keyframes descIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
          .btn-in { animation: btnIn 950ms cubic-bezier(0.16, 1, 0.3, 1) both; }
          @keyframes btnIn { from { opacity: 0; transform: translateY(18px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
          .card { transition: transform 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms ease, filter 400ms ease; }
          @media (prefers-reduced-motion: reduce) {
            .card, .fade-slide-in, .title-in, .desc-in, .btn-in { animation: none !important; transition: none !important; }
          }
         
          .overlay-card { max-width: 600px; width: 90%; }
          .prox-grid { display: grid; grid-template-columns: repeat(8, 40px); gap: 16px; justify-content: center; }
          .prox-zones { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          .serial-words { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
          .rating-row { display:flex; gap:8px; justify-content:center; margin-bottom:16px; }
          @media (max-width: 1024px) {
            .card { width: 200px; height: 200px; }
          }
          @media (max-width: 768px) {
            .carousel-stage { top: 180px; height: 520px; }
            .card { width: 160px; height: 160px; border-radius: 24px; }
            .overlay-card { width: 92% !important; padding: 16px !important; }
            .prox-grid { grid-template-columns: repeat(4, 40px) !important; gap: 12px !important; }
            .prox-zones { grid-template-columns: 1fr !important; }
            .serial-words { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 420px) {
            .card { width: 130px; height: 130px; border-radius: 18px; }
          }
        `}</style>

        <div className="laws-frame" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="carousel-stage">
          {items.map((item, idx) => {
            
            let offset = idx - active;
            if (offset > half) offset -= items.length;
            if (offset < -half) offset += items.length;
            const cx = offset * gapX;
            const cy = Math.pow(Math.abs(offset), curvePow) * curveMul; 
            const isActive = idx === active;
            const tilt = offset * 18; 
            return (
              <div
                key={item.key}
                className={`card ${isActive ? 'active' : ''}`}
                style={{
                  left: '50%',
                  top: '0',
                  transform: `translate(-50%, 0) translate(${cx}px, ${cy}px) rotate(${tilt}deg) ${isActive ? 'scale(1.06)' : 'scale(1)'}`,
                  background: item.bg,
                  zIndex: isActive ? 20 : 20 - Math.abs(offset),
                }}
              >
                <div className="card-inner">
                  <img src={item.img} alt={item.title} draggable={false} />
                </div>
              </div>
            );
          })}

          <div style={{position:'absolute', left:'50%', top:'320px', transform:'translateX(-50%)', width:'min(100%, 980px)', display:'flex', alignItems:'center', justifyContent:'center', gap:'28px', pointerEvents:'none'}}>
            <button onClick={handlePrev} aria-label="Previous" className="nav-btn" style={{pointerEvents:'all'}}>
              ‹
            </button>
            <div style={{width:'450px'}} className="fade-slide-in">
                <div style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center'}}>
                  <h1 className="title-in" style={{fontSize:'32px', fontWeight:500, marginBottom:'-8px'}}>{items[active].title}</h1>
                  <p className="desc-in" style={{fontSize:'18px', marginBottom:'44px', color:'#808080'}}>{items[active].desc}</p>
                  <button 
                    className="btn-in" 
                    onClick={() => {
                      if (!items[active].hasGame) return;
                      const key = items[active].key;
                      if (key.includes('hick')) return startGame('easy');
                      if (key.includes('fitts') && !key.includes('edge')) return openFitts();
                      if (key.includes('jakob')) return openJakob();
                      if (key.includes('miller')) return openMiller(5);
                      if (key.includes('proximity')) return openProximity('tight');
                      if (key.includes('peak-end') && !key.includes('micro')) return openPeakEnd('A');
                      if (key.includes('serial-position')) return openSerialPosition();
                      if (key.includes('similarity')) return openSimilarity();
                      if (key.includes('aesthetic-usability')) return openAestheticUsability('basic');
                      if (key.includes('doherty')) return openDoherty(100);
                      if (key.includes('prägnanz')) return openPragnanz('complex');
                      if (key.includes('occam')) return openOccam('long');
                      if (key.includes('click-cost')) return openClickCost('multi');
                      if (key.includes('common-region')) return openCommonRegion();
                      if (key.includes('fitts-edge')) return openFittsEdge();
                      if (key.includes('progressive-disclosure')) return openProgressiveDisclosure('all');
                      if (key.includes('micro-interactions')) return openMicroInteractions('basic');
                      if (key.includes('navigation-primacy')) return openNavigationPrimacy('first');
                      if (key.includes('visibility-status')) return openVisibilityStatus('with');
                      if (key.includes('consistency')) return openConsistency('consistent');
                    }}
                    style={{
                      width:'207px', 
                      padding:'10px 24px', 
                      borderRadius:'16px', 
                      background: items[active].hasGame ? '#8eb940' : '#666666', 
                      color: items[active].hasGame ? '#000000' : '#999999', 
                      fontWeight:700, 
                      boxShadow: items[active].hasGame ? '4px 4px 20px rgba(255,255,255,0.10), inset 0 4px 24px rgba(232,244,98,1), inset 4px 0 24px rgba(232,244,98,1)' : 'none', 
                      outline:'4px solid rgba(255,255,255,0.1)', 
                      cursor: items[active].hasGame ? 'pointer' : 'not-allowed', 
                      pointerEvents:'all',
                      opacity: items[active].hasGame ? 1 : 0.6,
                      position: 'relative'
                    }}
                  >
                    {items[active].hasGame ? 'Simulasi' : 'Coming Soon'}
                    {/* Progress indicator */}
                    {currentUser && userProgress[items[active].key.split('-')[0]] && (
                      <div style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#8eb940',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: '#000'
                      }}>
                        ✓
                      </div>
                    )}
                  </button>
              </div>
            </div>
            <button onClick={handleNext} aria-label="Next" className="nav-btn" style={{pointerEvents:'all'}}>
              ›
            </button>
          </div>
        </div>

        </div>

        {/* Game Overlay */}
        {(gameType === 'hick') && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            color: 'white'
          }}>
            <div style={{
              backgroundColor: '#1a1a1a',
              borderRadius: '20px',
              padding: '40px',
              maxWidth: '600px',
              width: '90%',
              textAlign: 'center',
              border: '1px solid #333'
            }}>
              {gamePhase === 'ready' && (
                <div>
                  <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>Bersiap!</h2>
                  <p style={{ fontSize: '18px', marginBottom: '20px' }}>
                    {gameMode === 'easy' ? '3 tombol akan muncul' : '12 tombol akan muncul'}
                  </p>
                  <p style={{ fontSize: '16px', color: '#888' }}>
                    Klik tombol yang disorot dengan warna hijau secepat mungkin!
                  </p>
                </div>
              )}

              {gamePhase === 'playing' && (
                <div>
                  <h2 style={{ fontSize: '28px', marginBottom: '30px' }}>
                    Klik tombol hijau sekarang!
                  </h2>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: gameMode === 'easy' ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
                    gap: '15px',
                    maxWidth: '400px',
                    margin: '0 auto'
                  }}>
                    {Array.from({ length: gameMode === 'easy' ? 3 : 12 }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => handleButtonClick(i)}
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '10px',
                          border: '2px solid #333',
                          backgroundColor: i === targetButton ? '#8eb940' : '#333',
                          color: i === targetButton ? '#000' : '#fff',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {gamePhase === 'result' && (
                <div>
                  <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>Hasil!</h2>
                  <p style={{ fontSize: '20px', marginBottom: '20px' }}>
                    Waktu reaksi: <strong>{gameResults[gameMode]}ms</strong>
                  </p>
                  
                  {gameResults.easy && gameResults.hard ? (
                    <div style={{ marginBottom: '30px' }}>
                      <h3 style={{ fontSize: '24px', marginBottom: '15px' }}>Perbandingan:</h3>
                      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
                        <div>
                          <p style={{ fontSize: '16px', color: '#888' }}>3 Opsi</p>
                          <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{gameResults.easy}ms</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '16px', color: '#888' }}>12 Opsi</p>
                          <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{gameResults.hard}ms</p>
                        </div>
                      </div>
                      <p style={{ fontSize: '16px', color: '#8eb940' }}>
                        {gameResults.hard > gameResults.easy 
                          ? `Dengan 12 opsi, Anda ${gameResults.hard - gameResults.easy}ms lebih lambat!`
                          : 'Hasil tidak sesuai ekspektasi Hick\'s Law'
                        }
                      </p>
                      <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '16px', marginTop: '20px' }}>
                        <h4 style={{ fontSize: '18px', marginBottom: '8px', color: '#8eb940' }}>💡 Lesson Learned</h4>
                        <p style={{ fontSize: '14px', lineHeight: '1.5', opacity: '0.9' }}>
                          <strong>Hick's Law terbukti:</strong> Semakin banyak pilihan, semakin lama waktu pengambilan keputusan. 
                          Dalam desain UI, batasi opsi menu, gunakan progressive disclosure, dan kelompokkan pilihan yang mirip untuk mengurangi cognitive load.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: '16px', marginBottom: '30px' }}>
                      {gameMode === 'easy' 
                        ? 'Sekarang coba dengan 12 opsi untuk membandingkan!'
                        : 'Sekarang coba dengan 3 opsi untuk membandingkan!'
                      }
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    {!gameResults.easy && (
                      <button
                        onClick={() => startGame('easy')}
                        style={{
                          padding: '12px 24px',
                          borderRadius: '10px',
                          backgroundColor: '#8eb940',
                          color: '#000',
                          border: 'none',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        Coba 3 Opsi
                      </button>
                    )}
                    {!gameResults.hard && (
                      <button
                        onClick={() => startGame('hard')}
                        style={{
                          padding: '12px 24px',
                          borderRadius: '10px',
                          backgroundColor: '#8eb940',
                          color: '#000',
                          border: 'none',
                          fontSize: '16px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        Coba 12 Opsi
                      </button>
                    )}
                    <button
                      onClick={() => setGameType(null)}
                      style={{
                        padding: '12px 24px',
                        borderRadius: '10px',
                        backgroundColor: '#333',
                        color: '#fff',
                        border: '1px solid #555',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {(gameType === 'fitts') && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, color:'#fff' }}>
            <div style={{ position:'relative', width:'100%', height:'100%' }}>
              
              {fittsResult.nearLarge == null && (
                <>
                  <p style={{position:'absolute', top:20, width:'100%', textAlign:'center'}}>Klik lingkaran hijau besar sedekat ini secepat mungkin</p>
                  <button onClick={() => setFittsStart(Date.now())} style={{position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', padding:'10px 20px', borderRadius:8, background:'#333', border:'1px solid #555', color:'#fff'}}>Start</button>
                  {fittsStart && (
                    <div onClick={() => { setFittsResult(r => ({...r, nearLarge: Date.now() - fittsStart})); setFittsStart(null); }} style={{position:'absolute', left:'54%', top:'52%', width:140, height:140, borderRadius:'50%', background:'#8eb940', cursor:'pointer'}} />
                  )}
                </>
              )}
             
              {fittsResult.nearLarge != null && fittsResult.farSmall == null && (
                <>
                  <p style={{position:'absolute', top:20, width:'100%', textAlign:'center'}}>Sekarang klik lingkaran hijau kecil di pojok kiri bawah</p>
                  {!fittsStart && (
                    <button onClick={() => setFittsStart(Date.now())} style={{position:'absolute', left:'50%', top:'50%', transform:'translate(-50%,-50%)', padding:'10px 20px', borderRadius:8, background:'#333', border:'1px solid #555', color:'#fff'}}>Start</button>
                  )}
                  {fittsStart && (
                    <div onClick={() => { setFittsResult(r => ({...r, farSmall: Date.now() - fittsStart})); setFittsStart(null); }} style={{position:'absolute', left:20, bottom:20, width:40, height:40, borderRadius:'50%', background:'#8eb940', cursor:'pointer'}} />
                  )}
                </>
              )}

              {/* Results */}
              {fittsResult.nearLarge != null && fittsResult.farSmall != null && (
                <div style={{position:'absolute', inset:0, display:'grid', placeItems:'center'}}>
                  <div style={{ textAlign:'center', background:'#1a1a1a', border:'1px solid #333', borderRadius:16, padding:24, maxWidth:500 }}>
                    <h2 style={{fontSize:28, marginBottom:12}}>Hasil Fitts's Law</h2>
                    <p>Target dekat besar: <b>{fittsResult.nearLarge}ms</b></p>
                    <p>Target jauh kecil: <b>{fittsResult.farSmall}ms</b></p>
                    <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '16px', marginTop: '20px' }}>
                      <h4 style={{ fontSize: '18px', marginBottom: '8px', color: '#8eb940' }}>💡 Lesson Learned:</h4>
                      <p style={{ fontSize: '14px', lineHeight: '1.5', opacity: '0.9' }}>
                        <strong>Fitts's Law terbukti:</strong> Target yang lebih besar dan lebih dekat lebih mudah dicapai. 
                        Dalam desain UI, letakkan tombol penting di area yang mudah dijangkau, buat tombol cukup besar untuk mobile, 
                        dan manfaatkan edge screen untuk target yang sering digunakan.
                      </p>
                    </div>
                    <button onClick={() => { setGameType(null); }} style={{marginTop:20, padding:'10px 20px', borderRadius:10, background:'#8eb940', color:'#000', border:'none', fontWeight:'bold'}}>Tutup</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Jakob's Law */}
        {(gameType === 'jakob') && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, color:'#fff' }}>
            <div style={{ background:'#1a1a1a', border:'1px solid #333', borderRadius:16, padding:24, width:520 }}>
              <h2 style={{fontSize:24, marginBottom:12}}>Cari dan klik "Profile"</h2>
              <p style={{opacity:.8, marginBottom:16}}>
                {jakobMode === 'normal' ? 'Menu familiar' : 'Menu unik/abstrak'} — klik secepatnya.
              </p>
              {jakobMode === 'normal' ? (
                <div style={{ display:'flex', gap:12, justifyContent:'center', marginBottom:16 }}>
                  <button onClick={() => setJakobStart(Date.now())} style={{ padding:'6px 10px', borderRadius:8, background:'#333', border:'1px solid #555', color:'#fff' }}>Start</button>
                  <button onClick={() => { if (!jakobStart) return; setJakobResult(r => ({...r, normal: Date.now() - jakobStart})); setJakobStart(null); setJakobMode('unique'); setTimeout(()=> setJakobStart(Date.now()), 300); }} style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 14px', borderRadius:12, background:'#222', border:'1px solid #555', color:'#fff', cursor:'pointer' }}>
                    <span role="img" aria-label="home">🏠</span> Home
                  </button>
                  <button onClick={() => setJakobResult(r => ({...r, errors: r.errors + 1}))} style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 14px', borderRadius:12, background:'#222', border:'1px solid #555', color:'#fff', cursor:'pointer' }}>
                    <span role="img" aria-label="settings">⚙️</span> Settings
                  </button>
                  <button onClick={() => setJakobResult(r => ({...r, errors: r.errors + 1}))} style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 14px', borderRadius:12, background:'#222', border:'1px solid #555', color:'#fff', cursor:'pointer' }}>
                    <span role="img" aria-label="help">❓</span> Help
                  </button>
                  <button onClick={() => { if (!jakobStart) return; setJakobResult(r => ({...r, normal: Date.now() - jakobStart})); setJakobStart(null); setJakobMode('unique'); setTimeout(()=> setJakobStart(Date.now()), 300); }} style={{ display:'flex', alignItems:'center', gap:6, padding:'10px 14px', borderRadius:12, background:'#222', border:'1px solid #555', color:'#fff', cursor:'pointer' }}>
                    <span role="img" aria-label="profile">👤</span> Profile
                  </button>
                </div>
              ) : (
                <div style={{ display:'flex', gap:12, justifyContent:'center', marginBottom:16 }}>
                  <button onClick={() => setJakobResult(r => ({...r, errors: r.errors + 1}))} style={{ padding:'10px 14px', borderRadius:12, background:'#222', border:'1px solid #555', color:'#fff', cursor:'pointer' }}>◼︎◻︎</button>
                  <button onClick={() => setJakobResult(r => ({...r, errors: r.errors + 1}))} style={{ padding:'10px 14px', borderRadius:12, background:'#222', border:'1px solid #555', color:'#fff', cursor:'pointer' }}>⌘⌥</button>
                  <button onClick={() => setJakobResult(r => ({...r, unique: Date.now() - jakobStart}))} style={{ padding:'10px 14px', borderRadius:12, background:'#222', border:'1px solid #555', color:'#fff', cursor:'pointer' }}>◎○</button>
                  <button onClick={() => setJakobResult(r => ({...r, errors: r.errors + 1}))} style={{ padding:'10px 14px', borderRadius:12, background:'#222', border:'1px solid #555', color:'#fff', cursor:'pointer' }}>△◇</button>
                </div>
              )}
              {(jakobResult.normal != null && jakobResult.unique != null) && (
                <div style={{ textAlign:'center', marginTop:12 }}>
                  <p>Familiar (normal): <b>{jakobResult.normal}ms</b></p>
                  <p>Unik/abstrak: <b>{jakobResult.unique}ms</b></p>
                  <p>Errors: <b>{jakobResult.errors}</b></p>
                  <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '16px', marginTop: '16px' }}>
                    <h4 style={{ fontSize: '18px', marginBottom: '8px', color: '#8eb940' }}>💡 Lesson Learned:</h4>
                    <p style={{ fontSize: '14px', lineHeight: '1.5', opacity: '0.9' }}>
                      <strong>Jakob's Law terbukti:</strong> Interface familiar lebih mudah digunakan daripada yang unik/abstrak. 
                      User mengharapkan pola yang sudah dikenal. Gunakan ikon standar (🏠 untuk home, 👤 untuk profile), 
                      letakkan elemen di posisi yang diharapkan, dan hindari desain yang terlalu kreatif untuk fungsi dasar.
                    </p>
                  </div>
                  <button onClick={() => setGameType(null)} style={{marginTop:16, padding:'10px 16px', borderRadius:10, background:'#8eb940', color:'#000', border:'none', fontWeight:'bold'}}>Tutup</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Miller's Law Overlay */}
        {(gameType === 'miller') && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, color:'#fff' }}>
            <div style={{ background:'#1a1a1a', border:'1px solid #333', borderRadius:16, padding:24, width:520, textAlign:'center' }}>
              <h2 style={{fontSize:24, marginBottom:12}}>Ingat urutan angka</h2>
              {millerShown ? (
                <div style={{ fontSize:32, letterSpacing:2, margin:'16px 0' }}>{millerSeq}</div>
              ) : (
                <>
                  <input value={millerInput} onChange={e => setMillerInput(e.target.value)} placeholder="Ketik ulang di sini" style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid #555', background:'#111', color:'#fff', marginBottom:12 }} />
                  <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
                    <button onClick={() => {
                      if (millerSeq.length === 5) setMillerResult(r => ({...r, five: { correct: millerInput === millerSeq, ms: Date.now() - millerStart }}));
                      else setMillerResult(r => ({...r, ten: { correct: millerInput === millerSeq, ms: Date.now() - millerStart }}));
                    }} style={{ padding:'10px 16px', borderRadius:10, background:'#8eb940', color:'#000', border:'none', fontWeight:'bold' }}>Submit</button>
                    {(!millerResult.five || !millerResult.ten) && (
                      <button onClick={() => openMiller(millerSeq.length === 5 ? 10 : 5)} style={{ padding:'10px 16px', borderRadius:10, background:'#333', color:'#fff', border:'1px solid #555' }}>Coba {millerSeq.length === 5 ? '10' : '5'} Item</button>
                    )}
                    <button onClick={() => setGameType(null)} style={{ padding:'10px 16px', borderRadius:10, background:'#333', color:'#fff', border:'1px solid #555' }}>Tutup</button>
                  </div>
                  {(millerResult.five || millerResult.ten) && (
                    <div style={{ marginTop:12, textAlign:'left' }}>
                      {millerResult.five && <p>5 item: <b>{millerResult.five.ms}ms</b> — {millerResult.five.correct ? 'Benar' : 'Salah'}</p>}
                      {millerResult.ten && <p>10 item: <b>{millerResult.ten.ms}ms</b> — {millerResult.ten.correct ? 'Benar' : 'Salah'}</p>}
                      <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '16px', marginTop: '16px' }}>
                        <h4 style={{ fontSize: '18px', marginBottom: '8px', color: '#8eb940' }}>💡 Lesson Learned:</h4>
                        <p style={{ fontSize: '14px', lineHeight: '1.5', opacity: '0.9' }}>
                          <strong>Miller's Law terbukti:</strong> Short-term memory manusia terbatas pada 7±2 item. 
                          Dalam desain UI, batasi menu utama maksimal 7 item, gunakan chunking untuk mengelompokkan informasi, 
                          dan berikan feedback visual untuk membantu user mengingat status atau progress.
                        </p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {(gameType === 'proximity') && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, color:'#fff' }}>
            <div className="overlay-card" style={{ background:'#1a1a1a', border:'1px solid #333', borderRadius:16, padding:24, width:840 }}>
              <h2 style={{fontSize:24, marginBottom:12}}>Kelompokkan ikon yang menurutmu saling terkait</h2>
              <p style={{opacity:.8, marginBottom:16}}>Drag ikon ke Group A atau Group B. Waktu akan dicatat.</p>
              <div className="prox-zones" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <div>
                  <div className="prox-grid" style={{ display:'grid', gridTemplateColumns:'repeat(8, 40px)', gap: proxSpacing === 'tight' ? '8px' : '24px', justifyContent:'center', margin:'10px 0 20px' }}>
                    {Array.from({length:16}).map((_,i)=>{
                      const id = i+1;
                      return (
                        <div key={id}
                          draggable
                          onDragStart={(e)=>{ e.dataTransfer.setData('text/plain', String(id)); if (!proximityStart) setProximityStart(Date.now()); }}
                          style={{ width:40, height:40, borderRadius:10, background:'#2d2d2d', display:'grid', placeItems:'center', color:'#888', cursor:'grab' }}>{id}</div>
                      );
                    })}
                  </div>
                  <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
                    <button onClick={() => setProxSpacing('tight')} style={{ padding:'10px 16px', borderRadius:10, background: proxSpacing==='tight' ? '#8eb940' : '#333', color: proxSpacing==='tight' ? '#000' : '#fff', border:'1px solid #555' }}>Jarak Dekat</button>
                    <button onClick={() => setProxSpacing('loose')} style={{ padding:'10px 16px', borderRadius:10, background: proxSpacing==='loose' ? '#8eb940' : '#333', color: proxSpacing==='loose' ? '#000' : '#fff', border:'1px solid #555' }}>Jarak Jauh</button>
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                  {['A','B'].map(group => (
                    <div key={group}
                      onDragOver={(e)=> e.preventDefault()}
                      onDrop={(e)=>{
                        const id = e.dataTransfer.getData('text/plain');
                        setProximityGroups(prev => ({ ...prev, [id]: group }));
                      }}
                      style={{ minHeight:220, border:'1px dashed #555', borderRadius:12, padding:12 }}>
                      <div style={{ marginBottom:8, opacity:.8 }}>Group {group}</div>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                        {Object.entries(proximityGroups).filter(([_,g])=>g===group).map(([id]) => (
                          <div key={id} style={{ width:36, height:36, borderRadius:8, background:'#2d2d2d', display:'grid', placeItems:'center', color:'#888' }}>{id}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display:'flex', gap:10, justifyContent:'center', marginTop:16 }}>
                <button onClick={()=>{
                  const end = Date.now();
                  const timeMs = proximityStart ? end - proximityStart : 0;
            
                  const expected = (id)=> proxSpacing==='tight' ? (id<=8?'A':'B') : (id%2===0?'A':'B');
                  const entries = Array.from({length:16}, (_,i)=> i+1);
                  const matches = entries.reduce((acc,id)=> acc + ((proximityGroups[id]||'') === expected(id) ? 1 : 0), 0);
                  
                  const resultDiv = document.createElement('div');
                  resultDiv.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,0.9); display:flex; align-items:center; justify-content:center; z-index:2000; color:#fff';
                  resultDiv.innerHTML = `
                    <div style="background:#1a1a1a; border:1px solid #333; border-radius:16px; padding:24px; max-width:500px; text-align:center">
                      <h2 style="font-size:24px; margin-bottom:12px">Hasil Law of Proximity</h2>
                      <p>Waktu: <b>${timeMs}ms</b></p>
                      <p>Grouping benar: <b>${matches}/16</b></p>
                      <div style="background:#1a1a1a; border:1px solid #333; border-radius:12px; padding:16px; margin-top:20px">
                        <h4 style="font-size:18px; margin-bottom:8px; color:#8eb940">💡 Lesson Learned:</h4>
                        <p style="font-size:14px; line-height:1.5; opacity:0.9">
                          <strong>Law of Proximity terbukti:</strong> Elemen yang berdekatan dipersepsikan sebagai satu kelompok. 
                          Dalam desain UI, gunakan whitespace untuk memisahkan kelompok yang berbeda, 
                          letakkan elemen terkait berdekatan, dan gunakan visual grouping untuk meningkatkan scanability.
                        </p>
                      </div>
                      <button onclick="this.parentElement.parentElement.remove()" style="margin-top:20px; padding:10px 20px; border-radius:10px; background:#8eb940; color:#000; border:none; font-weight:bold">Tutup</button>
                    </div>
                  `;
                  document.body.appendChild(resultDiv);
                }} style={{ padding:'10px 16px', borderRadius:10, background:'#8eb940', color:'#000', border:'none', fontWeight:'bold' }}>Selesai</button>
                <button onClick={() => { setProximityGroups({}); setProximityStart(null); }} style={{ padding:'10px 16px', borderRadius:10, background:'#333', color:'#fff', border:'1px solid #555' }}>Reset</button>
                <button onClick={() => setGameType(null)} style={{ padding:'10px 16px', borderRadius:10, background:'#333', color:'#fff', border:'1px solid #555' }}>Tutup</button>
              </div>
            </div>
          </div>
        )}

        {/* Peak-End Rule Overlay */}
        {(gameType === 'peak-end') && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, color:'#fff' }}>
            <div className="overlay-card" style={{ background:'#1a1a1a', border:'1px solid #333', borderRadius:16, padding:24, width:600 }}>
              <h2 style={{fontSize:24, marginBottom:12}}>Isi quiz ini & nilai pengalamannya di akhir</h2>
              <p style={{opacity:.8, marginBottom:16}}>Flow {peakEndFlow}: {peakEndFlow === 'A' ? 'Mudah → Mudah → Akhir Menyenangkan' : 'Mudah → Sulit di Tengah → Mudah di Akhir'}</p>

              {peakEndStep === 0 && (
                <div>
                  <h3 style={{fontSize:20, marginBottom:12}}>Pertanyaan 1 (Mudah)</h3>
                  <p style={{marginBottom:16}}>Berapa 2 + 2?</p>
                  <div className="rating-row" style={{ display:'flex', gap:10, justifyContent:'center' }}>
                    {['3','4','5'].map((opt) => (
                      <button key={opt} onClick={() => setPeakEndStep(1)} style={{ padding:'10px 20px', borderRadius:10, background:'#333', color:'#fff', border:'1px solid #555' }}>{opt}</button>
                    ))}
                  </div>
                </div>
              )}

              {peakEndStep === 1 && (
                <div>
                  <h3 style={{fontSize:20, marginBottom:12}}>Pertanyaan 2 {peakEndFlow === 'B' ? '(Sulit)' : '(Mudah)'}</h3>
                  <p style={{marginBottom:16}}>{peakEndFlow === 'B' ? 'Hitung integral dari x² dx dari 0 sampai 3' : 'Berapa 5 × 3?'}</p>
                  <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
                    {(peakEndFlow === 'B' ? ['9','12','18'] : ['12','15','18']).map((opt) => (
                      <button key={opt} onClick={() => setPeakEndStep(2)} style={{ padding:'10px 20px', borderRadius:10, background:'#333', color:'#fff', border:'1px solid #555' }}>{opt}</button>
                    ))}
                  </div>
                </div>
              )}

              {peakEndStep === 2 && (
                <div>
                  <h3 style={{fontSize:20, marginBottom:12}}>Pertanyaan 3 (Akhir Menyenangkan)</h3>
                  <p style={{marginBottom:16}}>Apa warna favorit Anda?</p>
                  <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
                    {['Hijau','Biru','Ungu'].map((opt) => (
                      <button key={opt} onClick={() => setPeakEndStep(3)} style={{ padding:'10px 20px', borderRadius:10, background:'#333', color:'#fff', border:'1px solid #555' }}>{opt}</button>
                    ))}
                  </div>
                </div>
              )}

              {peakEndStep === 3 && (
                <div>
                  <h3 style={{fontSize:20, marginBottom:12}}>Rating Pengalaman</h3>
                  <p style={{marginBottom:16}}>Bagaimana pengalaman mengisi quiz ini? (1-10)</p>
                  <div style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:16 }}>
                    {Array.from({length:10}, (_,i) => (
                      <button key={i} onClick={() => setPeakEndRating(i+1)} style={{ padding:'8px 12px', borderRadius:8, background: peakEndRating === i+1 ? '#8eb940' : '#333', color: peakEndRating === i+1 ? '#000' : '#fff', border:'1px solid #555' }}>{i+1}</button>
                    ))}
                  </div>
                  {peakEndRating && (
                    <div>
                      <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                        <h4 style={{ fontSize: '18px', marginBottom: '8px', color: '#8eb940' }}>💡 Lesson Learned:</h4>
                        <p style={{ fontSize: '14px', lineHeight: '1.5', opacity: '0.9' }}>
                          <strong>Peak-End Rule terbukti:</strong> Pengalaman dinilai dari puncak emosional dan akhir, bukan rata-rata keseluruhan. 
                          Dalam desain UX, pastikan akhir pengalaman positif (confirmation, success message), 
                          minimalkan friction di tengah, dan ciptakan momen yang memorable.
                        </p>
                      </div>
                      <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
                        <button onClick={() => { setPeakEndFlow(peakEndFlow === 'A' ? 'B' : 'A'); setPeakEndStep(0); setPeakEndRating(null); }} style={{ padding:'10px 16px', borderRadius:10, background:'#333', color:'#fff', border:'1px solid #555' }}>Coba Flow {peakEndFlow === 'A' ? 'B' : 'A'}</button>
                        <button onClick={() => setGameType(null)} style={{ padding:'10px 16px', borderRadius:10, background:'#8eb940', color:'#000', border:'none', fontWeight:'bold' }}>Tutup</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Serial Position Effect Overlay */}
        {(gameType === 'serial-position') && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, color:'#fff' }}>
            <div className="overlay-card" style={{ background:'#1a1a1a', border:'1px solid #333', borderRadius:16, padding:24, width:600 }}>
              <h2 style={{fontSize:24, marginBottom:12}}>Lihat daftar sebentar — tuliskan sebanyak mungkin yang kamu ingat</h2>
              
              {serialShown ? (
                <div style={{ textAlign:'center' }}>
                  <p style={{marginBottom:16}}>Ingat kata-kata ini:</p>
                  <div className="serial-words" style={{ display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center' }}>
                    {serialWords.map((word, i) => (
                      <span key={i} style={{ padding:'8px 12px', background:'#333', borderRadius:8, fontSize:16 }}>{word}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{marginBottom:16}}>Tuliskan kata-kata yang Anda ingat (pisahkan dengan koma):</p>
                  <textarea 
                    value={serialInput} 
                    onChange={e => setSerialInput(e.target.value)}
                    style={{ width:'100%', height:100, padding:12, borderRadius:10, border:'1px solid #555', background:'#111', color:'#fff', marginBottom:16 }}
                    placeholder="Apple, Banana, Cherry..."
                  />
                  <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
                    <button onClick={() => {
                      const recalled = serialInput.split(',').map(s => s.trim().toLowerCase());
                      const positions = serialWords.map((word, i) => ({
                        position: i + 1,
                        word: word.toLowerCase(),
                        recalled: recalled.includes(word.toLowerCase())
                      }));
                      setSerialResult(positions);
                    }} style={{ padding:'10px 16px', borderRadius:10, background:'#8eb940', color:'#000', border:'none', fontWeight:'bold' }}>Submit</button>
                    <button onClick={() => setGameType(null)} style={{ padding:'10px 16px', borderRadius:10, background:'#333', color:'#fff', border:'1px solid #555' }}>Tutup</button>
                  </div>
                  
                  {serialResult && (
                    <div style={{ marginTop:16 }}>
                      <h3 style={{fontSize:18, marginBottom:8}}>Hasil Recall per Posisi:</h3>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:8, marginBottom:16 }}>
                        {serialResult.map((item, i) => (
                          <div key={i} style={{ padding:8, background: item.recalled ? '#8eb940' : '#333', borderRadius:8, textAlign:'center', fontSize:12 }}>
                            <div>{item.position}</div>
                            <div style={{ opacity:0.7 }}>{item.word}</div>
                            <div style={{ fontSize:10 }}>{item.recalled ? '✓' : '✗'}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '12px', padding: '16px' }}>
                        <h4 style={{ fontSize: '18px', marginBottom: '8px', color: '#8eb940' }}>💡 Lesson Learned:</h4>
                        <p style={{ fontSize: '14px', lineHeight: '1.5', opacity: '0.9' }}>
                          <strong>Serial Position Effect terbukti:</strong> Item di awal (primacy) dan akhir (recency) lebih mudah diingat. 
                          Dalam desain UI, letakkan informasi penting di awal dan akhir list, 
                          gunakan breadcrumb untuk navigasi, dan highlight item terakhir yang diakses.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Similarity Principle */}
        {(gameType === 'similarity') && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, color:'#fff' }}>
            <div className="overlay-card" style={{ background:'#1a1a1a', border:'1px solid #333', borderRadius:16, padding:24, width:600 }}>
              <h2 style={{fontSize:24, marginBottom:12}}>Kelompokkan item yang menurutmu fungsi/arti sama</h2>
              <p style={{opacity:.8, marginBottom:16}}>Drag item ke kelompok yang sesuai</p>
              
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16, marginBottom:20 }}>
                {similarityItems.map(item => (
                  <div key={item.id} style={{ 
                    padding:16, 
                    background: item.color === 'blue' ? '#2D9CDB' : item.color === 'red' ? '#E74C3C' : '#27AE60',
                    borderRadius: item.shape === 'round' ? 20 : 8,
                    textAlign:'center',
                    cursor:'pointer'
                  }}>
                    {item.type}
                  </div>
                ))}
              </div>
              
              <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
                <button onClick={() => setGameType(null)} style={{ padding:'10px 16px', borderRadius:10, background:'#333', color:'#fff', border:'1px solid #555' }}>Tutup</button>
              </div>
            </div>
          </div>
        )}
        {/* Detailed Explanation Section */}
        <section style={{maxWidth:'56rem', marginLeft:'auto', marginRight:'auto', textAlign:'left', padding:'-20px 20px 40px 20px', marginTop:'-280px'}}>
          <DetailedExplanation law={items[active]} />
        </section>
      </main>
    </>
  );
}

export default LawsPage;