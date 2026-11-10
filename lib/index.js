/**
 * codeforge-team —— DeepSeek Harness plugin adapter.
 *
 * The repository is a plain SKILL.md skill first, and an npm-installable DSH
 * plugin second. This adapter registers the skill directory with the host's
 * skill registry so `dsh plugin --profile <name> add codeforge-team` is enough
 * to make the team available in new sessions.
 */
import { readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { isAbsolute, join, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Cordis plugin identity. */
export const name = 'codeforge-team'

/** Registry used by this provider. */
export const inject = ['skills']

const SKILL_NAME = 'codeforge-team'

/**
 * Packaged skill providers use the same precedence as bundled local roots.
 * Kept as a literal so the package has zero runtime dependencies.
 */
const BUNDLED_SKILL_RANK = 600

function fail(path, message) {
  return new Error(`codeforge-team: ${path} ${message}`)
}

/**
 * Split SKILL.md into YAML frontmatter and the model-facing body.
 * Only `name` and `description` are needed, so no YAML dependency is shipped.
 */
function parseSkill(raw, path) {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(raw)
  if (frontmatter === null) throw fail(path, 'has no YAML frontmatter')

  const descriptionLine = /^description:\s*(.*)$/mu.exec(frontmatter[1])
  if (descriptionLine === null) throw fail(path, 'has no description')

  let description = descriptionLine[1].trim()
  if (description.startsWith('"')) {
    try {
      description = JSON.parse(description)
    } catch {
      throw fail(path, 'has an invalid quoted description')
    }
  } else if (description.startsWith("'") && description.endsWith("'")) {
    description = description.slice(1, -1).replaceAll("''", "'")
  }
  if (typeof description !== 'string' || description.length === 0) {
    throw fail(path, 'has an empty description')
  }

  return {
    description,
    content: raw.slice(frontmatter[0].length).trim(),
  }
}

/**
 * Register the CodeForge skill with the harness.
 * @param ctx - Context carrying the skill registry.
 * @param config - Optional `skillRoot` for packaged or relocated deployments.
 */
export function apply(ctx, config = {}) {
  const skillRoot = config.skillRoot ?? fileURLToPath(new URL('../', import.meta.url))
  if (!isAbsolute(skillRoot)) throw fail(skillRoot, 'must be an absolute directory')

  const skillPath = join(skillRoot, 'SKILL.md')
  const { description } = parseSkill(readFileSync(skillPath, 'utf8'), skillPath)

  const candidate = {
    name: SKILL_NAME,
    description,
    invocation: {
      modelInvocable: true,
      userInvocable: true,
    },
    provider: 'codeforge-team',
    source: 'bundled',
    rank: BUNDLED_SKILL_RANK,
    resourceBase: {
      kind: 'directory',
      path: skillRoot.split(sep).join('/'),
    },
    locator: skillPath,
  }

  const provider = {
    name: 'codeforge-team',
    list: () => Promise.resolve([candidate]),
    async get(entry, options) {
      const { rank: _rank, locator, ...summary } = entry
      const content = parseSkill(
        await readFile(locator, { encoding: 'utf8', signal: options.signal }),
        locator,
      ).content
      return { ...summary, content }
    },
  }

  ctx.skills.registerProvider(() => provider)
}
