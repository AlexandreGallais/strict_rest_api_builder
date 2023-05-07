import type { HttpMethodAllowed, PathPatern } from '../interface/open_api_object.ts';

export interface IControllerEndpoint
{
    req?: {
        path?: string;
        query?: string;
        header?: string;
        body?: string;
    };
    res?: {
        header?: string;
        body?: string;
    };
}

export interface IControllerTree
{
    [key: PathPatern]: {
        [key in HttpMethodAllowed]?: IControllerEndpoint
    };
}

export interface IControllerTreeStore
{
    [key: PathPatern]: { [key in HttpMethodAllowed]?: IControllerEndpoint & { store: (() => void)[] } };
}

export class Controller<Tree extends IControllerTree>
{
    #name: string;
    #tree: IControllerTreeStore;

    public get name(): string
    {
        return this.#name;
    }

    public get tree(): IControllerTreeStore
    {
        return this.#tree;
    }

    public constructor(name: string, tree: Tree)
    {
        this.#name = name.toLocaleLowerCase();

        const treeTemp: IControllerTreeStore = {};

        Object.keys(tree).forEach((key) =>
        {
            const path = key.toLocaleLowerCase() as PathPatern;

            treeTemp[path] = {};

            Object.entries(tree[path]).forEach(([keySub, valueSub]) =>
            {
                treeTemp[path][keySub as HttpMethodAllowed] = { store: [], ...valueSub };
            });
        });

        this.#tree = treeTemp;
    }

    public listen = <P extends keyof Tree>(path: P, method: keyof Tree[P], listener: (() => void)): void =>
    {
        this.#tree[path as PathPatern][method as HttpMethodAllowed]?.store.push(listener);
    };

    public emit = <P extends keyof Tree>(path: P, method: keyof Tree[P]): void =>
    {
        this.#tree[path as PathPatern][method as HttpMethodAllowed]?.store.forEach((x) =>
        {
            x();
        });
    };
}
