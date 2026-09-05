import Cover from "@/components/Cover";
import Section from "@/components/Section";
import { SportCard } from "@/components/Cards";
import { getSports } from "@/lib/content";

export const metadata = { title: "Sports" };

export default async function SportsPage() {
  const sports = await getSports();
  return (
    <>
      <Cover
        eyebrow="Sports"
        title="Five sports, one standard"
        subtitle="Each sport we run has its own leagues, circuits and pathways — all organised to the same high bar."
        image="/covers/basketball-circuit.svg"
      />

      <Section
        eyebrow="What we run"
        title="Pick a sport to explore"
        subtitle="From 20-over cricket to 3x3 basketball, there's a competition for every level."
      >
        <div className="grid grid-auto">
          {sports.map((s) => (
            <SportCard key={s.slug} sport={s} />
          ))}
        </div>
      </Section>
    </>
  );
}
