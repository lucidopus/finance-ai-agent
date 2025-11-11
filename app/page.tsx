export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 flex justify-between items-center p-6 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">VerifAI</h1>
          <p className="text-sm text-gray-400 hidden md:block">AI-Powered Financial Intelligence</p>
        </div>
        <nav className="hidden md:flex space-x-8">
          <a href="#about" className="text-gray-300 hover:text-white transition-colors duration-300 font-medium">About</a>
          <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-300 font-medium">Features</a>
          <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors duration-300 font-medium">How It Works</a>
          <a href="#pricing" className="text-gray-300 hover:text-white transition-colors duration-300 font-medium">Pricing</a>
        </nav>
        <div className="flex space-x-4">
          <a href="/auth/signin" className="cursor-pointer rounded-lg px-4 py-2 bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300 inline-block font-medium">Sign In</a>
          <a href="/auth/signup" className="cursor-pointer rounded-lg px-4 py-2 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300 inline-block font-medium shadow-lg">Sign Up</a>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center py-24 px-6 bg-linear-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-extrabold mb-6 leading-tight bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">The Smarter Way to Manage Finances</h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-300 leading-relaxed">
            VerifAI transforms your financial data into intelligent insights. Get AI-powered budgeting, investment advice, and risk analysis that optimize your wealth.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a href="/auth/signup" className="cursor-pointer rounded-lg px-10 py-4 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300 inline-block text-center font-semibold text-lg shadow-lg hover:shadow-xl">Start Free Trial</a>
            <a href="#features" className="cursor-pointer rounded-lg px-10 py-4 bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300 inline-block text-center font-semibold text-lg border border-gray-700">See Features</a>
          </div>
          <p className="mt-6 text-sm text-gray-400">Trusted by 10,000+ users • No credit card required</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 bg-gray-900/50 backdrop-blur-sm border-y border-gray-800/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
          <div className="p-6 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors duration-300 border border-gray-700/50">
            <div className="text-5xl font-bold mb-3 bg-linear-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">10,000+</div>
            <p className="text-gray-300 font-medium">Active Users</p>
          </div>
          <div className="p-6 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors duration-300 border border-gray-700/50">
            <div className="text-5xl font-bold mb-3 bg-linear-to-r from-green-400 to-green-300 bg-clip-text text-transparent">$2M+</div>
            <p className="text-gray-300 font-medium">Wealth Optimized</p>
          </div>
          <div className="p-6 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors duration-300 border border-gray-700/50">
            <div className="text-5xl font-bold mb-3 bg-linear-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">99.9%</div>
            <p className="text-gray-300 font-medium">Accuracy Rate</p>
          </div>
          <div className="p-6 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors duration-300 border border-gray-700/50">
            <div className="text-5xl font-bold mb-3 bg-linear-to-r from-red-400 to-red-300 bg-clip-text text-transparent">24/7</div>
            <p className="text-gray-300 font-medium">AI Support</p>
          </div>
        </div>
      </section>

      {/* Built for better financial decisions */}
      <section className="py-20 px-6 bg-gray-900/50 backdrop-blur-sm text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6 bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">Built for better financial decisions</h2>
          <p className="text-xl text-gray-300">Designed for anyone who wants to optimize their finances</p>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-20 px-6 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-10 bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">Our Approach</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-800/30 rounded-lg p-8 border border-gray-700/50">
              <h3 className="text-2xl font-semibold mb-4 text-red-400">The Problem</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Passive management doesn&apos;t create wealth. Financial data is everywhere, but informed decisions remain rare. Managing finances alone doesn&apos;t translate to optimization.
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-lg p-8 border border-gray-700/50">
              <h3 className="text-2xl font-semibold mb-4 text-green-400">Our Solution</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                VerifAI bridges this gap with intelligent analysis. Transform any financial data into personalized strategies—automatically generated portfolios, risk assessments, and budget plans that drive real growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 px-6 bg-gray-900/50 backdrop-blur-sm text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-10 bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">Our Mission</h2>
          <p className="text-2xl mb-8 text-gray-200">Turn passive financial management into active wealth building.</p>
          <p className="text-lg text-gray-300 mb-8">We combine AI technology with proven financial strategies to help anyone optimize their finances faster.</p>
          <blockquote className="text-3xl font-semibold text-white italic">&quot;Invest once. Thrive completely.&quot;</blockquote>
        </div>
      </section>

      {/* Why VerifAI */}
      <section className="py-20 px-6 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">Why VerifAI</h2>
          <p className="text-xl text-gray-300 mb-16">Purpose-built for financial management with research-backed strategies</p>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-8 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors duration-300 border border-gray-700/50">
              <h3 className="text-2xl font-bold mb-6 text-blue-400">Finance-First AI</h3>
              <p className="text-gray-300 leading-relaxed">Trained specifically for financial data. Identifies trends, risks, and opportunities—not just generic analysis.</p>
            </div>
            <div className="p-8 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors duration-300 border border-gray-700/50">
              <h3 className="text-2xl font-bold mb-6 text-green-400">Economic Science Foundation</h3>
              <p className="text-gray-300 leading-relaxed">Built on proven financial principles: diversification, risk management, and compound growth. Evidence-based techniques that improve returns by up to 200%.</p>
            </div>
            <div className="p-8 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors duration-300 border border-gray-700/50">
              <h3 className="text-2xl font-bold mb-6 text-purple-400">User-Centered Design</h3>
              <p className="text-gray-300 leading-relaxed">Every feature addresses real financial challenges. Built with continuous user feedback to ensure tools are practical, effective, and intuitive.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-6 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">Key Features</h2>
          <p className="text-xl text-gray-300 mb-16">Fast, free, and works with any financial data</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50 transition-shadow duration-300">
              <div className="text-5xl font-bold mb-4 text-blue-400">&lt;60s</div>
              <p className="font-semibold mb-2 text-gray-200">Processing Time</p>
              <p className="text-sm text-gray-400">From data to insights in under a minute</p>
            </div>
            <div className="p-6 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50 transition-shadow duration-300">
              <div className="text-5xl font-bold mb-4 text-green-400">100%</div>
              <p className="font-semibold mb-2 text-gray-200">Free to Start</p>
              <p className="text-sm text-gray-400">No credit card required, ever</p>
            </div>
            <div className="p-6 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50 transition-shadow duration-300">
              <div className="text-5xl font-bold mb-4 text-purple-400">5</div>
              <p className="font-semibold mb-2 text-gray-200">Financial Modes</p>
              <p className="text-sm text-gray-400">Budgeting, investing, analysis, alerts, & AI chat</p>
            </div>
            <div className="p-6 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50 transition-shadow duration-300">
              <div className="text-5xl font-bold mb-4 text-red-400">Any</div>
              <p className="font-semibold mb-2 text-gray-200">Financial Data</p>
              <p className="text-sm text-gray-400">Works with accounts, transactions, markets—anything financial</p>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Financial Suite */}
      <section className="py-20 px-6 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-6 bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">Complete Financial Suite</h2>
          <p className="text-xl text-center text-gray-300 mb-16">AI-generated financial tools from your data</p>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="p-8 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors duration-300 border border-gray-700/50">
              <h3 className="text-3xl font-bold mb-6 text-blue-400">Smart Budgeting</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">Automatically generated from spending patterns. Integrated optimization algorithms maximize savings for long-term wealth.</p>
              <p className="text-sm font-semibold text-gray-400">Optimization built-in</p>
            </div>
            <div className="p-8 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors duration-300 border border-gray-700/50">
              <h3 className="text-3xl font-bold mb-6 text-green-400">Investment Analysis</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">Portfolio recommendations with risk assessment. Identifies opportunities and tracks performance over time.</p>
              <p className="text-sm font-semibold text-gray-400">Risk assessment & tracking</p>
            </div>
            <div className="p-8 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors duration-300 border border-gray-700/50">
              <h3 className="text-3xl font-bold mb-6 text-purple-400">Transaction Insights</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">Categorized transactions with direct links. Click any category to analyze spending. Searchable and exportable.</p>
              <p className="text-sm font-semibold text-gray-400">One-click analysis</p>
            </div>
            <div className="p-8 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-colors duration-300 border border-gray-700/50">
              <h3 className="text-3xl font-bold mb-6 text-red-400">AI Financial Advisor</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">Context-aware Q&A based on your finances. Ask questions, get advice, and clarify strategies without manual research. Available 24/7.</p>
              <p className="text-sm font-semibold text-gray-400">Context-aware assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-900/50 backdrop-blur-sm" id="how-it-works">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">How It Works</h2>
          <p className="text-xl text-gray-300 mb-16">Simple 3-step process</p>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="p-8 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50 transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">1</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-200">Connect Data</h3>
              <p className="text-gray-300">Link your financial accounts securely.</p>
            </div>
            <div className="p-8 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50 transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">2</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-200">AI Processing</h3>
              <p className="text-gray-300">Insights generated in under 60 seconds.</p>
            </div>
            <div className="p-8 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50 transition-shadow duration-300">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">3</div>
              <h3 className="text-2xl font-bold mb-4 text-gray-200">Optimize & Grow</h3>
              <p className="text-gray-300">Manage with intelligent budgeting and investing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-6 bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">What Our Users Say</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-8 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50 transition-shadow duration-300">
              <p className="text-lg mb-6 text-gray-300 italic">&quot;VerifAI completely changed how I manage my investments. The AI insights are spot-on and saved me thousands.&quot;</p>
              <p className="font-bold text-gray-200">- Sarah J., Investor</p>
            </div>
            <div className="p-8 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50 transition-shadow duration-300">
              <p className="text-lg mb-6 text-gray-300 italic">&quot;The budgeting tools are incredible. I finally have control over my spending thanks to VerifAI.&quot;</p>
              <p className="font-bold text-gray-200">- Mike T., Entrepreneur</p>
            </div>
            <div className="p-8 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50 transition-shadow duration-300">
              <p className="text-lg mb-6 text-gray-300 italic">&quot;Risk analysis that actually makes sense. VerifAI helped me avoid a major financial mistake.&quot;</p>
              <p className="font-bold text-gray-200">- Emily R., Financial Advisor</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 bg-gray-900/50 backdrop-blur-sm" id="pricing">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">Pricing That Makes Sense</h2>
          <p className="text-xl text-gray-300 mb-16">Start free. Upgrade when you&apos;re ready.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50 transition-shadow duration-300">
              <h3 className="text-3xl font-bold mb-4 text-gray-200">Free</h3>
              <div className="text-5xl font-bold mb-4 text-gray-200">$0</div>
              <p className="mb-8 text-gray-400">Perfect for getting started</p>
              <ul className="text-left mb-8 space-y-3">
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span><span className="text-gray-300">5 accounts per month</span></li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span><span className="text-gray-300">Basic budgeting & analysis</span></li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span><span className="text-gray-300">Progress tracking</span></li>
              </ul>
              <a href="/auth/signup" className="cursor-pointer rounded-lg w-full py-3 bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all duration-300 inline-block text-center font-semibold">Get Started Free</a>
            </div>
            <div className="p-8 rounded-xl bg-linear-to-br from-blue-600 to-blue-500 text-white shadow-lg hover:shadow-xl transition-shadow duration-300 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full font-bold text-sm">Most Popular</div>
              <h3 className="text-3xl font-bold mb-4">Pro</h3>
              <div className="text-5xl font-bold mb-4">$9.99/month</div>
              <p className="mb-8 text-blue-100">For serious investors</p>
              <ul className="text-left mb-8 space-y-3">
                <li className="flex items-center"><span className="text-green-300 mr-2">✓</span><span className="text-blue-100">Everything in Free +</span></li>
                <li className="flex items-center"><span className="text-green-300 mr-2">✓</span><span className="text-blue-100">Unlimited accounts</span></li>
                <li className="flex items-center"><span className="text-green-300 mr-2">✓</span><span className="text-blue-100">Ask Advisor - AI-powered Q&A</span></li>
                <li className="flex items-center"><span className="text-green-300 mr-2">✓</span><span className="text-blue-100">Custom portfolio creation</span></li>
                <li className="flex items-center"><span className="text-green-300 mr-2">✓</span><span className="text-blue-100">Priority support & exports</span></li>
              </ul>
              <a href="/auth/signup" className="cursor-pointer rounded-lg w-full py-3 bg-white text-blue-600 hover:bg-gray-100 transition-all duration-300 inline-block text-center font-semibold">Get Pro Plan</a>
            </div>
            <div className="p-8 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:bg-gray-800/50 transition-shadow duration-300">
              <h3 className="text-3xl font-bold mb-4 text-gray-200">Enterprise</h3>
              <div className="text-5xl font-bold mb-4 text-gray-200">Custom</div>
              <p className="mb-8 text-gray-400">For organizations</p>
              <ul className="text-left mb-8 space-y-3">
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span><span className="text-gray-300">Everything in Pro +</span></li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span><span className="text-gray-300">Unlimited team members</span></li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span><span className="text-gray-300">SSO & admin controls</span></li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span><span className="text-gray-300">Custom integrations & API</span></li>
                <li className="flex items-center"><span className="text-green-400 mr-2">✓</span><span className="text-gray-300">Dedicated support</span></li>
              </ul>
              <a href="mailto:sales@verifai.com" className="cursor-pointer rounded-lg w-full py-3 bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all duration-300 inline-block text-center font-semibold">Contact Sales</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-linear-to-r from-gray-900 to-black text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">Ready to Transform Your Finances?</h2>
          <p className="text-xl mb-10 text-gray-300">Join 10,000+ users who are already optimizing their wealth with VerifAI. Start your free trial today!</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a href="/auth/signup" className="cursor-pointer rounded-lg px-10 py-4 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300 inline-block text-center font-semibold text-lg shadow-lg hover:shadow-xl">Start Free Trial</a>
            <a href="#pricing" className="cursor-pointer rounded-lg px-10 py-4 bg-gray-800/50 text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-300 inline-block text-center font-semibold text-lg border border-gray-700">View Pricing</a>
          </div>
          <p className="mt-6 text-sm text-gray-400">No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 px-6 bg-gray-900/50 backdrop-blur-sm text-center border-t border-gray-800/50">
        <p className="text-lg text-gray-300 mb-8">Trusted by leading financial institutions</p>
        <div className="flex justify-center space-x-12">
          <div className="text-xl font-bold text-gray-200">SECURE</div>
          <div className="text-xl font-bold text-gray-200">ENCRYPTED</div>
          <div className="text-xl font-bold text-gray-200">COMPLIANT</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-black text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center space-x-8 mb-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 font-medium">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 font-medium">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 font-medium">Contact</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 font-medium">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300 font-medium">GitHub</a>
          </div>
          <p className="text-gray-500">&copy; 2025 VerifAI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
