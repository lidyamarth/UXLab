import Image from 'next/image';
import Navbar from './components/Navbar'; 

const HomePage = () => {
  // console.log('HomePage rendered');
  
  const containerStyles = {
    position:'absolute', 
    left:'50%', 
    top:'160px', 
    transform:'translateX(-50%)', 
    zIndex:10, 
    width:'100%', 
    maxWidth:'56rem', 
    textAlign:'center'
  };
  
  const imageStyles = {
    display:'block',
    imageRendering:'-webkit-optimize-contrast',
    WebkitBackfaceVisibility:'hidden',
    backfaceVisibility:'hidden',
    transform:'translateZ(0)'
  };
  
  const flexWrapper = {
    display:'flex', 
    flexDirection:'column', 
    alignItems:'center'
  };
  
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen w-full overflow-hidden p-4" style={{color:'#ffffff'}}>
        <style>{`
          @keyframes fadeUp {
            from { 
              opacity: 0; 
              transform: translate(-50%, calc(-50% + 32px)) scale(0.985); 
            }
            to { 
              opacity: 1; 
              transform: translate(-50%, -50%) scale(1); 
            }
          }
          @keyframes riseIn {
            from { 
              opacity: 0; 
              transform: translateY(28px); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0); 
            }
          }
          .enter-orbital { 
            animation: fadeUp 900ms cubic-bezier(0.16, 1, 0.3, 1) both; 
          }
          .enter-stack { 
            animation: riseIn 700ms cubic-bezier(0.16, 1, 0.3, 1) both; 
          }
          .enter-stack-2 { 
            animation: riseIn 900ms cubic-bezier(0.16, 1, 0.3, 1) both; 
          }
          .enter-stack-3 { 
            animation: riseIn 1000ms cubic-bezier(0.16, 1, 0.3, 1) both; 
          }
          @media (prefers-reduced-motion: reduce) {
            .enter-orbital, .enter-stack, .enter-stack-2, .enter-stack-3 { 
              animation: none !important; 
            }
          }
        `}</style>
        
      
        <img
          src="/decor.svg"
          alt="Orbital decor"
          className="enter-orbital"
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
        />
        
        <div style={containerStyles}>
          <div style={flexWrapper}>
            <img
              src="/interaction.webp"
              alt="Ilustrasi Neraca Keadilan"
              width={260}
              height={260}
              className="mb-[24px] enter-stack"
              style={imageStyles}
              loading="eager"
              decoding="sync"
              draggable={false}
            />

            <h1 
              className="max-w-4xl text-5xl text-white mb-[4px] text-center enter-stack-2" 
              style={{fontWeight: 500}}
            >
              Virtual Interactive Learning on UX Laws
            </h1>
            <p 
              className="text-2xl font-normal text-white text-center enter-stack-3" 
              style={{maxWidth:'550px', margin:'0 auto'}}
            >
              A space where you don’t just read theories, but truly experience how design psychology shapes every interaction.
            </p>
          </div>
        </div>

      </main>
    </>
  );
};

export default HomePage;