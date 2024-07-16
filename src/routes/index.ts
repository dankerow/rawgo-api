import type { FastifyInstance, RegisterOptions, DoneFuncWithErrOrRes } from 'fastify'

import { Route } from '@/structures'

interface IParams {
  version: string
}

/**
 * @class Index
 * @extends Route
 */
export default class Index extends Route {
  constructor() {
    super({
      position: 1,
      path: '/'
    })
  }

  routes(app: FastifyInstance, _options: RegisterOptions, done: DoneFuncWithErrOrRes) {
    app.get<{
      Params: IParams
    }>('/', (req, reply) => {
      if (!req.params.version) {
        return reply.redirect('/v1')
      }

      if (req.params.version && app.versions.includes(req.params.version)) {
        return reply.redirect(`/${req.params.version}`)
      } else if (req.params.version && !app.versions.includes(req.params.version)) {
        return reply.redirect('/v1')
      }
    })

    done()
  }
}
