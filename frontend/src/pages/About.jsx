export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 animate-fade-in">
      <div className="text-center mb-16 animate-slide-up">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-100 mb-6">About Insightforge</h1>
        <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full"></div>
      </div>

      <div className="space-y-12 animate-slide-up delay-100">
        
        {/* Mission Card */}
        <div className="card-glass border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
          <div className="flex gap-4 items-start">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🌍</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100 mb-4">Our Mission</h2>
              <p className="text-slate-300 leading-relaxed text-lg">
                Insightforge is built to simplify the world of AI, automation, machine learning, and data.
              </p>
              <p className="text-slate-300 leading-relaxed text-lg mt-4">
                My goal is to make complex technology easy to understand through short guides, quick insights, and practical tutorials that anyone can learn from.
              </p>
            </div>
          </div>
        </div>

        {/* Founder Card */}
        <div className="card bg-slate-800/50 border-slate-700/50">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 p-1 flex-shrink-0 shadow-xl">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-4xl">
                👨‍💻
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">The Founder</h2>
              <h3 className="text-indigo-400 font-medium mb-4 uppercase tracking-wider text-sm">Mohit Rathod</h3>
              <p className="text-slate-400 leading-relaxed">
                Insightforge is run by <strong className="text-slate-200">Mohit Rathod</strong>, a data scientist and AI enthusiast who is exploring, building, and sharing knowledge while growing his AI automation brand <strong>Insightforge.ai</strong>.
              </p>
              <p className="text-slate-400 leading-relaxed mt-4">
                This tool is created for learners, developers, creators, and anyone who wants to intuitively lock down ML algorithms visually without getting bogged down by purely theoretical math.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-slate-200 mb-2">Ready to explore?</h2>
          <p className="text-slate-400 mb-6">Head back to the visualizer and tackle your first algorithm.</p>
          <a href="/" className="btn-accent inline-block px-8">Go to Visualizer</a>
        </div>
      </div>
    </div>
  )
}
