import type { SportItem } from "./types";

export const sports: SportItem[] = [
  {
    slug: "cricket",
    name: "Cricket",
    tagline: "Leagues, cups and community cricket",
    description:
      "From neighbourhood tape-ball tournaments to the premier 20-over league, cricket is where NSCPL began. We organise structured leagues with certified officials, digital scorecards and clear pathways for emerging players.",
    icon: "🏏",
    cover: "/covers/cricket-league.svg",
    programs: [
      "Delhi Premier Cricket League (20-over)",
      "Corporate & club T20 cups",
      "Youth development squads",
      "Umpire & scorer training",
    ],
  },
  {
    slug: "football",
    name: "Football",
    tagline: "Grassroots to corporate cups",
    description:
      "We run 7-a-side corporate tournaments, academy leagues and community football festivals. Pitches, referees and a tournament app come as standard so teams can just play.",
    icon: "⚽",
    cover: "/covers/football-trophy.svg",
    programs: [
      "Corporate Champions Trophy (7-a-side)",
      "Academy & school leagues",
      "Community football festivals",
      "Coaching clinics",
    ],
  },
  {
    slug: "basketball",
    name: "Basketball",
    tagline: "Fast 3x3 and classic 5x5",
    description:
      "Our basketball programme spans the high-energy 3x3 street circuit and traditional 5x5 leagues, with mixed and women's divisions and a clear route to national finals.",
    icon: "🏀",
    cover: "/covers/basketball-circuit.svg",
    programs: [
      "National 3x3 Circuit",
      "Open 5x5 leagues",
      "Women's & mixed divisions",
      "Hoop camps for juniors",
    ],
  },
  {
    slug: "athletics",
    name: "Athletics",
    tagline: "Track, field and the next generation",
    description:
      "Youth athletics meets with electronic timing and qualified officials give young athletes a real competitive pathway, including invitations to state preparatory camps.",
    icon: "🏃",
    cover: "/covers/athletics-meet.svg",
    programs: [
      "Summer Youth Athletics Meet",
      "Open track & field days",
      "School relay championships",
      "Timing & officiating support",
    ],
  },
  {
    slug: "running",
    name: "Running",
    tagline: "Community runs that give back",
    description:
      "Feel-good 5K and 10K runs open to every fitness level, with every entry supporting local sports charities. Timed results and finisher medals for all.",
    icon: "🏅",
    cover: "/covers/run-series.svg",
    programs: [
      "Community Run Series (5K / 10K)",
      "Charity fun runs",
      "Corporate wellness runs",
      "Timed results & photos",
    ],
  },
];

export function getSport(slug: string): SportItem | undefined {
  return sports.find((s) => s.slug === slug);
}
