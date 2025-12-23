import Link from "next/link";
import { Facebook, Twitter, Linkedin, Youtube, Instagram } from "lucide-react";

const exploreLinks = [
  { label: "Загвар", href: "/fashion" },
  { label: "Эмэгтэй", href: "/women" },
  { label: "Тавилга", href: "/furniture" },
  { label: "Гутал", href: "/shoes" },
  { label: "Дээд хувцас", href: "/topwear" },
  { label: "Брэндүүд", href: "/brands" },
  { label: "Хүүхдийн", href: "/kids" },
];

const companyLinks = [
  { label: "Бидний тухай", href: "/about" },
  { label: "Холбоо барих", href: "/contact" },
  { label: "Түгээмэл асуулт", href: "/faq" },
  { label: "Нууцлал", href: "/privacy" },
  { label: "Үйлчилгээний нөхцөл", href: "/terms" },
  { label: "Гомдол", href: "/complaints" },
];

const socialLinks = [
  { icon: Facebook, 
    href: "https://www.facebook.com/profile.php?id=100063981427617", 
    label: "Facebook" },

  { icon: Instagram, href: "https://www.instagram.com/abercrombiefitchmongolia/", label: "Instagram" },
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
            <h5 className="mb-3 font-bold text-lg">Бидний тухай</h5>
            <p className="mb-2 text-gray-600">
              Бид таны хэрэгцээнд нийцсэн өндөр чанартай бүтээгдэхүүн, 
              найдвартай үйлчилгээ үзүүлэхийг эрмэлздэг. Манай дэлгүүр 
              нь олон төрлийн бүтээгдэхүүнээр таныг хангах болно.
            </p>
            <Link href="/about" className="text-gray-900 hover:underline">
              Дэлгэрэнгүй
            </Link>
          </div>

          {/* Explore */}
          <div>
            <h5 className="mb-3 font-bold text-lg">Судлах</h5>
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
            <h5 className="mb-3 font-bold text-lg">Компани</h5>
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
            <h5 className="mb-3 font-bold text-lg">Биднийг дагах</h5>
            <div className="flex items-center gap-2 mb-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"           // Шинэ цонхонд нээх тохиргоо
                  rel="noopener noreferrer" // Аюулгүй байдлын үүднээс заавал байх ёстой
                  className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </Link>
              ))}
            </div>
            <div className="mb-3">
              <h5 className="font-bold">Тусламж</h5>
              <p className="text-gray-600">support@example.com</p>
            </div>
            <div>
              <h5 className="font-bold">Үнэгүй утас</h5>
              <p className="text-gray-600">1800- 8xx 2xx</p>
            </div>
          </div>
        </div>

        <div className="my-8" />


      </div>
    </section>
  );
}
