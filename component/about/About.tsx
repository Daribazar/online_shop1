import Image from 'next/image';

// Бидний тухай хуудасны өгөгдөл
const aboutData = {
  story: {
    title: "Бидний тухай",
    image: "https://images.pexels.com/photos/7679877/pexels-photo-7679877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    paragraphs: [
      "Abercrombie & Fitch Mongolia нь өдөр тутмын амьдралд нийцсэн, тав тухтай, чөлөөт хэв маягийн эрэгтэй болон эмэгтэй хувцсыг сонгон хүргэдэг хувцасны дэлгүүр юм.",
      "Бид өдөр тутам өмсөхөд тохиромжтой, загварлаг бөгөөд чанартай хувцсыг онцлон сонгодог. Загварын шийдэл, материалын чанар, өнгөний зохицол, тав тухыг эрхэмлэн, өөрийн хэв маягийг бүрдүүлэхэд хялбар, олон төрлийн хувцастай хослуулах боломжтой сонголтуудыг санал болгодог.",
      "Энгийн хэрнээ өөрийн гэсэн өнгө төрхийг илэрхийлсэн, өдөр тутмын амьдралд зохицох хувцаслалтыг нэг дороос бүрдүүлэх боломжийг хэрэглэгчдэдээ хүргэхийг зорьдог.",
      "Abercrombie & Fitch Mongolia — өдөр тутмын хэв маягт тань зориулсан сонголт.",
    ]
  },
  
  features: [
    {
      icon: "/assets/images/icons/delivery.webp",
      title: "Хүргэлт",
      description: "Захиалгыг тань найдвартай, шуурхай хүргэнэ."
    },
    {
      icon: "/assets/images/icons/money-bag.webp",
      title: "Чанартай сонголт",
      description: "Загвар, материал, тав тухыг хослуулсан хувцсыг сонгон хүргэнэ."
    },
    {
      icon: "/assets/images/icons/support.webp",
      title: "Онлайн дэмжлэг",
      description: "Захиалга болон бүтээгдэхүүний мэдээлэлтэй холбоотой бүх асуултад тань тусална."
    }
  ],
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
          <h3 className="text-2xl font-bold">Яагаад биднийг сонгох вэ?</h3>
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

        <div>
        </div>
      </div>
    </section>
  );
}
