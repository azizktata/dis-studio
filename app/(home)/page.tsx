import { redirect } from "next/navigation";

/**
 * v1 is the default concept. It lives under /v1 with its own root layout (its
 * own fonts and <html>), so the home route redirects rather than re-exporting —
 * re-exporting would render v1's markup without v1's layout.
 */
export default function Home() {
  redirect("/v1");
}
