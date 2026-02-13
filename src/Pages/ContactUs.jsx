import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-base-100 font-sans">
      {/* Hero Header */}
      <section className="bg-primary py-20 text-primary-content text-center">
        <div className="container mx-auto px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold mb-4"
          >
            Get in <span className="text-white italic">Touch</span>
          </motion.h1>
          <p className="text-xl text-primary-content/80 max-w-2xl mx-auto">
            Have questions or feedback? We're here to help you 24/7.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-10 py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Contact Information */}
          <div className="lg:w-1/3 space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-8">Contact Info</h2>
              <div className="space-y-8">
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Our Location</h3>
                    <p className="text-base-content/60">123 Tech Park, Kerala, India</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Phone Number</h3>
                    <p className="text-base-content/60">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Email Address</h3>
                    <p className="text-base-content/60">support@razkart.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <h3 className="text-xl font-bold mb-6">Follow Us</h3>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <button key={i} className="btn btn-circle btn-primary btn-outline hover:bg-primary hover:text-white border-2">
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:w-2/3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="card bg-base-100 shadow-2xl border border-base-200 p-8 md:p-12"
            >
              <h2 className="text-3xl font-bold mb-8">Send Us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label font-bold text-sm tracking-wide">FULL NAME</label>
                    <input type="text" placeholder="John Doe" className="input input-bordered bg-base-200/50 focus:bg-base-100 transition-all border-2" />
                  </div>
                  <div className="form-control">
                    <label className="label font-bold text-sm tracking-wide">EMAIL ADDRESS</label>
                    <input type="email" placeholder="john@example.com" className="input input-bordered bg-base-200/50 focus:bg-base-100 transition-all border-2" />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label font-bold text-sm tracking-wide">SUBJECT</label>
                  <input type="text" placeholder="How can we help?" className="input input-bordered bg-base-200/50 focus:bg-base-100 transition-all border-2" />
                </div>

                <div className="form-control">
                  <label className="label font-bold text-sm tracking-wide">MESSAGE</label>
                  <textarea rows={6} className="textarea textarea-bordered bg-base-200/50 focus:bg-base-100 transition-all border-2 resize-none" placeholder="Write your message here..."></textarea>
                </div>

                <button className="btn btn-primary btn-lg rounded-xl gap-3 w-full sm:w-auto px-10">
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Map Section Placeholder */}
      <section className="w-full h-[400px] bg-base-200 relative overflow-hidden grayscale opacity-50 contrast-125">
        <img
          src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200"
          alt="Map Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="p-4 bg-white/90 backdrop-blur rounded-2xl shadow-2xl flex items-center gap-4 border border-primary/20">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold">Razkart HQ</h4>
              <p className="text-xs opacity-60 uppercase font-black tracking-tighter">Visit our tech park</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
