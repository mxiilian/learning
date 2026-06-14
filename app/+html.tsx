import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
    return (
        <html lang="de">
            <head>
                <meta charSet="utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                />
                <ScrollViewStyleReset />
                <style dangerouslySetInnerHTML={{
                    __html: `
                        html, body { background-color: #090910; height: 100%; margin: 0; }
                        #root { height: 100dvh; background-color: #090910; }
                    `
                }} />
            </head>
            <body>{children}</body>
        </html>
    );
}
