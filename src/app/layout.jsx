import Providers from "./providers";
import "./globals.css";

export const metadata = {
  title: "Homent",
  description: "Homent properties",
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
