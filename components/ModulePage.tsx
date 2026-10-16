"use client";
import { Page, PageHeader, Section, SectionHeader, Grid, Stack, Text } from "./primitives";
import { Button } from "./ui/Button";
import { useDemo } from "@/lib/demo";
import { STAGES, type PortalKey } from "@/lib/portals";

/* PLACEHOLDER — the frame every module is ported into. A dashboard opens on
   the greeting; every other page on its heading. Each module replaces this
   with its own page file as it is ported from Phase 1 (PHASE0-DECISIONS.md). */
export function ModulePage({ portal, slug, title, first }: { portal: PortalKey; slug: string[]; title: string; first: string }) {
  const { stage } = useDemo();
  const isDash = slug.length === 0;
  const stageTitle = STAGES.find((x) => x.key === stage)?.title;
  return (
    <Page>
      <PageHeader
        greeting={isDash ? first : undefined}
        title={title}
        desc={isDash ? (portal === "candidate" ? `Journey stage: ${stageTitle}` : "Here is where things stand today.") : "Being ported from Phase 1."}
        actions={isDash ? undefined : <Button kind="ghost" icon="download">Export</Button>}
      />
      <Section kind="block" bare>
        <Grid cols={4}>
          {["First figure", "Second figure", "Third figure", "Fourth figure"].map((t) => (
            <Stack key={t} gap={2}>
              <Text role="h4">{t}</Text>
              <Text role="display">00</Text>
              <Text role="desc">Supporting line</Text>
            </Stack>
          ))}
        </Grid>
      </Section>
      <Section>
        <SectionHeader title="Section heading" desc="A section description reads the one description grey." actions={<Button kind="link" go>View all</Button>} />
        <Text role="body">
          This placeholder shows the shared rhythm: page header, a block row that closes on air, and text
          sections that close on a hairline 32px apart. Every gap, size and colour here comes from a token.
        </Text>
      </Section>
      <Section>
        <SectionHeader title="Another section" />
        <Text role="body">Module content from Phase 1 lands here.</Text>
      </Section>
    </Page>
  );
}
