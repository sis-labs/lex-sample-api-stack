'use strict';

require('dotenv').config();
const fastify = require('fastify')({logger: true});

const { getStartFunction, createHealthCheckRoute } = require('api-common');
const { now, searchAppointments } = require('./domain');
const { HOST, PORT } = process.env;

const start = getStartFunction(fastify,  HOST, PORT);

createHealthCheckRoute(fastify);

// Search for appointment
fastify.get('/appointments', async (request, reply) => {
    reply.code(200)
	.header('content-type', 'application/json;charset=utf-8')
	.send({code: 0, message: 'ok'});
});

// Create a new appointment
fastify.post('/appointments', async (request, reply) => {
    reply.code(200)
	.header('content-type', 'application/json;charset=utf-8')
	.send({code: 0, message: 'ok'});
});

start();
