'use strict';

require('dotenv').config();
const AWS = require('aws-sdk');
const fastify = require('fastify')({logger: true});

const { getStartFunction, createHealthCheckRoute } = require('api-common');

const { AWS_REGION, AWS_KEY, AWS_SECRET, HOST = '127.0.0.1', PORT = '3000' } = process.env;

const start = getStartFunction(fastify, HOST, PORT);

// Configure AWS sdk
AWS.config.update({region: AWS_REGION, accessKeyId: AWS_KEY, secretAccessKey: AWS_SECRET});
AWS.config.apiVersions = {
  dynamodb: '2012-08-10',
};

const dynamoDb = new AWS.DynamoDB();

createHealthCheckRoute(fastify);

const fetchData = (p) => new Promise((resolve, reject) => {
    dynamoDb.query(p, (err, data) => {
	if(err) {
	    return reject(err);
	}
	return resolve(data.Items);
    });
});

const TABLE_NAME = 'cassidy-customers';
const INDEX_NAME = 'CustomerMails';

const mapItem = (item) => {
    const keys = Object.keys(item);
    const r = {};
    keys.forEach(k => {
	r[k] = Object.values(item[k])[0];
    });
    return r;
};

const createQueryParams = (key, value, tableName, indexName) => {
    const k = `:${key}`;
    const attrs = {};
    attrs[k] = { S: value };
    const params = {
	ExpressionAttributeValues: attrs,
        KeyConditionExpression: `${key} = ${k}`,
        ProjectionExpression: 'id,email,firstname,lastname,phone',
        TableName: tableName,
    };
    if(indexName) {
        params['IndexName'] = indexName;
    }
    return params;
};

fastify.get('/customers', async (request, reply) => {
    const { query: { email } } = request;
    const searchParams = createQueryParams('email', email, TABLE_NAME, INDEX_NAME);
    const items = await fetchData(searchParams);
    reply.code(200).header('content-type', 'application/json; charset=utf-8')
	.send({code: 0, message: 'ok', items: items.map(i => mapItem(i))});
});

fastify.get('/customers/:id', async (request, reply) => {
    const { id } = request.params;
    const searchParams = createQueryParams('id', id, TABLE_NAME);
    const items = await fetchData(searchParams);
    if(items && items.length) {
	reply.code(200).header('content-type', 'application/json; charset=utf-8')
	    .send(mapItem(items[0]));
    } else {
	reply.code(404).header('content-type', 'application/json; charset=utf-8')
	    .send();
    }
});

start();
