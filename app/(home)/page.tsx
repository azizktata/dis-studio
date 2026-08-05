import { redirect } from "next/navigation";

/**
 * v3 is the default concept. Each version lives under its own route with its
 * own root layout (its own fonts and <html>), so the home route redirects
 * rather than re-exporting — re-exporting would render the markup without the
 * matching layout.
 */
export default function Home() {
  redirect("/v1");
}
