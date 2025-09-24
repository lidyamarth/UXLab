import Navbar from '../components/Navbar';

export default function LawsPage() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen w-full p-4" style={{color:'#ffffff'}}>
        <div style={{position:'absolute', left:'50%', top:'271px', transform:'translateX(-50%)', zIndex:10, width:'100%', maxWidth:'56rem', textAlign:'center'}}>
          <h1 className="text-5xl font-medium" style={{marginBottom:'18px'}}>Laws</h1>
          <p className="text-2xl">Desain halaman Laws belum tersedia. Coming soon.</p>
        </div>
      </main>
    </>
  );
}


