import type { HttpMethodAllowed, PathPatern } from '../../../interface/open_api_object.ts';
import type { Controller, IControllerTree } from '../../controller.ts';

/**
 * @returns
 * ```ts
 * type Returns = null | [
 *     string, // Controller name.
 *     string, // Endpoint.
 *     string, // Method
 * ]
 * ```
 */
export default (pathname: string, method: string, controller: Controller<IControllerTree>[]): [string, string, string] | 404 | 405 =>
{
    const eventPaths = pathname
        .replace(/^\//us, '')
        .replace(/\/$/us, '')
        .split('/')
        .map((x) => decodeURIComponent(x).toLowerCase());

    const eventController = controller.find((x) => x.name === eventPaths[0]);

    if (eventController === undefined)
    {
        return 404;
    }

    eventPaths.shift();

    if (eventPaths.length === 0)
    {
        eventPaths.push('');
    }

    const eventControllerTreeKeys = Object.keys(eventController.tree);

    const endpointPaths = eventControllerTreeKeys
        .map((x) => x
            .replace(/^\//us, '')
            .replace(/\/$/us, '')
            .split('/'));

    const eventEndpointIndex = endpointPaths.findIndex((endpointPath) =>
    {
        let res = true;

        if (endpointPath.length !== eventPaths.length)
        {
            return false;
        }

        endpointPath.forEach((x, i) =>
        {
            if (x.startsWith('{') && x.endsWith('}'))
            {
                return;
            }

            if (x !== eventPaths[i])
            {
                res = false;
            }
        });

        return res;
    });

    if (eventEndpointIndex === -1)
    {
        return 404;
    }

    const eventEndpointKey = eventControllerTreeKeys[eventEndpointIndex];
    const eventEndpoint = eventController.tree[eventEndpointKey as PathPatern][method as HttpMethodAllowed];

    if (eventEndpoint === undefined)
    {
        return 405;
    }

    return [eventController.name, eventEndpointKey, method];
};
