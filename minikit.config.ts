const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  "http://localhost:3000";

/**
 * MiniApp configuration object. Must follow the mini app manifest specification.
 *
 * @see {@link https://docs.base.org/mini-apps/features/manifest}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "eyJmaWQiOjE0ODk4MTUsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhlNTA3N2FEOTk3MERjRThiOEY3YTM0YkQ1NzU5NGRkMGE1NENBNzIyIn0",
    payload: "eyJkb21haW4iOiJudWJ0YW5nLmNvbSJ9",
    signature: "MHg0MjgzYzZlMTVmYjMzZjdlZWVmYTBhMDFjMTdhZDJlN2NjYTFjMDYxNGIxMmY3ODJmMzEyN2MxYTk0YThkZjc3MTU2NmNmNmRiMzQ4NjE2NDk0MjgwMmUyZDkwNjNiNGMzZDBkYzI3YmYwMWFmNTJhODMyNGYxODhmNzJhYzYzMTFj",
  },
  baseBuilder: {
    ownerAddress: "0xe5077aD9970DcE8b8F7a34bD57594dd0a54CA722",
  },
  miniapp: {
    version: "1",
    name: "Nubtang",
    subtitle: "Crypto DCA & Auto-Invest",
    description: "Automate your wealth creation with Nubtang. The easiest way to Dollar Cost Average (DCA) into your favorite assets on Base.",
    screenshotUrls: [],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#0e0e10",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "finance",
    tags: ["defi", "investment", "dca"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "Accumulate Wealth Effortlessly",
    ogTitle: "Nubtang - Crypto Auto-Invest",
    ogDescription: "Start automating your crypto investments today. Secure, simple, and built on Base.",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;
