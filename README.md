![Alt](/public/guy-dumais-logo.svg "Guy Dumais")

# Next.js Strict Content Security Policy
Hash-based Strict Content Security Policy generator for Next.js to protect a single-page app (SPA) against XSS and CSP bypass.

## Why
Based on a study from Google:
1. 95% of real-world CSP deployments are bypassed.
2. 99.34% of hosts with CSP use policies that offer no benefit against XSS.

By using this package in your Next.js website you'll protect your single-page app (SPA) built with Next.js against XSS and CSP bypass.

## How to install
With NPM:
```
npm install next-strict-csp
```

With YARN:
```
yarn add next-strict-csp
```

## Basic usage
Integrate the CSP generator in your `_document.tsx` this way:
 
**_document.tsx**

```
...

// Next.js libraries
import Document, { Html, Head, Main, NextScript } from 'next/document'

// Next Strict Content Security Policy
import { NextStrictCSP } from 'next-strict-csp'

...

// Enable Head Strict CSP in production mode only
const HeadCSP = process.env.NODE_ENV === 'production' ? NextStrictCSP : Head

...

// Document component
class MyDoc extends Document {

  render() {
    return (
      <Html>
        <HeadCSP>
          { process.env.NODE_ENV === 'production' && 
          <meta httpEquiv="Content-Security-Policy" />
          }

          ...

        </HeadCSP>
        <body>

          ...

          <Main />
          <NextScript />

          ...

        </body>
      </Html>
    )
  }

}

```

## Advanced usage with inline scripts
You can also integrate any additionnal inline scripts and they'll get hashed automatically. Here's an example to add Google Tag Manager and Cloudflare Analytics inline scripts:
 
**_document.tsx**

```
...

// Next.js libraries
import Document, { Html, Head, Main, NextScript } from 'next/document'

// Next Strict Content Security Policy
import { NextStrictCSP } from 'next-strict-csp'

...

// Cloudflare Insights Script (Optional)
const cloudflareJs = `var s = document.createElement('script')
s.src = 'https://static.cloudflareinsights.com/beacon.min.js'
s.setAttribute('data-cf-beacon', '{"token": "YOUR CLOUDFLARE WEB ANALYTICS TOKEN STRING"}')
document.body.appendChild(s)`

// Google Tag Manager Script (Optional)
const GTMJs = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','YOUR GOOGLE TAG MANAGER ID STRING');`

// Next Strict CSP
// Inline scripts to hash  (Optional)
NextStrictCSP.inlineJs = [
  cloudflareJs,
  GTMJs
]

...

// Enable Head Strict CSP in production mode only
const HeadCSP = process.env.NODE_ENV === 'production' ? NextStrictCSP : Head

...

// Document component
class MyDoc extends Document {

  render() {
    return (
      <Html>
        <HeadCSP>
          { process.env.NODE_ENV === 'production' && 
          <meta httpEquiv="Content-Security-Policy" />
          }

          ...

          {/* Google Tag Manager */}
          { process.env.NODE_ENV === 'production' && 
          <script 
            dangerouslySetInnerHTML={{
                __html: GTMJs
            }}
          />
          }
          {/* End Google Tag Manager */}

        </HeadCSP>
        <body>
          { process.env.NODE_ENV === 'production' && 
          <noscript
            dangerouslySetInnerHTML={{
                __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=YOUR GOOGLE TAG MANAGER ID STRING" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
          }

          ...

          <Main />
          <NextScript />
          {/* Cloudflare Web Analytics */}
          {/*<script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon={`{"token": "YOUR CLOUDFLARE WEB ANALYTICS TOKEN STRING"}`}></script>*/}
          {process.env.NODE_ENV === 'production' && 
          <script dangerouslySetInnerHTML={{
            __html: cloudflareJs
          }} />
          }
          {/* End Cloudflare Web Analytics */}

          ...

        </body>
      </Html>
    )
  }

}

```

## Demo
Live demo with Next.js Strict CSP for testing with website security scanner available here:  
[Guy Dumais](https://guydumais.digital/ "Guy Dumais Digital")

## Learn more
Learn more about website security and how to protect a Next.js website:  
[Website Security](https://guydumais.digital/blog/tag/website-security/ "Website Security")
