"use client";

import { useState } from "react";
import {
  Building2,
  Users,
  FileText,
  Calculator,
  Truck,
  Scale,
  Home,
} from "lucide-react";
import SiteHeader from "./components/SiteHeader";

export default function HomePage() {
  return (
    <div className="min-h-screen page-background-color">
      {/* Header */}
      <SiteHeader title=" " Icon={Building2} />
      
      {/* <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                Homent
              </span>
            </div>
            <nav className="hidden md:flex space-x-8"> */}
              {/* <a
                href="/properties"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Properties
              </a> */}
              {/* <a
                href="/services"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Services
              </a> */}
              {/* <a
                href="/partner/register"
                className="bg-orange-custom text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Become Partner
              </a> */}
              {/* <a
                href="/partner/login"
                className="bg-orange-custom text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Login
              </a>
            </nav>
          </div>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 heading-property">
        <div className="max-w-7xl mx-auto text-center">
          {/* properties-text-color */}
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Your Trusted Real Estate Partner
            {/* <span className=""> Property Solution</span> */}
          </h1>
          <p className="text-xl mb-8 max-w-3xl font-bold text-white mx-auto">
            Apartments Rent & Resale
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <a
              href="/properties"
              className="bg-orange-custom text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Properties
            </a> */}
            {/* <a
              href="/partner/register"
              className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Become a Partner
            </a> */}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 page-background-color">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center properties-text-color mb-12">
            Complete Property Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServiceCard
              // icon={<Home className="h-8 w-8" />}
              iconSrc="/images/for-sale.png"
              title="Post Your Property"
              description="Post your property for sale or rent"
              link="/properties/new"
            />
            <ServiceCard
              // icon={<Home className="h-8 w-8" />}
              iconSrc="/images/Rent.png"
              title="Property Listings"
              description="Browse thousands of properties for rent, sale, and new projects"
              link="/properties"
            />
            {/* <ServiceCard
              icon={<Calculator className="h-8 w-8" />}
              title="Cost Calculator"
              description="Calculate stamp duty, registration fees, and total property costs"
              link="/calculator"
            /> */}
            <ServiceCard
              icon={<FileText className="h-8 w-8" />}
              // iconSrc="/images/homent-logo.png"
              title="Rental Agreement"
              description="Create legally compliant rental agreements online"
              link="/movers/create-agreement"
            />
            <ServiceCard
              icon={<Scale className="h-8 w-8" />}
              // iconSrc="real-estate-hero.png"
              title="Legal Services"
              description="Connect with legal consultants for property documentation"
              link="/legal"
            />
            <ServiceCard
              icon={<Truck className="h-8 w-8" />}
              // iconSrc="/images/listing.svg"
              title="Packers & Movers"
              description="Professional moving services with real-time tracking"
              link="/movers"
            />
            <ServiceCard
              icon={<FileText className="h-8 w-8" />}
              title="Property Transfer"
              description="PMC/PCMC property tax and utility transfer services"
              link="/property-transfer/create-property-transfer"
            />
            {/* <ServiceCard
              icon={<Users className="h-8 w-8" />}
              title="Partner Program"
              description="Join as a property partner and grow your business"
              link="/partner/register"
            /> */}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-custom text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Building2 className="h-6 w-6" />
                <span className="text-lg font-bold">Homent</span>
              </div>
              <p className="font-semibold">
                Your trusted partner for all property needs in India.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                {/* <li>
                  <a href="/properties" className="hover:text-white">
                    Properties
                  </a>
                </li> */}
                {/* <li>
                  <a href="/legal" className="hover:text-white">
                    Legal Services
                  </a>
                </li> */}
                <li>
                  <a href="/movers" className="hover:text-white">
                    Packers & Movers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Partners</h3>
              <ul className="space-y-2 font-semibold">
                <li>
                  <a href="/partner/register" className="hover:text-white">
                    Become Partner
                  </a>
                </li>
                <li>
                  <a href="/partner/login" className="hover:text-white">
                    Partner Login
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Get in touch</h3>
              <p className="">
                Email: homentproperty@gmail.com
                <br />
                Phone: +91 70285 44009
              </p>
            </div>
          </div>
          <div className="mt-8 border-t btn-border-color-white pt-8 text-left">
            <h3 className="font-semibold mb-4 text-white">About Us: </h3>
              Welcome to Homent Properties, your trusted partner in the real estate market. We specialise in rental, resale, and property management services, 
              ensuring seamless experience for both property owners and tenants. With our professional and personalized approach, we help clients find the perfect home or investment property while maximizing the value and returns of their real estate assets.          </div>
          <div className="border-t btn-border-color-white mt-8 pt-8 text-center">
            <p>&copy; Homent Properties. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({ icon, iconSrc, title, description, link }) {
  return (
    <a href={link} className="group">
      <div className="propert-card-color p-6 rounded-xl transition-colors group-hover:shadow-lg">
        {iconSrc && (
        <img
        // size="64x64"
          src={iconSrc}
          alt={title}
          className="h-20 w-auto mb-4"
          width="100" height="100"
        />
        )}
        <div className="properties-text-color mb-4 group-hover:properties-text-color">
          {icon}
        </div>
        <h3 className="text-xl properties-text-color font-semibold mb-2">{title}</h3>
        <p className="font-semibold properties-text-color">{description}</p>
        <button
          className="flex-1 mt-4 flex items-center justify-center px-3 py-2 btn-bg-color text-white rounded-lg hover:btn-bg-color transition-colors text-sm"
        >
          {/* <Phone className="h-4 w-4 mr-1" /> */}
          Learn More
        </button>
      </div>
    </a>
  );
}
