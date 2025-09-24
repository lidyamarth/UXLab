import Image from 'next/image';
import Navbar from './components/Navbar'; 

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen w-full overflow-hidden p-4" style={{color:'#ffffff'}}>
        
      
        <Image
          src="/decor.svg"
          alt="Abstract background with orbital circles"
          layout="fill"
          className="absolute inset-0 z-0 object-cover opacity-50"
          style={{position:'absolute', inset:'0', zIndex:0, top:'25px'}}
        />
        
        <div style={{position:'absolute', left:'50%', top:'160px', transform:'translateX(-50%)', zIndex:10, width:'100%', maxWidth:'56rem', textAlign:'center'}}>
          <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
          <img
            src="/neraca.svg"
            alt="Ilustrasi Neraca Keadilan"
            width={260}
            height={260}
            className="mb-[24px]"
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

          <h1 className="max-w-4xl text-5xl font-regular text-white mb-[18px] text-center">
            Learn UX Laws by Doing
          </h1>
          <p className="text-2xl font-normal text-white text-center" style={{maxWidth:'620px', margin:'0 auto'}}>
            UX Lab adalah media pembelajaran interaktif untuk memahami prinsip-prinsip UX Laws. Rasakan langsung bagaimana hukum psikologi memengaruhi pengalaman pengguna.
          </p>
          </div>
        </div>

      </main>
    </>
  );
}