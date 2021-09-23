"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextStrictCSP = void 0;
const react_1 = __importDefault(require("react"));
const _document_1 = require("../../../next/dist/pages/_document");
const crypto_1 = __importDefault(require("crypto"));
const cspHashOf = (text) => {
    const hash = crypto_1.default.createHash('sha256');
    hash.update(text);
    return `'sha256-${hash.digest('base64')}'`;
};
class NextStrictCSP extends _document_1.Head {
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
        const nextJsSPAScript = react_1.default.createElement("script", { defer: true, dangerouslySetInnerHTML: {
                __html: nextJsSPA
            } });
        NextStrictCSP.inlineJsHashed = NextStrictCSP.inlineJs.map((inlineJs) => {
            return cspHashOf(inlineJs);
        });
        
        const cspValues = [ 
          "default-src 'none'", 
          "object-src 'none'", 
          "frame-ancestors 'self'",
          "img-src 'self' *.bam-x.com *.narrativ.com https:",
          // `script-src 'self' *.bam-x.com *.narrativ.com *.launchdarkly.com`,
          `script-src 'self' *.bam-x.com *.narrativ.com *.launchdarkly.com *.google-analytics.com ${cspHashOf(nextJsSPA)} ${NextStrictCSP.inlineJsHashed.join(' ')}`,
          "manifest-src 'self'",
          "style-src 'self' *.bam-x.com *.narrativ.com *.launchdarkly.com",
          "font-src 'self' *.bam-x.com *.narrativ.com",
          "connect-src 'self' *.bam-x.com *.narrativ.com *.launchdarkly.com *.datadoghq.com *.google-analytics.com",
        ].join('; '); 
        
        const newChildren = [];
        react_1.default.Children.forEach(this.props.children, (child) => {
            if (child && child.type === 'meta') {
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
exports.NextStrictCSP = NextStrictCSP;
