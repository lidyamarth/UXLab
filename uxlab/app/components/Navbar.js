import Link from 'next/link';

const Navbar = () => {
  return (
    <header style={{position:'absolute', left:'50%', top:'20px', transform:'translateX(-50%)', zIndex:20, width:'100%', maxWidth:'72rem'}}>
      <style>{`header nav a:hover { color: #9DA4A8 !important; }`}</style>
      <nav style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'120px', width:'100%'}}>
        <Link href="/" style={{color:'#ffffff', textDecoration:'none', fontSize:'20px', fontWeight:400}}>
          Home
        </Link>
        
        <Link href="/" style={{display:'inline-flex', alignItems:'center', justifyContent:'center'}}>
          <img
            src="/UXLab.webp"
            alt="UXLab Logo"
            height={45}
            style={{width:'auto', display:'block'}}
            draggable={false}
          />
        </Link>
        
        <Link href="/laws" style={{color:'#ffffff', textDecoration:'none', fontSize:'20px', fontWeight:400}}>
          Laws
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;