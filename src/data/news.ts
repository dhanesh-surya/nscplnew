import type { NewsArticle } from "./types";

export const news: NewsArticle[] = [
  {
    slug: "registrations-open-dpcl-2026",
    title: "Registrations open for the Delhi Premier Cricket League 2026",
    date: "2026-08-22",
    category: "Cricket",
    author: "NSCPL Media",
    excerpt:
      "Club sides can now register for the ninth season of the Delhi Premier Cricket League. Sixteen berths are up for grabs.",
    body: [
      "Registrations for the Delhi Premier Cricket League 2026 are officially open. Club sides with a minimum of 14 registered players can apply through the NSCPL events desk.",
      "The league returns with neutral umpiring panels, live digital scorecards and a dedicated young-player spotlight. Group draws will be announced four weeks before the first ball.",
      "Interested clubs should reach out via the contact page. Early-bird entries close at the end of September.",
    ],
    cover: "/covers/cricket-league.svg",
    featured: true,
  },
  {
    slug: "3x3-circuit-adds-two-cities",
    title: "National 3x3 Basketball Circuit adds two new host cities",
    date: "2026-08-10",
    category: "Basketball",
    author: "NSCPL Media",
    excerpt:
      "By popular demand, the 3x3 street circuit expands to eight city stops including Jaipur and Ahmedabad for the 2026 season.",
    body: [
      "The National 3x3 Basketball Circuit is growing. Following record turnout in 2025, NSCPL is adding Jaipur and Ahmedabad to the 2026 calendar, bringing the total to eight city stops.",
      "Each stop remains a community festival with music, food and open shooting challenges, while city champions earn a direct berth to the national finals weekend.",
      "Mixed and women's divisions continue to be a core part of the circuit.",
    ],
    cover: "/covers/basketball-circuit.svg",
    featured: true,
  },
  {
    slug: "youth-athletics-meet-recap",
    title: "Summer Youth Athletics Meet breaks participation record",
    date: "2026-07-21",
    category: "Athletics",
    author: "NSCPL Media",
    excerpt:
      "Over 600 young athletes competed at this year's meet, with twelve invited to the state preparatory camp.",
    body: [
      "The Summer Youth Athletics Meet concluded as our largest edition yet, with more than 600 U-14 and U-17 athletes on the track and field.",
      "Certified electronic timing and a public results portal gave families instant access to performances, and twelve standout athletes received invitations to the state preparatory camp.",
      "We thank the University Sports Centre and all volunteer officials who made the meet possible.",
    ],
    cover: "/covers/athletics-meet.svg",
  },
  {
    slug: "corporate-trophy-dates-announced",
    title: "Corporate Champions Trophy 2026 dates announced",
    date: "2026-06-30",
    category: "Football",
    author: "NSCPL Media",
    excerpt:
      "The flagship corporate football cup returns to Bengaluru this November with a bigger knockout day and new fair-play awards.",
    body: [
      "NSCPL has confirmed the 2026 Corporate Champions Trophy will take place in November at the City Football Complex in Bengaluru.",
      "The 7-a-side competition returns with full medical and referee cover, a tournament app, and expanded fair-play awards alongside the champions and runners-up trophies.",
      "Company teams can reserve early-bird slots through the contact page.",
    ],
    cover: "/covers/football-trophy.svg",
  },
  {
    slug: "community-run-series-wraps",
    title: "Community Run Series raises record funds for youth sport",
    date: "2026-05-18",
    category: "Running",
    author: "NSCPL Media",
    excerpt:
      "The 2026.run series saw its biggest turnout and its largest charitable contribution to date.",
    body: [
      "The Community Run Series 2026 wrapped with a record number of finishers across the 5K and 10K, and its largest-ever charitable contribution to local sports-for-youth programmes.",
      "Every participant received a finisher medal, with timed results and photos published within 48 hours.",
      "Planning is already underway for a winter edition later in the year.",
    ],
    cover: "/covers/run-series.svg",
  },
];

export function getArticle(slug: string): NewsArticle | undefined {
  return news.find((n) => n.slug === slug);
}
