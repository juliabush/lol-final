   // src/app/[locale]/404.tsx
   import { useEffect } from 'react';
   import { useRouter } from 'next/router';

   export default function Custom404() {
     const router = useRouter();

     useEffect(() => {
       // Track the 404 event
       if (window.gtag) {
         window.gtag('event', '404', {
           page_path: router.asPath,
         });
       }
     }, [router]);

     return <h1>404 - Page Not Found</h1>;
   }