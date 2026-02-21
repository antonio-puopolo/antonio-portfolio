import React, { useState } from 'react'
import { Phone, Mail, MapPin, Home, Award, Users, CheckCircle, Star, Send } from 'lucide-react'

function App() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // Save to localStorage
    const leads = JSON.parse(localStorage.getItem('leads') || '[]')
    leads.push({ ...formData, timestamp: new Date().toISOString() })
    localStorage.setItem('leads', JSON.stringify(leads))
    
    setFormSubmitted(true)
    setFormData({ name: '', email: '', phone: '', message: '' })
    
    setTimeout(() => setFormSubmitted(false), 5000)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const soldProperties = [
    {
      address: '42 Creek Road, Camp Hill',
      price: '$1,425,000',
      beds: 4,
      baths: 2,
      cars: 2,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&h=400&fit=crop'
    },
    {
      address: '18 Martha Street, Camp Hill',
      price: '$985,000',
      beds: 3,
      baths: 2,
      cars: 1,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop'
    },
    {
      address: '7 Cavendish Road, Coorparoo',
      price: '$1,150,000',
      beds: 4,
      baths: 2,
      cars: 2,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop'
    },
    {
      address: '25 Logan Road, Holland Park',
      price: '$875,000',
      beds: 3,
      baths: 1,
      cars: 2,
      image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=600&h=400&fit=crop'
    }
  ]

  const currentListings = [
    {
      address: '56 Samuel Street, Camp Hill',
      price: 'Offers Over $1,295,000',
      beds: 4,
      baths: 2,
      cars: 2,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop',
      status: 'Open This Weekend'
    },
    {
      address: '12 Stanley Terrace, Coorparoo',
      price: 'Contact Agent',
      beds: 3,
      baths: 2,
      cars: 1,
      image: 'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=600&h=400&fit=crop',
      status: 'Just Listed'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah & James Mitchell',
      text: 'Antonio exceeded our expectations in every way. His refined negotiation skills secured us an incredible result, and his customer service throughout the process was exceptional. We couldn\'t recommend him more highly.',
      rating: 5
    },
    {
      name: 'David Thompson',
      text: 'As a first-time seller, I was nervous about the process. Antonio guided me through every step with patience and professionalism. He achieved a result well above my expectations and made the whole experience stress-free.',
      rating: 5
    },
    {
      name: 'Emma & Michael Chen',
      text: 'We\'ve bought and sold several properties over the years, and Antonio is by far the best agent we\'ve worked with. His market knowledge, attention to detail, and genuine care for his clients sets him apart. Highly recommended!',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">Antonio Puopolo</h1>
              <p className="text-sm text-gray-600">Lead Agent | Hicks Team</p>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-700 hover:text-secondary transition">About</a>
              <a href="#sold" className="text-gray-700 hover:text-secondary transition">Sold</a>
              <a href="#listings" className="text-gray-700 hover:text-secondary transition">Listings</a>
              <a href="#testimonials" className="text-gray-700 hover:text-secondary transition">Testimonials</a>
              <a href="#contact" className="btn-primary text-sm py-2 px-6">Contact Me</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-primary via-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Your Trusted Partner in Camp Hill Real Estate
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Lead Agent at Place Estate Agents, specializing in refined negotiation and exceptional customer service that delivers outstanding results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contact" className="btn-primary inline-block text-center">
                Get Your Free Appraisal
              </a>
              <a href="tel:0450899007" className="btn-secondary inline-block text-center">
                Call 0450 899 007
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title">About Antonio</h2>
              <p className="text-lg text-gray-700 mb-6">
                As Lead Agent with the Hicks Team at Place Estate Agents Camp Hill, I bring a passion for real estate that goes beyond simply buying and selling properties. My approach centers on building lasting relationships and delivering results that exceed expectations.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                With refined negotiation skills honed over years of experience, I understand that every client's situation is unique. Whether you're selling your family home or investing in your future, I'm committed to providing exceptional customer service at every stage of your journey.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                My deep knowledge of the Camp Hill, Coorparoo, and Holland Park markets, combined with a genuine dedication to my clients, ensures you receive expert guidance and outstanding outcomes.
              </p>
              
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-secondary" />
                  </div>
                  <p className="font-semibold text-gray-800">Lead Agent</p>
                  <p className="text-sm text-gray-600">Hicks Team</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-secondary" />
                  </div>
                  <p className="font-semibold text-gray-800">Client Focused</p>
                  <p className="text-sm text-gray-600">Every Time</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Home className="w-8 h-8 text-secondary" />
                  </div>
                  <p className="font-semibold text-gray-800">Local Expert</p>
                  <p className="text-sm text-gray-600">Camp Hill</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[3/4] bg-gradient-to-br from-primary to-blue-800 rounded-lg"></div>
              <div className="absolute bottom-8 right-8 bg-white p-6 rounded-lg shadow-xl">
                <p className="text-3xl font-bold text-primary mb-1">$4M+</p>
                <p className="text-gray-600">Annual Sales Target</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sold Properties */}
      <section id="sold" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Recently Sold</h2>
            <p className="text-xl text-gray-600">Proven results that speak for themselves</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {soldProperties.map((property, index) => (
              <div key={index} className="card">
                <div className="relative">
                  <img src={property.image} alt={property.address} className="w-full h-48 object-cover" />
                  <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    SOLD
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-2xl font-bold text-primary mb-2">{property.price}</p>
                  <p className="text-gray-800 font-semibold mb-3">{property.address}</p>
                  <div className="flex gap-4 text-gray-600 text-sm">
                    <span>{property.beds} bed</span>
                    <span>{property.baths} bath</span>
                    <span>{property.cars} car</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Listings */}
      <section id="listings" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Current Listings</h2>
            <p className="text-xl text-gray-600">Exceptional properties available now</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {currentListings.map((property, index) => (
              <div key={index} className="card">
                <div className="relative">
                  <img src={property.image} alt={property.address} className="w-full h-64 object-cover" />
                  <div className="absolute top-4 left-4 bg-accent text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {property.status}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-3xl font-bold text-primary mb-3">{property.price}</p>
                  <p className="text-xl text-gray-800 font-semibold mb-4">{property.address}</p>
                  <div className="flex gap-6 text-gray-600 mb-6">
                    <span className="flex items-center gap-2">
                      <Home className="w-4 h-4" /> {property.beds} bed
                    </span>
                    <span>{property.baths} bath</span>
                    <span>{property.cars} car</span>
                  </div>
                  <a href="#contact" className="btn-primary w-full text-center block">
                    Request More Information
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Client Testimonials</h2>
            <p className="text-xl text-gray-600">Hear from my satisfied clients</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-primary">— {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Get In Touch</h2>
            <p className="text-xl text-gray-600">Ready to get started? Contact me today for a free property appraisal</p>
          </div>
          
          {formSubmitted && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg mb-8 flex items-center gap-3">
              <CheckCircle className="w-6 h-6" />
              <p className="font-semibold">Thank you! I'll be in touch shortly.</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-lg shadow-lg">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="0450 899 007"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Tell me about your property or requirements..."
              ></textarea>
            </div>
            
            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Antonio Puopolo</h3>
              <p className="text-blue-200 mb-2">Lead Agent | Hicks Team</p>
              <p className="text-blue-200">Place Estate Agents Camp Hill</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-3">
                <a href="tel:0450899007" className="flex items-center gap-3 text-blue-200 hover:text-white transition">
                  <Phone className="w-5 h-5" />
                  0450 899 007
                </a>
                <a href="mailto:antonio@eplace.com.au" className="flex items-center gap-3 text-blue-200 hover:text-white transition">
                  <Mail className="w-5 h-5" />
                  antonio@eplace.com.au
                </a>
                <div className="flex items-start gap-3 text-blue-200">
                  <MapPin className="w-5 h-5 mt-1" />
                  <span>Camp Hill, QLD 4152</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Areas Served</h4>
              <ul className="space-y-2 text-blue-200">
                <li>Camp Hill</li>
                <li>Coorparoo</li>
                <li>Holland Park</li>
                <li>Surrounding Brisbane Suburbs</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-blue-800 pt-8 text-center text-blue-200">
            <p>&copy; {new Date().getFullYear()} Antonio Puopolo. All rights reserved.</p>
            <p className="mt-2 text-sm">Place Estate Agents | Hicks Team</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
