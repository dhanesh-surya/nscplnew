import type { TeamItem } from "./types";

export const teams: TeamItem[] = [
  {
    slug: "delhi-strikers",
    name: "Delhi Strikers",
    sport: "Cricket",
    captain: "Priya Nair",
    founded: 2016,
    homeVenue: "RSKV Cricket Ground, New Delhi",
    achievements: [
      "Delhi Premier League champions 2023",
      "Runners-up 2024",
      "Best fielding unit (3 seasons)",
    ],
    cover: "/covers/cricket-league.svg",
    members: [
      { name: "Priya Nair", role: "Captain" },
      { name: "Kabir Sethi", role: "Vice-captain" },
      { name: "Rohan Gupta", role: "Opening batter" },
      { name: "Meera Iyer", role: "Spin bowler" },
      { name: "Dev Malhotra", role: "Wicket-keeper" },
    ],
  },
  {
    slug: "northside-fc",
    name: "Northside FC",
    sport: "Football",
    captain: "Arjun Mehta",
    founded: 2018,
    homeVenue: "City Football Complex, Bengaluru",
    achievements: [
      "Corporate Champions Trophy winners 2024",
      "Youth league finalists 2025",
      "Fair-play award 2023",
    ],
    cover: "/covers/football-trophy.svg",
    members: [
      { name: "Arjun Mehta", role: "Captain" },
      { name: "Leela Thomas", role: "Coach" },
      { name: "Sam Khan", role: "Centre-back" },
      { name: "Nihal Rao", role: "Striker" },
    ],
  },
  {
    slug: "city-ballers",
    name: "City Ballers",
    sport: "Basketball",
    captain: "Tara Singh",
    founded: 2019,
    homeVenue: "Phoenix Mall Court, Mumbai",
    achievements: [
      "3x3 Circuit city champions 2025",
      "National finals participants 2024",
      "Women's division runners-up 2025",
    ],
    cover: "/covers/basketball-circuit.svg",
    members: [
      { name: "Tara Singh", role: "Captain" },
      { name: "Ivan D'Souza", role: "Playmaker" },
      { name: "Aisha Bano", role: "Forward" },
    ],
  },
  {
    slug: "riverdale-rovers",
    name: "Riverdale Rovers",
    sport: "Running",
    captain: "Neha Reddy",
    founded: 2020,
    homeVenue: "Riverside Promenade, Hyderabad",
    achievements: [
      "Community Run Series club champions 2025",
      "Largest registered running club partner",
      "Charity fundraising leaders 2024",
    ],
    cover: "/covers/run-series.svg",
    members: [
      { name: "Neha Reddy", role: "Captain" },
      { name: "Farhan Aziz", role: "Pace lead" },
      { name: "Kavya Nair", role: "Events coordinator" },
    ],
  },
  {
    slug: "track-titans",
    name: "Track Titans",
    sport: "Athletics",
    captain: "Omkar Patil",
    founded: 2017,
    homeVenue: "University Sports Centre, Pune",
    achievements: [
      "Youth Athletics Meet overall champions 2025",
      "State camp selections (12 athletes)",
      "Relay champions 2024",
    ],
    cover: "/covers/athletics-meet.svg",
    members: [
      { name: "Omkar Patil", role: "Captain" },
      { name: "Sara Qureshi", role: "Sprints coach" },
      { name: "Yash Joshi", role: "Middle-distance" },
      { name: "Anaya Kapoor", role: "Jumps" },
    ],
  },
];

export function getTeam(slug: string): TeamItem | undefined {
  return teams.find((t) => t.slug === slug);
}
