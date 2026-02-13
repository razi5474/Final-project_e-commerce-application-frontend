import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, Zap, Award, Heart, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const stats = [
    { label: 'Happy Customers', value: '50K+', icon: <Users className="w-6 h-6" /> },
    { label: 'Products Sold', value: '1M+', icon: <ShoppingBag className="w-6 h-6" /> },
    { label: 'Global Offices', value: '12', icon: <Globe className="w-6 h-6" /> },
    { label: 'Awards Won', value: '25+', icon: <Award className="w-6 h-6" /> },
  ];

  const values = [
    {
      title: 'Customer First',
      description: 'We prioritize our customers in every decision we make, ensuring the best shopping experience.',
      icon: <Heart className="w-8 h-8 text-error" />,
    },
    {
      title: 'Innovation',
      description: 'We constantly strive to bring the latest technology and fashion trends to your doorstep.',
      icon: <Zap className="w-8 h-8 text-warning" />,
    },
    {
      title: 'Quality Assured',
      description: 'Every product goes through a rigorous quality check before it reaches you.',
      icon: <Award className="w-8 h-8 text-success" />,
    },
  ];

  return (
    <div className="min-h-screen bg-base-100 font-sans">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/shopping-concept.jpg"
            alt="About Us Hero"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-base-100" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold mb-6"
          >
            We are <span className="text-primary italic">Razkart</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-base-content/70 max-w-3xl mx-auto"
          >
            Empowering your lifestyle with curated collections and seamless shopping experiences since 2025.
          </motion.p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-base-200/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center p-6 bg-base-100 rounded-2xl shadow-xl border border-base-300 hover:shadow-2xl transition-shadow"
              >
                <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-base-content/60 font-medium uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 relative">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative z-10"
              >
                <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"
                    alt="Our Story"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-primary rounded-3xl flex items-center justify-center p-8 text-white shadow-2xl hidden md:flex">
                  <p className="text-lg font-bold">Innovation at every step.</p>
                </div>
              </motion.div>
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl z-0" />
            </div>

            <div className="lg:w-1/2 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-primary mb-4">Our Journey</h2>
                <div className="space-y-4">
                  <p className="text-lg text-base-content/80 leading-relaxed">
                    Razkart started with a simple idea: make quality products accessible to everyone. What began as a small tech boutique in Kerala has now grown into a global marketplace for fashion, electronics, and home essentials.
                  </p>
                  <p className="text-lg text-base-content/80 leading-relaxed">
                    We believe that shopping should be more than just a transaction; it should be an experience that brings joy and value to your life. Our team works tirelessly to curate only the best, ensuring that every Razkart package delivered is a promise kept.
                  </p>
                </div>
                <div className="pt-6 flex flex-wrap gap-4">
                  {['Integrity', 'Passion', 'User-Centric', 'Excellence'].map(tag => (
                    <span key={tag} className="px-6 py-2 bg-base-200 rounded-full text-sm font-bold text-base-content/70 hover:bg-primary hover:text-white transition-colors cursor-default">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-primary text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-primary-content/70 max-w-2xl mx-auto">The principles that guide us every single day.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-8 rounded-3xl bg-white/5 hover:bg-white hover:text-primary transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-primary-content/80 group-hover:text-primary/70">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team CTA */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-8">Join the Razkart Community</h2>
            <p className="text-xl text-base-content/60 mb-10 max-w-2xl mx-auto">Stay updated with our latest news and exclusive offers.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/products" className="btn btn-primary btn-lg rounded-full px-12 shadow-lg hover:shadow-primary/30 transition-shadow">
                Shop Now
              </Link>
              <Link to="/contact" className="btn btn-outline btn-lg rounded-full px-12 hover:bg-base-200 transition-colors">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
