import { readFileSync } from "fs";
const en = JSON.parse(readFileSync("./messages/en.json", "utf8"));
const tr = JSON.parse(readFileSync("./messages/tr.json", "utf8"));
const zh = JSON.parse(readFileSync("./messages/zh.json", "utf8"));

const namespaces = new Set([
  ...Object.keys(en),
  ...Object.keys(tr),
  ...Object.keys(zh),
]);
console.log("All namespaces:", [...namespaces].sort().join(", "));

const checks = [
  "AdminLayout",
  "OrganizerLayout",
  "ImageUpload",
  "ExploreMap",
  "Checkout",
  "OrganizerLogs",
  "OrganizerSettings",
  "OrganizerNewEvent",
  "OrganizerEditEvent",
  "OrganizerNewVenue",
  "DopingPackages",
];
checks.forEach((ns) => {
  console.log(
    `\n${ns} exists in en: ${!!en[ns]}, tr: ${!!tr[ns]}, zh: ${!!zh[ns]}`,
  );
  if (en[ns]) console.log("  en keys:", Object.keys(en[ns]).join(", "));
});

[
  "Hero",
  "FeaturedEvents",
  "VenueSpotlight",
  "VenuesPage",
  "ArtistsPage",
  "Common",
  "OrganizerEvents",
  "OrganizerVenueCalendar",
].forEach((ns) => {
  if (en[ns]) {
    console.log(`\n${ns} en keys:`, Object.keys(en[ns]).join(", "));
  }
});
