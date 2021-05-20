'use strict';

require('dotenv').config();
const fastify = require('fastify')({logger: true});

const { getStartFunction, createHealthCheckRoute } = require('api-common');

const { HOST = '127.0.0.1', PORT = '3000' } = process.env;

const start = getStartFunction(fastify, HOST, PORT);

createHealthCheckRoute(fastify);

fastify.get('/customers', async (request, reply) => {
    reply.code(200).header('content-type', 'application/json; charset=utf-8')
	.send({code: 0, message: 'ok', items: []});
});

fastify.get('/customers/:id', async (request, reply) => {
    const { id } = request.params;
    reply.code(200).header('content-type', 'application/json; charset=utf-8')
	.send({id, firstname: 'john', lastname: 'doe', phone: '5140939567', email: 'jdoe@mydom.com'});
});

start();
