import { Heading } from '@astryxdesign/core/Heading';
import {
  Layout as AstryxLayout,
  LayoutContent,
  VStack,
} from '@astryxdesign/core/Layout';
import { Text } from '@astryxdesign/core/Text';
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';

import favicon from './assets/favicon.svg?url';
import { AppearanceProvider } from './components/AppearanceProvider';
import { restoreAppearanceScript } from './lib/appearance';
import type { Route } from './+types/root';
import './styles.css';

export const links: Route.LinksFunction = () => [
  { rel: 'icon', href: favicon, type: 'image/svg+xml' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-astryx-theme="butter" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script>{restoreAppearanceScript}</script>
        <Meta />
        <Links />
      </head>
      <body>
        <AppearanceProvider>{children}</AppearanceProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let title = 'Something went wrong';
  let message = 'Please refresh the page and try again.';

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? 'Page not found' : `Error ${error.status}`;
    message =
      error.status === 404
        ? 'The page you requested does not exist.'
        : error.statusText || message;
  }

  return (
    <AstryxLayout
      height="auto"
      contentWidth="60ch"
      padding={6}
      content={
        <LayoutContent role="main" isScrollable={false}>
          <VStack gap={2}>
            <Heading level={1}>{title}</Heading>
            <Text as="p">{message}</Text>
          </VStack>
        </LayoutContent>
      }
    />
  );
}
