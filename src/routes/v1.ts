import type { Endpoint } from '@/structures'
import type { FastifyInstance, FastifyReply, FastifyRequest, RegisterOptions, DoneFuncWithErrOrRes } from 'fastify'

import { Route } from '@/structures'
import { parameterValidator } from '@/utils'

interface IParams {
  category: string
  endpoint: string
}

/**
 * @class v1
 * @extends Route
 */
export default class v1 extends Route {
  constructor() {
    super({
      position: 1,
      path: '/v1'
    })
  }

  routes(app: FastifyInstance, _options: RegisterOptions, done: DoneFuncWithErrOrRes) {
    app.decorateRequest('endpoint', null)

    const checkEndpoint = async (req: FastifyRequest<{ Params: IParams }>, reply: FastifyReply) => {
      const category = req.params.category
      const endpoint = app.endpoints[category].find((endpoint: Endpoint) => endpoint.name === req.params.endpoint)

      if (!endpoint) {
        await reply.code(404).send({
          success: false,
          status: 404,
          message: `Unknown endpoint '${req.params.endpoint}'.`
        })
      }

      req.endpoint = endpoint
    }

    const checkEndpointParameters = async (req: FastifyRequest, reply: FastifyReply) => {
      const endpoint = req.endpoint!
      const endpointParameters = endpoint.parameters
      const missingParameters = []
      const incorrectTypes = []

      for (const parameter of endpointParameters) {
        if (parameter.required && !req.query[parameter.name]) {
          missingParameters.push(parameter.name)
        }

        if (req.query[parameter.name]) {
          if (parameter.type === 'url') {
            !(parameterValidator.url(req.query[parameter.name])) ? incorrectTypes.push(parameter.name) : null
          } else if (typeof req.query[parameter.name] !== parameter.type) {
            incorrectTypes.push(parameter.name)
          }
        }
      }

      if (missingParameters.length > 0) {
        await reply.code(400).send({
          success: false,
          status: 400,
          message: `Missing "${missingParameters.join('", "')}" propert${missingParameters.length > 1 ? 'ies' : 'y'} from query.`
        })
      }

      if (incorrectTypes.length > 0) {
        await  reply.code(400).send({
          success: false,
          status: 400,
          message: `Invalid parameters type provided. Invalid Parameters: "${incorrectTypes.join('", "')}".`
        })
      }
    }

    app.get('/', () => {
      return {
        message: 'Welcome on RawGO!',
        documentation: 'https://docs.rawgo.pic',
        branches: app.endpoints
      }
    })

    app.get<{
      Params: IParams
    }>('/:category', {
      schema: {
        params: {
          type: 'object',
          properties: {
            category: { type: 'string', enum: [...Object.keys(app.endpoints)] }
          }
        }
      }
    }, async (req) => {
      const category = req.params.category

      return {
        branch: category,
        endpoints: app.endpoints[category],
        endpointCount: app.endpoints[category].length
      }
    })

    app.get<{
      Params: IParams
    }>('/:category/:endpoint', {
      config: { rateLimit: { max: 15, timeWindow: 1000 } },
      schema: {
        params: {
          type: 'object',
          properties: {
            category: { type: 'string', enum: [...Object.keys(app.endpoints)] }
          }
        }
      },
      preHandler: [checkEndpoint, checkEndpointParameters]
    },
    async (req, reply) => {
      const endpoint = req.endpoint!
      const endpointOutput = await endpoint.make(req.query, reply)

      reply.header('Content-Type', 'image/png')

      return reply.send(endpointOutput)
    })

    done()
  }
}
