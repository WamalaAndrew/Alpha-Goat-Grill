/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import DiscountBanner from './components/DiscountBanner';
import ScrollBanner from './components/ScrollBanner';
import Features from './components/Features';
import BestSellers from './components/BestSellers';
import About from './components/About';
import Menu from './components/Menu';
import Testimonials from './components/Testimonials';
import Reservation from './components/Reservation';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import FloatingCart from './components/FloatingCart';
import AdminDashboard from './components/AdminDashboard';

function MainLayout() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <FloatingCart />
      <main>
        <Hero />
        <DiscountBanner />
        <ScrollBanner />
        <Features />
        <BestSellers />
        <About />
        <Menu />
        <Testimonials />
        <Reservation />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
