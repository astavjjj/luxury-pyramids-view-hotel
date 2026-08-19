// Demo seed data — clearly marked as DEMO, not real hotel data.
// Production data must be provided by the hotel client.
import { PrismaClient, BedType, Currency, OfferType, ContentStatus, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding demo data (DEMO ONLY)…");

  await prisma.amenity.createMany({
    data: [
      { name: "Free Wi-Fi", nameAr: "واي فاي مجاني", icon: "wifi" },
      { name: "Pyramids View", nameAr: "إطلالة على الأهرامات", icon: "landmark" },
      { name: "Air Conditioning", nameAr: "تكييف هواء", icon: "snowflake" },
      { name: "Mini Bar", nameAr: "ميني بار", icon: "glass-water" },
      { name: "Room Service", nameAr: "خدمة الغرف", icon: "bell" },
      { name: "Bathtub", nameAr: "بانيو", icon: "bath" },
      { name: "Coffee Machine", nameAr: "ماكينة قهوة", icon: "coffee" },
      { name: "Safe", nameAr: "خزنة", icon: "lock" },
      { name: "Balcony", nameAr: "بلكونة", icon: "sun" },
      { name: "City View", nameAr: "إطلالة على المدينة", icon: "building" },
    ],
    skipDuplicates: true,
  });

  const amenities = await prisma.amenity.findMany();
  const byName = (name: string) => amenities.find((a) => a.name === name)!;

  const rooms = [
    {
      slug: "deluxe-room",
      name: "Deluxe Room",
      nameAr: "غرفة ديلوكس",
      description:
        "A serene retreat with refined furnishings and a city view. Designed for comfort with warm Egyptian textures.",
      descriptionAr:
        "ملاذ هادئ بتصميم راقٍ وإطلالة على المدينة. صُممت للراحة بلمسات مصرية دافئة.",
      sizeSqm: 32,
      bedType: BedType.KING,
      maxGuests: 2,
      view: "City",
      pricePerNight: 220,
      image: "/media/demo/deluxe.svg",
      amenities: ["Free Wi-Fi", "Air Conditioning", "Mini Bar", "Room Service", "Coffee Machine", "Safe"],
    },
    {
      slug: "premium-room",
      name: "Premium Room",
      nameAr: "غرفة بريميوم",
      description:
        "Generous space with contemporary elegance and either city or garden outlooks. Quiet, bright, and considered.",
      descriptionAr:
        "مساحة واسعة بأناقة عصرية وإطلالة على المدينة أو الحديقة. هادئة ومشرقة ومدروسة.",
      sizeSqm: 38,
      bedType: BedType.QUEEN,
      maxGuests: 2,
      view: "City / Garden",
      pricePerNight: 260,
      image: "/media/demo/premium.svg",
      amenities: ["Free Wi-Fi", "Air Conditioning", "Mini Bar", "Room Service", "Bathtub", "Safe"],
    },
    {
      slug: "pyramids-view-room",
      name: "Pyramids View Room",
      nameAr: "غرفة بإطلالة على الأهرامات",
      description:
        "Wake to the Pyramids of Giza. Floor-to-ceiling windows frame the plateau across the horizon. Our signature stay.",
      descriptionAr:
        "استيقظ على منظر أهرامات الجيزة. نوافذ ممتدة من الأرض للسقف تؤطر الهضبة عبر الأفق. إقامتنا المميزة.",
      sizeSqm: 40,
      bedType: BedType.KING,
      maxGuests: 3,
      view: "Pyramids",
      pricePerNight: 340,
      image: "/media/demo/pyramids-room.svg",
      amenities: ["Pyramids View", "Free Wi-Fi", "Air Conditioning", "Mini Bar", "Room Service", "Coffee Machine", "Safe", "Balcony"],
    },
    {
      slug: "junior-suite",
      name: "Junior Suite",
      nameAr: "جناح جونيور",
      description:
        "A private living corner separated from the sleeping area, with privileged views and a spacious marble bathroom.",
      descriptionAr:
        "ركن معيشة خاص منفصل عن منطقة النوم، مع إطلالة مميزة وحمام رخامي واسع.",
      sizeSqm: 52,
      bedType: BedType.KING,
      maxGuests: 3,
      view: "Pyramids / City",
      pricePerNight: 420,
      image: "/media/demo/junior-suite.svg",
      amenities: ["Pyramids View", "Free Wi-Fi", "Air Conditioning", "Mini Bar", "Bathtub", "Room Service", "Safe"],
    },
    {
      slug: "executive-suite",
      name: "Executive Suite",
      nameAr: "جناح تنفيذي",
      description:
        "A refined suite with a separate lounge, dining area and sweeping Pyramids views. Ideal for longer, considered stays.",
      descriptionAr:
        "جناح راقٍ مع صالة منفصلة ومنطقة طعام وإطلالة بانورامية على الأهرامات. مثالي للإقامات الأطول.",
      sizeSqm: 68,
      bedType: BedType.KING,
      maxGuests: 4,
      view: "Pyramids",
      pricePerNight: 560,
      image: "/media/demo/executive-suite.svg",
      amenities: ["Pyramids View", "Free Wi-Fi", "Air Conditioning", "Mini Bar", "Bathtub", "Room Service", "Coffee Machine", "Safe", "Balcony"],
    },
    {
      slug: "royal-suite",
      name: "Royal Suite",
      nameAr: "الجناح الملكي",
      description:
        "Our signature residence. Full-floor suite with panoramic Pyramids views, private study, butler service and a grand marble bath.",
      descriptionAr:
        "إقامتنا المميزة. جناح بطابق كامل بإطلالة بانورامية على الأهرامات، ومكتب خاص، وخدمة بتلير، وحمام رخامي فخم.",
      sizeSqm: 95,
      bedType: BedType.KING,
      maxGuests: 5,
      view: "Pyramids",
      pricePerNight: 820,
      image: "/media/demo/royal-suite.svg",
      amenities: ["Pyramids View", "Free Wi-Fi", "Air Conditioning", "Mini Bar", "Bathtub", "Room Service", "Coffee Machine", "Safe", "Balcony"],
    },
  ];

  for (const r of rooms) {
    const { amenities: roomAmenities, ...roomData } = r;
    const room = await prisma.room.upsert({
      where: { slug: r.slug },
      update: roomData,
      create: roomData,
    });

    await prisma.rate.upsert({
      where: { roomId: room.id },
      update: {},
      create: {
        roomId: room.id,
        basePrice: r.pricePerNight,
        currency: Currency.USD,
        minStay: 1,
      },
    });

    for (const a of roomAmenities) {
      const amenity = byName(a);
      await prisma.roomAmenity.upsert({
        where: { roomId_amenityId: { roomId: room.id, amenityId: amenity.id } },
        update: {},
        create: { roomId: room.id, amenityId: amenity.id },
      });
    }
  }

  await prisma.offer.upsert({
    where: { slug: "pyramids-morning" },
    update: {},
    create: {
      slug: "pyramids-morning",
      title: "Pyramids & Breakfast",
      titleAr: "الأهرامات والإفطار",
      description:
        "Book the Pyramids View Room and enjoy daily breakfast overlooking the Giza Plateau. Demo offer.",
      descriptionAr: "احجز غرفة بإطلالة على الأهرامات واستمتع بإفطار يومي على هضبة الجيزة. عرض تجريبي.",
      type: OfferType.ROOM,
      discountPct: 10,
      active: true,
    },
  });

  await prisma.offer.upsert({
    where: { slug: "stay-3-pay-2" },
    update: {},
    create: {
      slug: "stay-3-pay-2",
      title: "Stay 3, Pay 2",
      titleAr: "أقِم 3 ليالي وادفع ليلتين",
      description: "Enjoy an extended stay across our suites with one complimentary night. Demo offer.",
      descriptionAr: "استمتع بإقامة ممتدة في أجنحتنا مع ليلة مجانية. عرض تجريبي.",
      type: OfferType.STAY,
      active: true,
    },
  });

  const settings: Record<string, unknown> = {
    siteName: "Luxury Pyramids View Hotel",
    siteNameAr: "فندق إطلالة الأهرامات الفاخر",
    tagline: "Stay above history.",
    taglineAr: "أقِم فوق التاريخ.",
    phone: "+20 000 000 0000",
    email: "reservations@example.com",
    address: "Giza, Egypt",
    heroTitle: "Stay Above History",
    heroTitleAr: "أقِم فوق التاريخ",
    heroSubtitle: "A luxury hotel on the Giza Plateau, facing the Pyramids of Giza.",
    heroSubtitleAr: "فندق فاخر على هضبة الجيزة، مقابل أهرامات الجيزة.",
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: value as object },
      create: { key, value: value as object },
    });
  }

  const home = await prisma.page.upsert({
    where: { slug: "home" },
    update: {},
    create: {
      slug: "home",
      title: "Home",
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });
  console.log("Home page id:", home.id);

  const passwordHash = await bcrypt.hash("ChangeMe123!", 12);
  const admin = await prisma.staff.upsert({
    where: { email: "admin@example.com" },
    update: { passwordHash },
    create: {
      email: "admin@example.com",
      name: "Demo Manager",
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });
  console.log("Admin staff (DEMO):", admin.email, "password: ChangeMe123!");

  console.log("Done seeding DEMO data.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });