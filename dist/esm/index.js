import React from 'react';
import { Head } from '../../../next/dist/pages/_document';
import crypto from 'crypto';
const cspHashOf = (text) => {
    const hash = crypto.createHash('sha256');
    hash.update(text);
    return `'sha256-${hash.digest('base64')}'`;
};
export class NextStrictCSP extends Head {
    static inlineJs = [];
    static inlineJsHashed = [];
    static nextJsFiles = [];
    getDynamicChunks() {
        const { dynamicImports } = this.context;
        NextStrictCSP.nextJsFiles = dynamicImports
            .filter((file) => /\.js$/.test(file))
            .map((jsFile) => {
            return `'/_next/${encodeURI(jsFile)}'`;
        });
        return [];
    }
    getScripts = ({ allFiles }) => {
        const jsFiles = allFiles
            .filter((file) => /\.js$/.test(file))
            .map((jsFile) => {
            return `'/_next/${encodeURI(jsFile)}'`;
        });
        const { buildManifest, __NEXT_DATA__ } = this.context;
        const { lowPriorityFiles } = buildManifest;
        const jsFiles2 = lowPriorityFiles.map((jsFile) => {
            return `'/_next/${encodeURI(jsFile)}'`;
        });
        const jsFiles3 = jsFiles.concat(jsFiles2);
        const nextJsFiles = NextStrictCSP.nextJsFiles.concat(jsFiles3);
        const nextJsSPA = `var scripts = [${nextJsFiles.join()}]
    scripts.forEach(function(scriptUrl) {
      var s = document.createElement('script')
      s.src = scriptUrl
      s.async = false // to preserve execution order
      s.defer = true
      document.head.appendChild(s)
    })`;
        const nextJsSPAScript = React.createElement("script", { defer: true, dangerouslySetInnerHTML: {
                __html: nextJsSPA
            } });
        NextStrictCSP.inlineJsHashed = NextStrictCSP.inlineJs.map((inlineJs) => {
            return cspHashOf(inlineJs);
        });
        
        const cspValues = [ 
          "default-src 'none'", 
          "object-src 'none'", 
          "img-src 'self' *.bam-x.com *.narrativ.com https:", 
          // `script-src 'self' *.bam-x.com *.narrativ.com *.launchdarkly.com`, 
          `script-src 'self' *.bam-x.com *.narrativ.com *.launchdarkly.com 'strict-dynamic' ${cspHashOf(nextJsSPA)} ${NextStrictCSP.inlineJsHashed.join(' ')} 'unsafe-inline' http: https:`, 
          "style-src 'self' *.bam-x.com *.narrativ.com *.launchdarkly.com 'unsafe-inline'", 
          "font-src 'self' *.bam-x.com *.narrativ.com", 
          "connect-src 'self' *.bam-x.com *.narrativ.com *.launchdarkly.com", 
        ].join('; '); 

        const newChildren = [];
        React.Children.forEach(this.props.children, (child) => {
            if (child.type === 'meta') {
                if (child.props?.httpEquiv !== undefined) {
                    if (child.props.httpEquiv === 'Content-Security-Policy') {
                        child.props.content = cspValues;
                        child.props.slug = __NEXT_DATA__.page;
                    }
                }
            }
            newChildren.push(child);
        });
        this.context.headTags.push(nextJsSPAScript);
        return [];
    };
}
