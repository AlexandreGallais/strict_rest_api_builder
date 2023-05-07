/* eslint-disable no-multiple-empty-lines */
import { SrabServer } from '../mod.ts';
import adminController from './controller/admin_controller.ts';
import dinosaurController from './controller/dinosaur_controller.ts';
import { environment } from './environment/environment.ts';


// Create the init object.
const init = {
    info: environment.info,
    controller: [
        dinosaurController,
        adminController
    ],
};


// Create a new instance of SRAB.
const server = new SrabServer(init);


// Start listening on port 8080 of localhost.
void server.listen(8080);


server.on('httpError', (status) =>
{
    console.log(status);
});
