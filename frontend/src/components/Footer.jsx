import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16 bg-[#0B1120]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 group mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="4" fill="currentColor"/>
                  <path d="M12 8L15.46 6M12 16L15.46 18M12 8L8.54 6M12 16L8.54 18M15.46 13.99L18.92 15.99M8.54 13.99L5.08 15.99M15.46 10L18.92 8M8.54 10L5.08 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-100">AlgoMind</h2>
              </div>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
              Understand complex machine learning algorithms visually. Brought to you by Insightforge to make AI accessible to everyone.
            </p>
          </div>
          


          <div>
            <h3 className="text-sm font-semibold text-slate-100 uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Insightforge.ai. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 uppercase tracking-widest font-medium">Powered by Insightforge</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
