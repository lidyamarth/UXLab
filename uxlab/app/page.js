import Image from 'next/image';
import Navbar from './components/Navbar'; 

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen w-full overflow-hidden p-4" style={{color:'#ffffff'}}>
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translate(-50%, calc(-50% + 32px)) scale(0.985); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
          @keyframes riseIn {
            from { opacity: 0; transform: translateY(28px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .enter-orbital { animation: fadeUp 900ms cubic-bezier(0.16, 1, 0.3, 1) both; }
          .enter-stack { animation: riseIn 700ms cubic-bezier(0.16, 1, 0.3, 1) both; }
          .enter-stack-2 { animation: riseIn 900ms cubic-bezier(0.16, 1, 0.3, 1) both; }
          .enter-stack-3 { animation: riseIn 1000ms cubic-bezier(0.16, 1, 0.3, 1) both; }
          @media (prefers-reduced-motion: reduce) {
            .enter-orbital, .enter-stack, .enter-stack-2, .enter-stack-3 { animation: none !important; }
          }
        `}</style>
        
      
        <img
          src="/decor.svg"
          alt="Orbital decor"
          style={{
            position:'absolute',
            left:'50%',
            top:'50%',
            transform:'translate(-50%, -50%)',
            width:'min(980px, 70vw)',
            height:'auto',
            opacity:0.8,
            zIndex:0,
            pointerEvents:'none'
          }}
          className="enter-orbital"
        />
        
        <div style={{position:'absolute', left:'50%', top:'160px', transform:'translateX(-50%)', zIndex:10, width:'100%', maxWidth:'56rem', textAlign:'center'}}>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
          <img
            src="/neraca.webp"
            alt="Ilustrasi Neraca Keadilan"
            width={260}
            height={260}
            className="mb-[24px] enter-stack"
            style={{
              display:'block',
              imageRendering:'-webkit-optimize-contrast',
              WebkitBackfaceVisibility:'hidden',
              backfaceVisibility:'hidden',
              transform:'translateZ(0)'
            }}
            loading="eager"
            decoding="sync"
            draggable={false}
          />

          <h1 className="max-w-4xl text-5xl text-white mb-[4px] text-center enter-stack-2" style={{fontWeight: 500}}>
            Learn UX Laws by Doing
          </h1>
          <p className="text-2xl font-normal text-white text-center enter-stack-3" style={{maxWidth:'550px', margin:'0 auto'}}>
            UX Lab adalah media pembelajaran interaktif untuk memahami prinsip-prinsip UX Laws. Rasakan langsung bagaimana hukum psikologi memengaruhi pengalaman pengguna.
          </p>
          </div>
        </div>

      </main>
    </>
  );
}