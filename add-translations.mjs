import { readFileSync, writeFileSync } from "fs";

const enPath = "./messages/en.json";
const trPath = "./messages/tr.json";
const zhPath = "./messages/zh.json";

const en = JSON.parse(readFileSync(enPath, "utf8"));
const tr = JSON.parse(readFileSync(trPath, "utf8"));
const zh = JSON.parse(readFileSync(zhPath, "utf8"));

// Helper to add nested keys
function addKey(obj, path, value) {
  const keys = path.split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

// ============== AdminPanel.layout ==============
addKey(en, "AdminPanel.layout.title", "Admin Panel");
addKey(
  en,
  "AdminPanel.layout.authRequired",
  "You must sign in with an admin account to access this page.",
);
addKey(
  en,
  "AdminPanel.layout.demoCredentials",
  "Demo: admin@portalevents.co / admin123",
);
addKey(en, "AdminPanel.layout.login", "Sign In");

addKey(tr, "AdminPanel.layout.title", "Yönetim Paneli");
addKey(
  tr,
  "AdminPanel.layout.authRequired",
  "Bu sayfaya erişmek için admin hesabıyla giriş yapmalısınız.",
);
addKey(
  tr,
  "AdminPanel.layout.demoCredentials",
  "Demo: admin@portalevents.co / admin123",
);
addKey(tr, "AdminPanel.layout.login", "Giriş Yap");

addKey(zh, "AdminPanel.layout.title", "管理面板");
addKey(
  zh,
  "AdminPanel.layout.authRequired",
  "访问此页面需要使用管理员账户登录。",
);
addKey(
  zh,
  "AdminPanel.layout.demoCredentials",
  "Demo: admin@portalevents.co / admin123",
);
addKey(zh, "AdminPanel.layout.login", "登录");

// ============== OrganizerPanel.layout ==============
addKey(en, "OrganizerPanel.layout.title", "Organizer Panel");
addKey(
  en,
  "OrganizerPanel.layout.authRequired",
  "You must sign in with an organizer account to access this page.",
);
addKey(
  en,
  "OrganizerPanel.layout.demoCredentials",
  "Demo: organizer@portalevents.co / org123",
);
addKey(en, "OrganizerPanel.layout.login", "Sign In");

addKey(tr, "OrganizerPanel.layout.title", "Organizatör Paneli");
addKey(
  tr,
  "OrganizerPanel.layout.authRequired",
  "Bu sayfaya erişmek için organizatör hesabıyla giriş yapmalısınız.",
);
addKey(
  tr,
  "OrganizerPanel.layout.demoCredentials",
  "Demo: organizer@portalevents.co / org123",
);
addKey(tr, "OrganizerPanel.layout.login", "Giriş Yap");

addKey(zh, "OrganizerPanel.layout.title", "组织者面板");
addKey(
  zh,
  "OrganizerPanel.layout.authRequired",
  "访问此页面需要使用组织者账户登录。",
);
addKey(
  zh,
  "OrganizerPanel.layout.demoCredentials",
  "Demo: organizer@portalevents.co / org123",
);
addKey(zh, "OrganizerPanel.layout.login", "登录");

// ============== ImageUpload (new namespace) ==============
en.ImageUpload = {
  change: "Change",
  dropToUpload: "Drop to upload",
  click: "Click",
  orDragAndDrop: "or drag and drop",
  fileTypes: "PNG, JPG, WEBP — max. 10MB",
  addByUrl: "Add by URL",
  add: "Add",
  orDrag: "or drag",
  imageCount: "{count}/{max} images",
};

tr.ImageUpload = {
  change: "Değiştir",
  dropToUpload: "Bırakarak yükle",
  click: "Tıklayın",
  orDragAndDrop: "veya sürükleyip bırakın",
  fileTypes: "PNG, JPG, WEBP — maks. 10MB",
  addByUrl: "URL ile ekle",
  add: "Ekle",
  orDrag: "veya sürükleyin",
  imageCount: "{count}/{max} görsel",
};

zh.ImageUpload = {
  change: "更换",
  dropToUpload: "拖放上传",
  click: "点击",
  orDragAndDrop: "或拖放",
  fileTypes: "PNG, JPG, WEBP — 最大 10MB",
  addByUrl: "通过URL添加",
  add: "添加",
  orDrag: "或拖放",
  imageCount: "{count}/{max} 图片",
};

// ============== Hero additions ==============
addKey(en, "Hero.searchFollowers", "followers");
addKey(en, "Hero.searchUpcoming", "events");
addKey(en, "Hero.searchCapacity", "people");

addKey(tr, "Hero.searchFollowers", "takipçi");
addKey(tr, "Hero.searchUpcoming", "etkinlik");
addKey(tr, "Hero.searchCapacity", "kişi");

addKey(zh, "Hero.searchFollowers", "粉丝");
addKey(zh, "Hero.searchUpcoming", "活动");
addKey(zh, "Hero.searchCapacity", "人");

// ============== FeaturedEvents additions ==============
addKey(en, "FeaturedEvents.cursorExplore", "Explore");
addKey(tr, "FeaturedEvents.cursorExplore", "Keşfet");
addKey(zh, "FeaturedEvents.cursorExplore", "探索");

// ============== VenueSpotlight additions ==============
addKey(en, "VenueSpotlight.cursorExplore", "Explore");
addKey(tr, "VenueSpotlight.cursorExplore", "Keşfet");
addKey(zh, "VenueSpotlight.cursorExplore", "探索");

// ============== VenuesPage additions ==============
addKey(en, "VenuesPage.cursorExplore", "Explore");
addKey(tr, "VenuesPage.cursorExplore", "Keşfet");
addKey(zh, "VenuesPage.cursorExplore", "探索");

// ============== ArtistsPage additions ==============
addKey(en, "ArtistsPage.cursorProfile", "Profile");
addKey(tr, "ArtistsPage.cursorProfile", "Profil");
addKey(zh, "ArtistsPage.cursorProfile", "资料");

// ============== ExploreMapPage additions ==============
addKey(en, "ExploreMapPage.mapLoading", "Loading map...");
addKey(tr, "ExploreMapPage.mapLoading", "Harita yükleniyor...");
addKey(zh, "ExploreMapPage.mapLoading", "加载地图...");

// ============== CheckoutPage additions ==============
addKey(en, "CheckoutPage.eventNotFound", "Event not found");
addKey(en, "CheckoutPage.optional", "Optional");

addKey(tr, "CheckoutPage.eventNotFound", "Etkinlik bulunamadı");
addKey(tr, "CheckoutPage.optional", "Opsiyonel");

addKey(zh, "CheckoutPage.eventNotFound", "未找到活动");
addKey(zh, "CheckoutPage.optional", "可选");

// ============== OrganizerPanel.eventForm additions (calendar days) ==============
const dayKeys = [
  "dayMon",
  "dayTue",
  "dayWed",
  "dayThu",
  "dayFri",
  "daySat",
  "daySun",
];
const enDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const trDays = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const zhDays = ["一", "二", "三", "四", "五", "六", "日"];
dayKeys.forEach((key, i) => {
  addKey(en, `OrganizerPanel.eventForm.${key}`, enDays[i]);
  addKey(tr, `OrganizerPanel.eventForm.${key}`, trDays[i]);
  addKey(zh, `OrganizerPanel.eventForm.${key}`, zhDays[i]);
});

// ============== OrganizerPanel.eventForm more additions ==============
addKey(
  en,
  "OrganizerPanel.eventForm.defaultTicketDesc",
  "Standard entry ticket",
);
addKey(en, "OrganizerPanel.eventForm.capacitySuffix", "capacity");

addKey(
  tr,
  "OrganizerPanel.eventForm.defaultTicketDesc",
  "Standart giriş bileti",
);
addKey(tr, "OrganizerPanel.eventForm.capacitySuffix", "kişilik");

addKey(zh, "OrganizerPanel.eventForm.defaultTicketDesc", "标准入场票");
addKey(zh, "OrganizerPanel.eventForm.capacitySuffix", "人容量");

// ============== OrganizerPanel.venueForm additions ==============
addKey(en, "OrganizerPanel.venueForm.closed", "Closed");
addKey(tr, "OrganizerPanel.venueForm.closed", "Kapalı");
addKey(zh, "OrganizerPanel.venueForm.closed", "已关闭");

// ============== OrganizerPanel.logs additions (CSV headers) ==============
addKey(en, "OrganizerPanel.logs.csvDate", "Date");
addKey(en, "OrganizerPanel.logs.csvAction", "Action");
addKey(en, "OrganizerPanel.logs.csvTicketHolder", "Ticket Holder");
addKey(en, "OrganizerPanel.logs.csvEmail", "Email");
addKey(en, "OrganizerPanel.logs.csvEvent", "Event");
addKey(en, "OrganizerPanel.logs.csvTicketType", "Ticket Type");
addKey(en, "OrganizerPanel.logs.csvValidator", "Validator");
addKey(en, "OrganizerPanel.logs.csvNotes", "Notes");

addKey(tr, "OrganizerPanel.logs.csvDate", "Tarih");
addKey(tr, "OrganizerPanel.logs.csvAction", "İşlem");
addKey(tr, "OrganizerPanel.logs.csvTicketHolder", "Bilet Sahibi");
addKey(tr, "OrganizerPanel.logs.csvEmail", "E-posta");
addKey(tr, "OrganizerPanel.logs.csvEvent", "Etkinlik");
addKey(tr, "OrganizerPanel.logs.csvTicketType", "Bilet Türü");
addKey(tr, "OrganizerPanel.logs.csvValidator", "Onaylayan");
addKey(tr, "OrganizerPanel.logs.csvNotes", "Notlar");

addKey(zh, "OrganizerPanel.logs.csvDate", "日期");
addKey(zh, "OrganizerPanel.logs.csvAction", "操作");
addKey(zh, "OrganizerPanel.logs.csvTicketHolder", "持票人");
addKey(zh, "OrganizerPanel.logs.csvEmail", "电子邮件");
addKey(zh, "OrganizerPanel.logs.csvEvent", "活动");
addKey(zh, "OrganizerPanel.logs.csvTicketType", "票类型");
addKey(zh, "OrganizerPanel.logs.csvValidator", "验证者");
addKey(zh, "OrganizerPanel.logs.csvNotes", "备注");

// ============== OrganizerPanel.settings additions ==============
addKey(en, "OrganizerPanel.settings.usernamePlaceholder", "@username");
addKey(en, "OrganizerPanel.settings.channelPlaceholder", "channel-name");

addKey(tr, "OrganizerPanel.settings.usernamePlaceholder", "@kullanici");
addKey(tr, "OrganizerPanel.settings.channelPlaceholder", "kanal-adi");

addKey(zh, "OrganizerPanel.settings.usernamePlaceholder", "@用户名");
addKey(zh, "OrganizerPanel.settings.channelPlaceholder", "频道名称");

// ============== OrganizerPanel.venueCalendar additions (calendar days) ==============
dayKeys.forEach((key, i) => {
  addKey(en, `OrganizerPanel.venueCalendar.${key}`, enDays[i]);
  addKey(tr, `OrganizerPanel.venueCalendar.${key}`, trDays[i]);
  addKey(zh, `OrganizerPanel.venueCalendar.${key}`, zhDays[i]);
});

// ============== OrganizerPanel.doping additions (duration/features) ==============
addKey(en, "OrganizerPanel.doping.days", "days");
addKey(tr, "OrganizerPanel.doping.days", "gün");
addKey(zh, "OrganizerPanel.doping.days", "天");

// Doping features
addKey(en, "OrganizerPanel.doping.features.featuredBadge", "Featured badge");
addKey(
  en,
  "OrganizerPanel.doping.features.gradientBorder",
  "Gradient border design",
);
addKey(
  en,
  "OrganizerPanel.doping.features.homepageTopVisibility",
  "Homepage top row visibility",
);
addKey(en, "OrganizerPanel.doping.features.trendingIcon", "Trending icon");
addKey(en, "OrganizerPanel.doping.features.popularBadge", "Popular badge");
addKey(
  en,
  "OrganizerPanel.doping.features.exploreTopRow",
  "Explore page top row",
);
addKey(
  en,
  "OrganizerPanel.doping.features.editorPickBadge",
  "Editor's pick badge",
);
addKey(
  en,
  "OrganizerPanel.doping.features.eventsTopRow",
  "Events page top row",
);
addKey(
  en,
  "OrganizerPanel.doping.features.customCardDesign",
  "Custom card design",
);

addKey(tr, "OrganizerPanel.doping.features.featuredBadge", "Öne çıkan badge");
addKey(
  tr,
  "OrganizerPanel.doping.features.gradientBorder",
  "Gradient border tasarım",
);
addKey(
  tr,
  "OrganizerPanel.doping.features.homepageTopVisibility",
  "Anasayfa üst sıra görünürlük",
);
addKey(tr, "OrganizerPanel.doping.features.trendingIcon", "Trending icon");
addKey(tr, "OrganizerPanel.doping.features.popularBadge", "Popüler badge");
addKey(
  tr,
  "OrganizerPanel.doping.features.exploreTopRow",
  "Keşfet sayfası üst sıra",
);
addKey(
  tr,
  "OrganizerPanel.doping.features.editorPickBadge",
  "Editörün seçimi badge",
);
addKey(
  tr,
  "OrganizerPanel.doping.features.eventsTopRow",
  "Etkinlikler sayfası üst sıra",
);
addKey(
  tr,
  "OrganizerPanel.doping.features.customCardDesign",
  "Özel kart tasarımı",
);

addKey(zh, "OrganizerPanel.doping.features.featuredBadge", "精选徽章");
addKey(zh, "OrganizerPanel.doping.features.gradientBorder", "渐变边框设计");
addKey(
  zh,
  "OrganizerPanel.doping.features.homepageTopVisibility",
  "首页顶部可见性",
);
addKey(zh, "OrganizerPanel.doping.features.trendingIcon", "趋势图标");
addKey(zh, "OrganizerPanel.doping.features.popularBadge", "热门徽章");
addKey(zh, "OrganizerPanel.doping.features.exploreTopRow", "探索页面顶部");
addKey(zh, "OrganizerPanel.doping.features.editorPickBadge", "编辑精选徽章");
addKey(zh, "OrganizerPanel.doping.features.eventsTopRow", "活动页面顶部");
addKey(zh, "OrganizerPanel.doping.features.customCardDesign", "定制卡片设计");

// CustomSelect namespace
en.CustomSelect = {
  defaultPlaceholder: "Select...",
  defaultSearchPlaceholder: "Search...",
};
tr.CustomSelect = {
  defaultPlaceholder: "Seçiniz...",
  defaultSearchPlaceholder: "Ara...",
};
zh.CustomSelect = {
  defaultPlaceholder: "请选择...",
  defaultSearchPlaceholder: "搜索...",
};

// Write
writeFileSync(enPath, JSON.stringify(en, null, 2) + "\n", "utf8");
writeFileSync(trPath, JSON.stringify(tr, null, 2) + "\n", "utf8");
writeFileSync(zhPath, JSON.stringify(zh, null, 2) + "\n", "utf8");

// Verify counts
const en2 = JSON.parse(readFileSync(enPath, "utf8"));
const tr2 = JSON.parse(readFileSync(trPath, "utf8"));
const zh2 = JSON.parse(readFileSync(zhPath, "utf8"));

function countKeys(obj, prefix = "") {
  let count = 0;
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      count += countKeys(obj[key], prefix + key + ".");
    } else {
      count++;
    }
  }
  return count;
}

console.log("EN keys:", countKeys(en2));
console.log("TR keys:", countKeys(tr2));
console.log("ZH keys:", countKeys(zh2));
console.log("New namespaces added: ImageUpload, CustomSelect");
console.log(
  "Extended namespaces: AdminPanel, OrganizerPanel, Hero, FeaturedEvents, VenueSpotlight, VenuesPage, ArtistsPage, ExploreMapPage, CheckoutPage",
);
