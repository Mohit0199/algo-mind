export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 animate-fade-in">
      <div className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-100 mb-4">Terms & Conditions</h1>
        <p className="text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="space-y-8 text-slate-300 leading-relaxed card">
        <section>
          <h2 className="text-xl font-bold text-slate-100 mb-4">1. Acceptance of Terms</h2>
          <p>
            By accessing and using AlgoMind (powered by Insightforge), you accept and agree to be bound by the terms and provisions of this agreement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-100 mb-4">2. Description of Service</h2>
          <p>
            AlgoMind is an educational tool designed to help users visualize and understand machine learning algorithms. We provide interactive diagrams and AI-generated explanations for informational purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-100 mb-4">3. Accuracy of Information</h2>
          <p>
            While we strive to provide accurate explanations of technical concepts, our content is AI-generated and simplified for educational purposes. We do not guarantee 100% technical accuracy, and the tool should be used as a supplementary learning resource, not a definitive academic source.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-100 mb-4">4. Intellectual Property</h2>
          <p>
            The design, branding (including the name "AlgoMind" and "Insightforge"), and structure of this application are the property of Mohit Rathod and Insightforge.ai. 
          </p>
        </section>
      </div>
    </div>
  )
}
