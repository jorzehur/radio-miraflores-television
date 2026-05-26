import { type Plugin, tool } from "@opencode-ai/plugin"
import * as fs from "node:fs"
import * as path from "node:path"

const SKILL_NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/

export const SkillCreatorPlugin: Plugin = async ({ worktree }) => {
  return {
    tool: {
      "skill-creator-create": tool({
        description:
          "Create a new opencode skill with a SKILL.md file. Generates the directory structure and validates the skill name. Use this when you need to create a new reusable skill.",
        args: {
          name: tool.schema
            .string()
            .describe(
              "Skill name: lowercase, hyphens only, 1-64 chars (e.g. 'my-skill')"
            ),
          description: tool
            .schemaString()
            .describe(
              "One-sentence description of what the skill does and when to use it (1-1024 chars)"
            ),
          content: tool
            .schemaString()
            .describe(
              "Markdown body of the skill. Include instructions, examples, references."
            ),
          license: tool
            .schemaString()
            .optional()
            .describe("Optional SPDX license identifier"),
        },
        async execute(args) {
          const { name, description, content, license } = args

          if (!SKILL_NAME_RE.test(name)) {
            return `Error: Invalid skill name "${name}". Must match: lowercase, hyphens only, no consecutive hyphens, no leading/trailing hyphens.`
          }
          if (name.length > 64) {
            return `Error: Skill name must be 1-64 characters.`
          }
          if (!description || description.length === 0) {
            return `Error: Description is required (1-1024 chars).`
          }
          if (description.length > 1024) {
            return `Error: Description must be 1024 characters or fewer.`
          }

          const skillsDir = path.join(worktree, ".opencode", "skills", name)
          const skillFile = path.join(skillsDir, "SKILL.md")

          if (fs.existsSync(skillFile)) {
            return `Warning: Skill "${name}" already exists at ${skillFile}.`
          }

          fs.mkdirSync(skillsDir, { recursive: true })

          let frontmatter = `---
name: ${name}
description: ${description}
`
          if (license) {
            frontmatter += `license: ${license}
`
          }

          frontmatter += `---

${content}
`
          fs.writeFileSync(skillFile, frontmatter, "utf-8")

          return `Skill "${name}" created successfully at ${skillFile}. Restart opencode for it to be discovered.`
        },
      }),
    },
  }
}
