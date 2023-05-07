import type { IInfoObject } from '../interface/open_api_object.ts';
import type { Controller, IControllerTree } from './controller.ts';
import router from './server/process/router.ts';
import { response } from './server/response.ts';

interface ISrabServerInit
{
    info: IInfoObject;
    controller: Controller<IControllerTree>[];
}

type SrabServerEvent =
| 'beforeEndpoint'
| 'beforeAuthorization'
| 'beforeValidation'
| 'beforeService'
| 'beforeResponse'
| 'httpError';

// eslint-disable-next-line @typescript-eslint/padding-line-between-statements
type SrabServerEventListener<T extends SrabServerEvent> =
    T extends 'beforeEndpoint' ? () => void :
    T extends 'beforeAuthorization' ? () => void :
    T extends 'beforeValidation' ? () => void :
    T extends 'beforeService' ? () => void :
    T extends 'beforeResponse' ? () => void :
    T extends 'httpError' ? (status: number) => void :
    undefined;

// eslint-disable-next-line @typescript-eslint/padding-line-between-statements
type SrabServerEventArg<T extends SrabServerEvent> =
    T extends 'beforeEndpoint' ? [] :
    T extends 'beforeAuthorization' ? [] :
    T extends 'beforeValidation' ? [] :
    T extends 'beforeService' ? [] :
    T extends 'beforeResponse' ? [] :
    T extends 'httpError' ? [number] :
    undefined;

export class SrabServer<Init extends ISrabServerInit>
{
    #info: Init['info'];
    #controller: Init['controller'];
    #event: { [key in SrabServerEvent]: SrabServerEventListener<key>[] } = {
        beforeEndpoint: [],
        beforeAuthorization: [],
        beforeValidation: [],
        beforeService: [],
        beforeResponse: [],
        httpError: [],
    };

    public constructor(init: Init)
    {
        this.#info = init.info;
        this.#controller = init.controller;
    }

    /**
     *
     * @param event
     * @param listener
     */
    public on = <T extends SrabServerEvent>(event: T, listener: SrabServerEventListener<T>): void =>
    {
        this.#event[event].push(listener);
    };

    /**
     *
     * @param event
     * @param args
     */
    #emit = <T extends SrabServerEvent>(event: T, args: SrabServerEventArg<T>): void =>
    {
        this.#event[event].forEach((x) =>
        {
            // @ts-expect-error - I want to pass multiple arguments
            x(...args);
        });
    };

    #http = async (conn: Deno.Conn): Promise<void> =>
    {
        for await (const event of Deno.serveHttp(conn))
        {
            this.#emit('beforeEndpoint', []);

            const { url, method } = event.request;
            const { pathname } = new URL(url);
            const route = router(pathname, method, this.#controller);

            if (route === 404 || route === 405)
            {
                this.#emit('httpError', [route]);

                void event.respondWith(response(route));

                return;
            }

            this.#emit('beforeAuthorization', []);

            // Authorization

            this.#emit('beforeValidation', []);

            // DTO validation

            this.#emit('beforeService', []);

            // Go to controller service

            void event.respondWith(response(200, 'Hello'));
        }
    };

    /**
     * Start
     * @param port
     * @param listener
     */
    public listen = async (port: number, listener?: (conn: Deno.Conn) => void): Promise<void> =>
    {
        for await (const conn of Deno.listen({ port: port }))
        {
            if (listener)
            {
                listener(conn);
            }

            void this.#http(conn);
        }
    };
}
