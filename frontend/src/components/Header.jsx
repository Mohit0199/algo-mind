import { Link, useLocation } from 'react-router-dom'

export default function Header() {
  const location = useLocation()

  return (
    <header className="border-b border-border sticky top-0 z-50 bg-[#0F172A]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 group">
          <div className="relative">
            {/* Custom SVG Logo for AlgoMind */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.7)] transition-shadow duration-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Brain / Network / Nodes / Lens Motif */}
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4Z" fill="white" opacity="0.3"/>
                <circle cx="12" cy="12" r="4" fill="white"/>
                <path d="M12 8L15.46 6M12 16L15.46 18M12 8L8.54 6M12 16L8.54 18M15.46 13.99L18.92 15.99M8.54 13.99L5.08 15.99M15.46 10L18.92 8M8.54 10L5.08 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text leading-none group-hover:brightness-110 transition-all">AlgoMind</h1>
            <p className="text-[10px] text-muted uppercase tracking-wider mt-0.5">powered by <span className="text-indigo-400">insightforge</span></p>
          </div>
        </a>
        <nav className="flex items-center gap-6">
          <a href="/" className={`text-sm font-medium transition-colors hover:text-indigo-400 ${location.pathname === '/' ? 'text-indigo-400' : 'text-slate-300'}`}>
            Home
          </a>
          <Link to="/about" className={`text-sm font-medium transition-colors hover:text-indigo-400 ${location.pathname === '/about' ? 'text-indigo-400' : 'text-slate-300'}`}>
            About Us
          </Link>
          {/* We removed the LLM model name from here as requested */}
        </nav>
      </div>
    </header>
  )
}
