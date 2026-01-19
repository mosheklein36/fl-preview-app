## Packages
framer-motion | Smooth page transitions and list animations
date-fns | Formatting timestamps (e.g., "2 hours ago")
lucide-react | Icons (already in base stack, but confirming usage)

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
  mono: ["var(--font-mono)"],
}

Firebase Storage Integration:
- Backend handles fetching file lists from Firebase Storage
- Frontend expects GET /api/projects to return grouped project data
- Audio URLs in the response are direct public links to Firebase Storage files
