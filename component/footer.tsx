import Link from "next/link";
import { Facebook, Twitter, Linkedin, Youtube, Instagram } from "lucide-react";

const exploreLinks = [
  { label: "Fashion", href: "/fashion" },
  { label: "Women", href: "/women" },
  { label: "Furniture", href: "/furniture" },
  { label: "Shoes", href: "/shoes" },
  { label: "Topwear", href: "/topwear" },
  { label: "Brands", href: "/brands" },
  { label: "Kids", href: "/kids" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Complaints", href: "/complaints" },
];

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export default function Footer() {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* About Us */}
          <div>
            <div className="mb-3">
              <span className="text-2xl font-bold">ShopLogo</span>
            </div>
            <h5 className="mb-3 font-bold text-lg">About Us</h5>
            <p className="mb-2 text-gray-600">
              There are many variations of passages of Lorem Ipsum available, but
              the majority have suffered alteration in some form, by injected
              humour, or randomised words which don&apos;t look even slightly
              believable.
            </p>
            <Link href="/about" className="text-gray-900 hover:underline">
              Read More
            </Link>
          </div>

          {/* Explore */}
          <div>
            <h5 className="mb-3 font-bold text-lg">Explore</h5>
            <ul className="space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-600 hover:text-gray-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h5 className="mb-3 font-bold text-lg">Company</h5>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-600 hover:text-gray-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h5 className="mb-3 font-bold text-lg">Follow Us</h5>
            <div className="flex items-center gap-2 mb-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </Link>
              ))}
            </div>
            <div className="mb-3">
              <h5 className="font-bold">Support</h5>
              <p className="text-gray-600">support@example.com</p>
            </div>
            <div>
              <h5 className="font-bold">Toll Free</h5>
              <p className="text-gray-600">1800- 8xx 2xx</p>
            </div>
          </div>
        </div>

        <div className="my-8" />

        {/* Download App */}
        <div className="text-center">
          <h5 className="font-bold mb-4 text-lg">Download Mobile App</h5>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#" className="bg-linear-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition">
              <div className="flex items-center gap-2">
                <span className="text-2xl">▶</span>
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="font-bold">Google Play</div>
                </div>
              </div>
            </Link>
            <Link href="#" className="bg-linear-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍎</span>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="font-bold">App Store</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
