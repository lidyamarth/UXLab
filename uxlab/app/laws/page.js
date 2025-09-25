"use client";
import { useEffect, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';

export default function LawsPage() {
  const baseItems = useMemo(() => ([
    { key: 'hick', title: "Hick's Law", desc: 'Waktu untuk mengambil keputusan bertambah seiring banyaknya dan rumitnya pilihan.', img: '/globe.svg', bg: '#2F80ED' },
    { key: 'fitts', title: "Fitts's Law", desc: 'Waktu untuk mencapai target dipengaruhi oleh ukuran dan jaraknya.', img: '/file.svg', bg: '#E74C3C' },
    { key: 'proximity', title: 'Law of Proximity', desc: 'Elemen yang berdekatan dipersepsikan memiliki keterkaitan.', img: '/window.svg', bg: '#F2C94C' },
    { key: 'similarity', title: 'Law of Similarity', desc: 'Objek mirip dianggap sebagai satu grup visual.', img: '/next.svg', bg: '#27AE60' },
    { key: 'prägnanz', title: 'Law of Prägnanz', desc: 'Manusia menyederhanakan bentuk kompleks menjadi pola yang lebih mudah.', img: '/UXLab.svg', bg: '#9B51E0' },
  ]), []);

  const items = useMemo(() => Array.from({ length: 20 }, (_, i) => {
    const b = baseItems[i % baseItems.length];
    return { ...b, key: `${b.key}-${i}` };
  }), [baseItems]);

  const [active, setActive] = useState(0);
  const [isPaused, setPaused] = useState(false);

  const gapX = 335; 
  const curvePow = 2.0; 
  const curveMul = 60; 
  const half = items.length / 2;

  const handlePrev = () => setActive(prev => (prev - 1 + items.length) % items.length);
  const handleNext = () => setActive(prev => (prev + 1) % items.length);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setActive(prev => (prev + 1) % items.length);
    }, 3000);
    return () => clearInterval(id);
  }, [isPaused, items.length]);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen w-full" style={{color:'#ffffff', padding:0, overflowX:'hidden'}}>
        <style>{`
          .laws-frame { position: relative; width: 100%; max-width: 1440px; height: 1024px; margin: 0 auto; overflow: hidden; padding: 0; }
          .carousel-stage { position: absolute; left: 50%; top: 220px; transform: translateX(-50%); width: 100%; max-width: 1440px; height: 650px; pointer-events: none; }
          .card { position: absolute; width: 230px; height: 230px; border-radius: 32px; overflow: hidden; will-change: transform, opacity, filter; }
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
          .edge-mask { position: absolute; top: 0; bottom: 0; width: 48px; pointer-events: none; z-index: 30; }
          .edge-mask.left { left: 0; background: linear-gradient(90deg, #0b0b0b 0%, rgba(11,11,11,0.92) 60%, rgba(11,11,11,0) 100%); }
          .edge-mask.right { right: 0; background: linear-gradient(270deg, #0b0b0b 0%, rgba(11,11,11,0.92) 60%, rgba(11,11,11,0) 100%); }
        `}</style>

        <div className="laws-frame" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="edge-mask left" />
          <div className="edge-mask right" />
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

          <div style={{position:'absolute', left:'50%', top:'360px', transform:'translateX(-50%)', width:'min(100%, 980px)', display:'flex', alignItems:'center', justifyContent:'center', gap:'28px', pointerEvents:'none'}}>
            <button onClick={handlePrev} aria-label="Previous" className="nav-btn" style={{pointerEvents:'all'}}>
              ‹
            </button>
            <div style={{width:'700px'}} className="fade-slide-in">
              <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'12px', textAlign:'center'}}>
                <h1 className="title-in" style={{fontSize:'40px', fontWeight:500}}>{items[active].title}</h1>
                <p className="desc-in" style={{fontSize:'26px'}}>{items[active].desc}</p>
                <button className="btn-in" style={{marginTop:'8px', width:'207px', padding:'10px 24px', borderRadius:'14px', background:'#8eb940', color:'#081f5c', fontWeight:700, boxShadow:'4px 4px 20px rgba(255,255,255,0.20), inset 0 4px 24px rgba(232,244,98,1), inset 4px 0 24px rgba(232,244,98,1)', outline:'4px solid rgba(255,255,255,0.1)'}}>
                  Simulasi
                </button>
              </div>
            </div>
            <button onClick={handleNext} aria-label="Next" className="nav-btn" style={{pointerEvents:'all'}}>
              ›
            </button>
          </div>
        </div>

        </div>
        <section style={{maxWidth:'56rem', marginLeft:'auto', marginRight:'auto', textAlign:'left'}}>
          <h2 style={{fontSize:'28px', fontWeight:600, marginBottom:'12px'}}>Penjelasan Singkat</h2>
          <p style={{opacity:.9, lineHeight:1.7, marginBottom:'12px'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam at mauris non dolor laoreet sagittis. Aenean ut tristique justo. Maecenas vitae hendrerit massa. Sed faucibus, urna in congue convallis, arcu nisi viverra magna, a ultricies lorem elit sed sem.</p>
          <p style={{opacity:.9, lineHeight:1.7, marginBottom:'12px'}}>Phasellus at ipsum vel ligula dictum luctus. Cras vulputate volutpat posuere. Duis at dictum lorem, quis volutpat velit. Sed in elit a nunc gravida malesuada in nec lacus. Donec at arcu sit amet felis commodo consequat.</p>
          <p style={{opacity:.9, lineHeight:1.7}}>Suspendisse potenti. Integer sed velit urna. Integer vitae porttitor mi. Cras sit amet justo sed sapien scelerisque aliquet a in justo.</p>
        </section>
      </main>
    </>
  );
}




