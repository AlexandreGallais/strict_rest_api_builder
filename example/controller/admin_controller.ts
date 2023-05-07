import { Controller } from '../../module/controller.ts';

const tree = {
    /* eslint-disable @typescript-eslint/naming-convention */
    '/': {
        GET: {
        },

        POST: {
            req: {
                body: 'string',
                header: 'string',
            },
            res: {
                body: 'string',
            },
        },
    },
    /* eslint-disable @typescript-eslint/naming-convention */
};

export default new Controller('Admin', tree);
