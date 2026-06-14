import type { NavDropdownItem } from '@/components/NavDropdown'

export const NAV_PRODUCT: NavDropdownItem[] = [
  { label: 'Compile', href: '/#compile', description: 'Turn an idea into a structured strategy' },
  { label: 'How It Works', href: '/#how-it-works', description: 'NL → spec → risk → Playbook' },
  { label: 'Strategy Vault', href: '/#vault', description: 'Save up to 10 strategies locally' },
]

export const NAV_DEVELOPERS: NavDropdownItem[] = [
  { label: 'API Reference', href: '/docs', description: 'Endpoints, schemas, examples' },
  { label: 'Integration Prompt', href: '/docs#integration-prompt', description: 'Drop into any LLM' },
  { label: 'OpenAPI Spec', href: '/api/v1/openapi', description: 'Machine-readable contract' },
  {
    label: 'MCP Server',
    href: 'https://github.com/mojeebdev/moou/tree/main/mcp-server',
    description: 'Cursor, Grok Build, Codex & more',
    external: true,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/mojeebdev/moou',
    description: 'Source & API.md',
    external: true,
  },
]