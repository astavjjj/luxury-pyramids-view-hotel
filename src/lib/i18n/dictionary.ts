export type Locale = "en" | "ar";

export interface Dictionary {
  dir: "ltr" | "rtl";
  nav: {
    home: string;
    rooms: string;
    suites: string;
    offers: string;
    dining: string;
    spa: string;
    experiences: string;
    gallery: string;
    about: string;
    contact: string;
    booking: string;
    account: string;
    signIn: string;
    signOut: string;
    reservations: string;
  };
  common: {
    bookNow: string;
    from: string;
    perNight: string;
    guests: string;
    viewDetails: string;
    checkIn: string;
    checkOut: string;
    adults: string;
    children: string;
    rooms: string;
    searchAvailability: string;
    nights: string;
    total: string;
    subtotal: string;
    taxes: string;
    currency: string;
    backToHome: string;
    language: string;
  };
  home: {
    heroKicker: string;
    heroTitle: string;
    heroSubtitle: string;
    explore: string;
    reserve: string;
    roomsTitle: string;
    roomsSubtitle: string;
    experiencesTitle: string;
    experiencesSubtitle: string;
    amenitiesTitle: string;
    diningTitle: string;
    diningSubtitle: string;
    visitTitle: string;
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    dir: "ltr",
    nav: {
      home: "Home",
      rooms: "Rooms",
      suites: "Suites",
      offers: "Offers",
      dining: "Dining",
      spa: "Spa",
      experiences: "Experiences",
      gallery: "Gallery",
      about: "About",
      contact: "Contact",
      booking: "Book Now",
      account: "Account",
      signIn: "Sign in",
      signOut: "Sign out",
      reservations: "My Reservations",
    },
    common: {
      bookNow: "Reserve",
      from: "from",
      perNight: "per night",
      guests: "guests",
      viewDetails: "View details",
      checkIn: "Check-in",
      checkOut: "Check-out",
      adults: "Adults",
      children: "Children",
      rooms: "Rooms",
      searchAvailability: "Check availability",
      nights: "nights",
      total: "Total",
      subtotal: "Subtotal",
      taxes: "Taxes & fees",
      currency: "USD",
      backToHome: "Back to home",
      language: "Language",
    },
    home: {
      heroKicker: "Giza · Egypt",
      heroTitle: "Stay Above History",
      heroSubtitle:
        "A luxury residence on the Giza Plateau, facing the last wonder of the ancient world.",
      explore: "Explore the Hotel",
      reserve: "Reserve a Stay",
      roomsTitle: "Rooms & Suites",
      roomsSubtitle: "Considered spaces facing the Pyramids of Giza.",
      experiencesTitle: "Pyramids at Dawn",
      experiencesSubtitle:
        "The view that defines the property. Watch the plateau turn to gold from your window.",
      amenitiesTitle: "A Quiet Luxury",
      diningTitle: "Dining",
      diningSubtitle: "Culinary experiences rooted in Egyptian hospitality.",
      visitTitle: "Plan Your Stay",
    },
  },
  ar: {
    dir: "rtl",
    nav: {
      home: "الرئيسية",
      rooms: "الغرف",
      suites: "الأجنحة",
      offers: "العروض",
      dining: "المطاعم",
      spa: "السبا",
      experiences: "التجارب",
      gallery: "المعرض",
      about: "عن الفندق",
      contact: "اتصل بنا",
      booking: "احجز الآن",
      account: "حسابي",
      signIn: "تسجيل الدخول",
      signOut: "تسجيل الخروج",
      reservations: "حجوزاتي",
    },
    common: {
      bookNow: "احجز",
      from: "ابتداءً من",
      perNight: "في الليلة",
      guests: "ضيوف",
      viewDetails: "عرض التفاصيل",
      checkIn: "الوصول",
      checkOut: "المغادرة",
      adults: "بالغون",
      children: "أطفال",
      rooms: "غرف",
      searchAvailability: "تحقق من التوفر",
      nights: "ليالٍ",
      total: "الإجمالي",
      subtotal: "المجموع الفرعي",
      taxes: "الضرائب والرسوم",
      currency: "USD",
      backToHome: "العودة للرئيسية",
      language: "اللغة",
    },
    home: {
      heroKicker: "الجيزة · مصر",
      heroTitle: "أقِم فوق التاريخ",
      heroSubtitle:
        "إقامة فاخرة على هضبة الجيزة، في مواجهة آخر عجائب العالم القديم.",
      explore: "استكشف الفندق",
      reserve: "احجز إقامتك",
      roomsTitle: "الغرف والأجنحة",
      roomsSubtitle: "مساحات مدروسة بإطلالة على أهرامات الجيزة.",
      experiencesTitle: "الأهرامات عند الفجر",
      experiencesSubtitle:
        "الإطلالة التي تميز الفندق. شاهد الهضبة تتحول إلى ذهب من نافذتك.",
      amenitiesTitle: "رفاهية هادئة",
      diningTitle: "المطاعم",
      diningSubtitle: "تجارب طعام جذورها الضيافة المصرية.",
      visitTitle: "خطِّط لإقامتك",
    },
  },
};

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "ar";
}