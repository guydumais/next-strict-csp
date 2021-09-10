import { Head } from '../../../next/dist/pages/_document';
export declare class NextStrictCSP extends Head {
    static inlineJs: string[];
    static inlineJsHashed: string[];
    static nextJsFiles: string[];
    getDynamicChunks(): never[];
    getScripts: ({ allFiles }: {
        allFiles: any;
    }) => never[];
}
