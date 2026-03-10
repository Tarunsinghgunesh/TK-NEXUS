'use client';

import Link from 'next/link';
import { ArrowRight, Zap, BarChart3, MessageSquare, Rocket } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-white flex items-center gap-2">
          <Rocket size={32} className="text-purple-400" />
          TK Nexus
        </div>
        <div className="flex gap-6">
          <Link href="/login" className="text-white hover:text-purple-300 transition">
            Login
          </Link>
          <Link 
            href="/signup" 
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
          >
            Signup
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Run Your Entire Business
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              With One AI
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Generate leads, automate outreach, build websites, and scale your business - all powered by AI. Perfect for gyms, coaching, salons, restaurants, and agencies.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              href="/signup" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 transition font-semibold"
            >
              Get Started Free <ArrowRight size={20} />
            </Link>
            <button className="border border-purple-400 text-purple-400 hover:bg-purple-400/10 px-8 py-3 rounded-lg transition font-semibold">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/10 backdrop-blur p-8 rounded-xl border border-white/20 hover:border-white/40 transition">
            <Zap className="text-yellow-400 mb-4" size={40} />
            <h3 className="text-xl font-bold text-white mb-3">Lead Finder AI</h3>
            <p className="text-gray-300">
              Automatically find 100+ business leads from Google Maps, Instagram, and LinkedIn in minutes.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur p-8 rounded-xl border border-white/20 hover:border-white/40 transition">
            <MessageSquare className="text-blue-400 mb-4" size={40} />
            <h3 className="text-xl font-bold text-white mb-3">Outreach Automation</h3>
            <p className="text-gray-300">
              Send personalized messages via email, WhatsApp, Instagram, and SMS automatically.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur p-8 rounded-xl border border-white/20 hover:border-white/40 transition">
            <BarChart3 className="text-green-400 mb-4" size={40} />
            <h3 className="text-xl font-bold text-white mb-3">Analytics Dashboard</h3>
            <p className="text-gray-300">
              Get real-time insights and AI-powered recommendations to grow your business faster.
            </p>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-32">
          <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
            Simple, Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                name: 'Starter', 
                price: '₹2,999', 
                leads: '100 leads/month',
                features: ['Email & WhatsApp', 'Basic Analytics', 'Email Support']
              },
              { 
                name: 'Professional', 
                price: '₹7,999', 
                leads: '500 leads/month',
                highlight: true,
                features: ['All Channels', 'Advanced Analytics', 'Priority Support', 'AI Business Clone']
              },
              { 
                name: 'Enterprise', 
                price: 'Custom', 
                leads: 'Unlimited',
                features: ['Everything', 'Dedicated Support', 'White Label', 'Custom Features']
              }
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-8 transition transform hover:scale-105 ${
                  plan.highlight
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 ring-2 ring-purple-400 md:scale-105'
                    : 'bg-white/10 backdrop-blur border border-white/20'
                }`}
              >
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-3xl font-bold text-white mb-2">
                  {plan.price}
                </p>
                <p className={`mb-6 font-semibold ${plan.highlight ? 'text-white/90' : 'text-purple-400'}`}>
                  {plan.leads}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className={plan.highlight ? 'text-white/90' : 'text-gray-300'}>
                      ✓ {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  className={`w-full py-3 rounded-lg font-bold transition ${
                    plan.highlight
                      ? 'bg-white text-purple-600 hover:bg-gray-100'
                      : 'border border-purple-400 text-purple-400 hover:bg-purple-400/10'
                  }`}
                >
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-32 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Scale Your Business?</h2>
          <p className="text-white/90 mb-8 text-lg">Start for free today. No credit card required.</p>
          <Link 
            href="/signup" 
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg transition inline-block"
          >
            Get Started Now 🚀
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          <p>© 2024 TK Nexus. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
