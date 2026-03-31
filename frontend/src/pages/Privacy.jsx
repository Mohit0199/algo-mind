export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 animate-fade-in">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-100 mb-4">Privacy Policy</h1>
        <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-8 text-slate-300 leading-relaxed card">
        <section>
          <h2 className="text-xl font-bold text-slate-100 mb-4">1. Data Collection</h2>
          <p>
            AlgoMind values your privacy. We do not require you to create an account, log in, or provide personal identifiable information to use the primary algorithm visualization features. 
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-100 mb-4">2. How We Handle Inputs</h2>
          <p>
            When you enter an algorithm name into the search bar, that text string is sent to our backend servers and then processed by a cloud intelligence model (Ollama) to generate the explanation. We do not log these search terms against an identifiable user.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-100 mb-4">3. Local Storage</h2>
          <p>
            We may use temporary browser storage (like session storage) to maintain your state across a single session, ensuring a smooth experience when navigating between the home page and explanation results.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-100 mb-4">4. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy, please contact us through the official Insightforge channels.
          </p>
        </section>
      </div>
    </div>
  )
}
