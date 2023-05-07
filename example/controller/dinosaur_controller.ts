import { Controller } from '../../module/controller.ts';

const tree = {
    /* eslint-disable @typescript-eslint/naming-convention */
    '/': {
        GET: {
        },
    },

    '/food': {
        GET: {
            res: {
                body: 'string',
            },
        },

        POST: {
            req: {
                body: 'string',
            },
            res: {
                body: 'string',
            },
        },
    },

    '/food/{uuid}': {
        DELETE: {
            req: {
                path: 'string',
                header: 'string',
            },
        },
    },
    /* eslint-disable @typescript-eslint/naming-convention */
};

export default new Controller('Dinosaur', tree);
