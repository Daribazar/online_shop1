import Image from 'next/image';

// Бидний тухай хуудасны өгөгдөл
const aboutData = {
  story: {
    title: "Our Story",
    image: "https://images.pexels.com/photos/7679877/pexels-photo-7679877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    paragraphs: [
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure.",
      "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College."
    ]
  },
  
  features: [
    {
      icon: "/assets/images/icons/delivery.webp",
      title: "Free Shipping",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industr in some form."
    },
    {
      icon: "/assets/images/icons/money-bag.webp",
      title: "100% Back Gaurantee",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industr in some form."
    },
    {
      icon: "/assets/images/icons/support.webp",
      title: "Online Support 24/7",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industr in some form."
    }
  ],
  
  brands: [
    { id: 1, image: '/assets/images/brands/01.webp', name: 'Brand 1' },
    { id: 2, image: '/assets/images/brands/02.webp', name: 'Brand 2' },
    { id: 3, image: '/assets/images/brands/03.webp', name: 'Brand 3' },
    { id: 4, image: '/assets/images/brands/04.webp', name: 'Brand 4' },
    { id: 5, image: '/assets/images/brands/05.webp', name: 'Brand 5' },
    { id: 6, image: '/assets/images/brands/06.webp', name: 'Brand 6' },
    { id: 7, image: '/assets/images/brands/07.webp', name: 'Brand 7' },
    { id: 8, image: '/assets/images/brands/08.webp', name: 'Brand 8' },
    { id: 9, image: '/assets/images/brands/09.webp', name: 'Brand 9' },
    { id: 10, image: '/assets/images/brands/10.webp', name: 'Brand 10' }
  ]
};

// Бидний тухай хуудас - компанийн түүх, онцлог, брэндүүд
export default function About() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Бидний түүх хэсэг */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold text-2xl mb-4">{aboutData.story.title}</h3>
            {aboutData.story.paragraphs.map((paragraph, index) => (
              <p key={index} className={index < aboutData.story.paragraphs.length - 1 ? "mb-4" : ""}>
                {paragraph}
              </p>
            ))}
          </div>
          <div>
            <Image
              src={aboutData.story.image}
              className="w-full h-auto"
              alt="Our story"
              width={1260}
              height={750}
            />
          </div>
        </div>

        {/* Яагаад биднийг сонгох вэ хэсэг */}
        <div className="py-16 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300" />
          <h3 className="text-2xl font-bold">Why Choose Us</h3>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-16">
          {aboutData.features.map((feature, index) => (
            <div key={index} className="flex">
              <div className="border-0 w-full">
                <div className="p-6">
                  <Image src={feature.icon} width={60} height={60} alt={feature.title} />
                  <h5 className="my-3 font-bold text-xl">{feature.title}</h5>
                  <p className="mb-0">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Брэндээр дэлгүүр хийх хэсэг */}
        <div className="py-16 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-300" />
          <h3 className="text-2xl font-bold">Shop By Brands</h3>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        <div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {aboutData.brands.map((brand) => (
              <div key={brand.id}>
                <div className="p-3 border rounded">
                  <div className="flex items-center">
                    <a href="javascript:;">
                      <Image
                        src={brand.image}
                        className="w-full h-auto"
                        alt={brand.name}
                        width={200}
                        height={100}
                      />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
