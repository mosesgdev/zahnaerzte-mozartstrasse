import "server-only";

import { assistants, dentists, teamIntro, type TeamMember } from "@content/team";
import { getJson, setJson } from "@/lib/kv";

export interface EditableTeamMember extends TeamMember {
  id: string;
  group: "dentists" | "assistants";
}

export interface TeamSettings {
  intro: typeof teamIntro;
  members: EditableTeamMember[];
}

const KEY = "zm:team-settings";

const fallbackTeamSettings: TeamSettings = {
  intro: teamIntro,
  members: [
    ...dentists.map((member, index) => ({
      ...member,
      id: `dentist-${index}-${member.name.toLowerCase().replace(/\s+/g, "-")}`,
      group: "dentists" as const,
    })),
    ...assistants.map((member, index) => ({
      ...member,
      id: `assistant-${index}-${member.name.toLowerCase().replace(/\s+/g, "-")}`,
      group: "assistants" as const,
    })),
  ],
};

function normalize(settings: TeamSettings): TeamSettings {
  return {
    intro: {
      heading: settings.intro?.heading?.trim() || teamIntro.heading,
      subheading: settings.intro?.subheading?.trim() || teamIntro.subheading,
      text: settings.intro?.text?.trim() || teamIntro.text,
    },
    members: Array.isArray(settings.members)
      ? settings.members
          .filter((member) => member.name?.trim() && member.role?.trim())
          .map((member) => ({
            id: member.id || crypto.randomUUID(),
            group: member.group === "dentists" ? "dentists" : "assistants",
            name: member.name.trim(),
            role: member.role.trim(),
            description: member.description?.trim() || undefined,
            qualifications: Array.isArray(member.qualifications)
              ? member.qualifications.map((q) => q.trim()).filter(Boolean)
              : [],
            image: member.image?.trim() || undefined,
          }))
      : fallbackTeamSettings.members,
  };
}

export async function getTeamSettings(): Promise<TeamSettings> {
  const settings = await getJson<TeamSettings>(KEY, fallbackTeamSettings);
  return normalize(settings);
}

export async function setTeamSettings(settings: TeamSettings): Promise<void> {
  await setJson(KEY, normalize(settings));
}

