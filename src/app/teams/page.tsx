import Cover from "@/components/Cover";
import Section from "@/components/Section";
import { TeamCard } from "@/components/Cards";
import { getTeams } from "@/lib/content";

export const metadata = { title: "Teams" };

export default async function TeamsPage() {
  const teams = await getTeams();
  return (
    <>
      <Cover
        eyebrow="Teams"
        title="The clubs who make it happen"
        subtitle="A snapshot of partner clubs competing across NSCPL leagues and circuits."
        image="/covers/cricket-league.svg"
      />

      <Section
        eyebrow="Our teams"
        title={`${teams.length} partner clubs`}
        subtitle="From reigning champions to fast-rising community sides."
      >
        <div className="grid grid-auto">
          {teams.map((t) => (
            <TeamCard key={t.slug} team={t} />
          ))}
        </div>
      </Section>
    </>
  );
}
