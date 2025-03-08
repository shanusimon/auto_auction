export interface IBcrypt {
    hash(original:string):Promise<string>;
    compare(current:string,orginal:string):Promise<boolean>;
}