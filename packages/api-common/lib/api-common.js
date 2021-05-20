'use strict';

const getStartFunction = (fastify, host, port) => async () => {
    try {
	const addr = await fastify.listen(port, host);
	fastify.log.info(`Server started on ${host}:${port} => ${addr}`);
    } catch(err) {
	fastify.log.error(err);
	process.exit(1);
    }
};

const createHealthCheckRoute = (fastify) => {
    fastify.get('/', async (request, reply) => {
	reply.code(200)
	    .header('Content-Type', 'application/json; charset=utf-8')
	    .send({code: 0, message: 'ok'});
    });
};

module.exports = {
    getStartFunction,
    createHealthCheckRoute,
};

