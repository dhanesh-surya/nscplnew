import type { EventItem } from "./types";

export const events: EventItem[] = [
  {
    slug: "delhi-premier-cricket-league-2026",
    title: "Delhi Premier Cricket League 2026",
    category: "Cricket",
    date: "2026-10-12",
    venue: "RSKV Cricket Ground",
    city: "New Delhi",
    status: "open",
    summary:
      "The flagship 20-over league returns with 16 club sides battling across three weekends for the city title.",
    body: [
      "The Delhi Premier Cricket League is NSCPL's longest-running competition, now in its ninth season. Sixteen clubs are split into two groups, followed by knockout semi-finals and a grand final under lights.",
      "Matches use standardized playing conditions, neutral umpiring panels and a live digital scorecard available to every fan. Team registrations are open for club sides with a minimum of 14 registered players.",
      "Beyond the trophy, the league spotlights emerging talent through a dedicated 'Young Player of the Season' award and scouting presence from regional academies.",
    ],
    cover: "/covers/cricket-league.svg",
    highlights: [
      "16 club sides, 3 weekends",
      "Live digital scorecards",
      "Under-23 player spotlight",
    ],
  },
  {
    slug: "national-3x3-basketball-circuit",
    title: "National 3x3 Basketball Circuit",
    category: "Basketball",
    date: "2026-09-05",
    venue: "Phoenix Mall Court",
    city: "Mumbai",
    status: "open",
    summary:
      "A fast-paced 3x3 street circuit stopping in six cities, culminating in a national finals weekend.",
    body: [
      "Our 3x3 circuit brings the energy of street basketball to six host cities. Teams of four compete in a continuous 10-minute clock format that rewards skill and stamina.",
      "Each city stop doubles as a community festival with music, food stalls and open shooting challenges for spectators. City champions earn a direct berth to the national finals.",
      "The circuit is open to mixed and women's divisions, with a clear pathway from local courts to the national stage.",
    ],
    cover: "/covers/basketball-circuit.svg",
    highlights: [
      "6 city stops",
      "Mixed & women's divisions",
      "National finals weekend",
    ],
  },
  {
    slug: "corporate-champions-trophy-football",
    title: "Corporate Champions Trophy (Football)",
    category: "Football",
    date: "2026-11-20",
    venue: "City Football Complex",
    city: "Bengaluru",
    status: "upcoming",
    summary:
      "A flagship corporate football cup designed as the ultimate team-building sporting day for companies.",
    body: [
      "The Corporate Champions Trophy is a 7-a-side football competition built for companies of every size. Round-robin group stages lead to a knockout day with medals, photography and a post-match networking lunch.",
      "We handle pitches, referees, medical cover and a tournament app so HR teams can simply turn up and play. Trophies are awarded for champions, runners-up and fair play.",
      "Past editions have drawn 40+ company teams and become a highlight of the annual corporate calendar.",
    ],
    cover: "/covers/football-trophy.svg",
    highlights: [
      "7-a-side company teams",
      "Full medical & referee cover",
      "Fair-play awards",
    ],
  },
  {
    slug: "summer-youth-athletics-meet",
    title: "Summer Youth Athletics Meet",
    category: "Athletics",
    date: "2026-07-18",
    venue: "University Sports Centre",
    city: "Pune",
    status: "past",
    summary:
      "A two-day track and field meet for U-14 and U-17 athletes with qualifying standards for the state championship.",
    body: [
      "The Summer Youth Athletics Meet welcomed over 600 young athletes across sprints, middle-distance, jumps and throws. It is a celebration of grassroots sport and a serious qualifying pathway.",
      "Certified electronic timing, qualified officials and a results portal gave families instant access to performances. Top performers received invitations to the state preparatory camp.",
      "The meet is subsidised for school participants to keep competitive athletics accessible.",
    ],
    cover: "/covers/athletics-meet.svg",
    highlights: [
      "600+ U-14 / U-17 athletes",
      "Electronic timing",
      "State camp invitations",
    ],
  },
  {
    slug: "community-run-series-2026",
    title: "Community Run Series 2026",
    category: "Running",
    date: "2026-08-30",
    venue: "Riverside Promenade",
    city: "Hyderabad",
    status: "closed",
    summary:
      "A feel-good 5K and 10K run series raising funds for local sports charities, open to all fitness levels.",
    body: [
      "The Community Run Series is our most inclusive event — a 5K fun run and a timed 10K, both open to first-timers and seasoned runners alike.",
      "Every registration supports a local sports-for-youth charity. The morning includes warm-up sessions, music and a finisher medal for all participants.",
      "Timed results and photos are published within 48 hours so runners can relive their morning.",
    ],
    cover: "/covers/run-series.svg",
    highlights: [
      "5K & 10K distances",
      "Charity-backed entries",
      "Finisher medal for all",
    ],
  },
];

export function getEvent(slug: string): EventItem | undefined {
  return events.find((e) => e.slug === slug);
}
