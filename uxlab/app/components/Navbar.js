"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isLaws = pathname === '/laws';
  return (
    <header style={{position:'absolute', left:'50%', top:'12px', transform:'translateX(-50%)', zIndex:20, width:'100%', maxWidth:'72rem'}}>
      <style>{`header nav a:hover { color: #9DA4A8 !important; }`}</style>
      <nav style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'120px', width:'100%'}}>
        <Link href="/" style={{color:'#ffffff', textDecoration:'none', fontSize:'16px', fontWeight: isHome ? 500 : 400, fontStyle: isHome ? 'italic' : 'normal'}}>
          Home
        </Link>
        
        <Link href="/" style={{display:'inline-flex', alignItems:'center', justifyContent:'center'}}>
          <img
            src="/UXLab.webp"
            alt="UXLab Logo"
            height={36}
            style={{width:'auto', display:'block'}}
            draggable={false}
          />
        </Link>
        
        <Link href="/laws" style={{color:'#ffffff', textDecoration:'none', fontSize:'16px', fontWeight: isLaws ? 500 : 400, fontStyle: isLaws ? 'italic' : 'normal'}}>
          Laws
        </Link>
      </nav>
    </header>
  );
};

export default Navbar;