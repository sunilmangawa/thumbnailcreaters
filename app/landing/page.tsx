'use client';

import React from 'react';
import Link from 'next/link';
import {
  Download,
  Layers,
  Sparkles,
  ArrowRight,
  LayoutTemplate,
  Type,
  ImageIcon,
  Shapes,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ThumbnailCreators</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/editor"
                className="text-neutral-300 hover:text-white transition-colors text-sm"
              >
                Editor
              </Link>
              <Link
                href="#features"
                className="text-neutral-300 hover:text-white transition-colors text-sm hidden sm:block"
              >
                Features
              </Link>
              <Link
                href="/editor"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Start Creating
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Free YouTube Thumbnail Creator - No Account Required
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Create Stunning
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                YouTube Thumbnails
              </span>
              <br />
              in Minutes
            </h1>

            <p className="text-lg sm:text-xl text-neutral-400 max-w-2xl mx-auto mb-10">
              Professional thumbnail design tool with templates, shapes, text, and easy export. 
              No design skills needed. Free forever.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link
                href="/editor"
                className="group px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-lg transition-all flex items-center gap-2"
              >
                Start Creating Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <span className="text-neutral-500 text-sm">No signup required</span>
            </div>

            {/* Preview */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl border border-neutral-700 p-2 shadow-2xl">
                <div className="bg-neutral-950 rounded-xl overflow-hidden aspect-video relative">
                  {/* Mock canvas preview */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <h2 className="text-5xl font-bold text-white text-center drop-shadow-lg">
                        Your Amazing<br />Video Title!
                      </h2>
                    </div>
                    <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                    <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-purple-400/20 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need to Create Perfect Thumbnails
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Professional tools designed for YouTube creators
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <LayoutTemplate className="w-6 h-6" />,
                title: 'Ready Templates',
                description: 'Jumpstart your design with professionally crafted templates for any niche.',
              },
              {
                icon: <Type className="w-6 h-6" />,
                title: 'Rich Text Editor',
                description: 'Customizable fonts, colors, shadows, and styles for impactful text.',
              },
              {
                icon: <ImageIcon className="w-6 h-6" />,
                title: 'Image Uploads',
                description: 'Upload your own images and arrange them on the canvas freely.',
              },
              {
                icon: <Shapes className="w-6 h-6" />,
                title: 'Shapes & Elements',
                description: 'Add rectangles, circles, stars, and more to enhance your designs.',
              },
              {
                icon: <Layers className="w-6 h-6" />,
                title: 'Layer Management',
                description: 'Full control over z-index, opacity, and element organization.',
              },
              {
                icon: <Download className="w-6 h-6" />,
                title: 'High-Quality Export',
                description: 'Export in PNG, JPG, or WebP at full YouTube thumbnail resolution.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-neutral-800/50 rounded-xl border border-neutral-700/50 p-6 hover:bg-neutral-800 hover:border-blue-500/30 transition-all"
              >
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-500/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Create Your Thumbnail in 3 Simple Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose a Template',
                description: 'Pick from our growing library of professional templates or start from a blank canvas.',
              },
              {
                step: '02',
                title: 'Customize Everything',
                description: 'Edit text, add images, shapes, and customize every detail to match your brand.',
              },
              {
                step: '03',
                title: 'Export & Download',
                description: 'Download your thumbnail in high-resolution PNG, JPG, or WebP format.',
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="text-8xl font-bold text-neutral-800/50 absolute -top-4 -left-2 select-none">
                  {item.step}
                </div>
                <div className="relative pt-12">
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl border border-blue-500/20 p-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Create Your First Thumbnail?
            </h2>
            <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of creators who trust our tool for their YouTube thumbnails. 
              It is completely free and always will be.
            </p>
            <Link
              href="/editor"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-lg transition-all"
            >
              Open Editor
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ThumbnailCreators</span>
            </div>
            <p className="text-neutral-500 text-sm">
              2026 ThumbnailCreators. Free YouTube thumbnail creation tool.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Icons imported at top of file
