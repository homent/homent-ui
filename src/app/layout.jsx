import Providers from "./providers";
import "./globals.css";

export const metadata = {
  title: "HomeFlux",
  description: "HomeFlux application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
