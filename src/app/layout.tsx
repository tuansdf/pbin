import { MantineProvider } from "@/client/lib/mantine-provider";
import { ColorSchemeScript } from "@mantine/core";
import { ReactNode } from "react";
import "@/app/styles";

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Readonly<Props>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Pbin</title>

        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}
