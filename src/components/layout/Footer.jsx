import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <div className="bg-base-200 text-base-content mt-auto">
      <footer className="footer max-w-7xl mx-auto p-10 grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="flex flex-col gap-4">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Razkart</span>
          </NavLink>
          <p className="text-base-content/70 leading-relaxed">
            Razkart Industries Ltd.<br />
            Providing reliable tech and fashion since 2025.
            Quality products, delivered with care.
          </p>
          <div className="flex gap-4 mt-2">
            <a className="btn btn-circle btn-sm btn-ghost hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
            <a className="btn btn-circle btn-sm btn-ghost hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
            <a className="btn btn-circle btn-sm btn-ghost hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
            <a className="btn btn-circle btn-sm btn-ghost hover:text-primary transition-colors"><Youtube className="w-5 h-5" /></a>
          </div>
        </aside>

        <nav className="flex flex-col gap-2">
          <h6 className="footer-title text-primary opacity-100">Services</h6>
          <a className="link link-hover hover:text-primary transition-colors">Branding</a>
          <Link to="/seller/login" className="link link-hover hover:text-primary transition-colors">Login to seller</Link>
          <a className="link link-hover hover:text-primary transition-colors">Marketing</a>
          <a className="link link-hover hover:text-primary transition-colors">Advertisement</a>
        </nav>

        <nav className="flex flex-col gap-2">
          <h6 className="footer-title text-primary opacity-100">Company</h6>
          <Link to="/about" className="link link-hover hover:text-primary transition-colors">About us</Link>
          <Link to="/contact" className="link link-hover hover:text-primary transition-colors">Contact</Link>
          <a className="link link-hover hover:text-primary transition-colors">Jobs</a>
          <a className="link link-hover hover:text-primary transition-colors">Press kit</a>
        </nav>

        <nav className="flex flex-col gap-2">
          <h6 className="footer-title text-primary opacity-100">Contact</h6>
          <div className="flex items-center gap-2 text-base-content/80">
            <MapPin className="w-4 h-4 text-primary" />
            <span>123 Tech Park, Kerala, India</span>
          </div>
          <div className="flex items-center gap-2 text-base-content/80">
            <Phone className="w-4 h-4 text-primary" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-2 text-base-content/80">
            <Mail className="w-4 h-4 text-primary" />
            <span>support@razkart.com</span>
          </div>
        </nav>
      </footer>

      <div className="footer items-center p-4 bg-base-300 text-base-content/60 max-w-7xl mx-auto rounded-t-lg md:rounded-lg">
        <aside className="items-center grid-flow-col">
          <p>© {new Date().getFullYear()} Razkart Industries Ltd. All rights reserved.</p>
        </aside>
        <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
          <a className="link link-hover text-xs">Terms of use</a>
          <a className="link link-hover text-xs">Privacy policy</a>
          <a className="link link-hover text-xs">Cookie policy</a>
        </nav>
      </div>
    </div>
  );
};

export default Footer;
