# Aboard UI contributor rules

- This repository owns standalone presentation components, not Nexus runtime/Host/contracts.
- Keep upstream source records and licenses intact; see packages/UI-PORTING.md and scoped rules.
- Build UI before AI UI. Run pnpm run check and the archive consumer before releasing.
- Use pnpm pack, not npm pack; verify archive exports target dist before publishing.
- Do not publish credentials, private application code, node_modules, dist or .data in Git.
- Publishing is an explicit operation; never force-push or overwrite published versions.
