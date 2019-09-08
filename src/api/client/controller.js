import { success, notFound } from '../../services/response/'
import { Client } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Client.create({ ...body, createdBy: user })
    .then((client) => client.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Client.find(query, select, cursor)
    .populate('createdBy')
    .then((clients) => clients.map((client) => client.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Client.findById(params.id)
    .populate('createdBy')
    .then(notFound(res))
    .then((client) => client ? client.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Client.findById(params.id)
    .populate('createdBy')
    .then(notFound(res))
    .then((client) => client ? Object.assign(client, body).save() : null)
    .then((client) => client ? client.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Client.findById(params.id)
    .then(notFound(res))
    .then((client) => client ? client.remove() : null)
    .then(success(res, 204))
    .catch(next)
