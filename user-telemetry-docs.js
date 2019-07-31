const Joi = require('@hapi/joi')

module.exports = {
  add_rel: {
    desc: 'Add a directed relation between two nodes in a given user-telemetry.',
    examples: {
      'user-telemetry:number,rel:lessthan,add:rel,from:<from-id>,to:<to-id>':
        'Idempotently add a pair of nodes to  _number_ user-telemetry connected by directed relation _lessthan_ with `from-id` and `to-id` referencing external entity identifiers as per user-telemetry definition in options.'
    },
    validate: {
      'user-telemetry': Joi.string()
        .required()
        .description('The name of the user-telemetry.'),
      rel: Joi.string()
        .required()
        .description('The name of the relation.'),
      from: Joi.string()
        .required()
        .description('From-side entity identifier.'),
      to: Joi.string()
        .required()
        .description('To-side entity identifier.')
    },
    reply_desc: {
      from: '_from_ parameter, as provided',
      to: '_to_ parameter, as provided',
      rel: '_rel_ parameter, as provided',
      'user-telemetry': '_user-telemetry_ parameter, as provided',
      node: {
        f: 'from-side entity identifier',
        t: 'to-side entity identifier',
        r: 'relation name',
        id: 'internal user-telemetry node identifier'
      }
    }
  },

  list_rel: {
    desc: 'List nodes connected by a given relation.',
    examples: {
      'user-telemetry:number,rel:lessthan,list:rel':
        'List all nodes in  _number_ user-telemetry connected by directed relation _lessthan_',
      'user-telemetry:number,rel:lessthan,list:rel,from:<from-id>':
        'List all nodes in  _number_ user-telemetry connected by directed relation _lessthan_ with given `from-id`',
      'user-telemetry:number,rel:lessthan,list:rel,to:<to-id>':
        'List all nodes in  _number_ user-telemetry connected by directed relation _lessthan_ with given `to-id`',
      'user-telemetry:number,rel:lessthan,list:rel,to:<to-id>,entity:from':
        'List all nodes in  _number_ user-telemetry connected by directed relation _lessthan_ with given `to-id`, loading and including referenced from-side entities',
      'user-telemetry:number,rel:lessthan,list:rel,entity:to':
        'List all nodes in  _number_ user-telemetry connected by directed relation _lessthan_, loading and including referenced to-side entities'
    },
    validate: {
      'user-telemetry': Joi.string()
        .required()
        .description('The name of the user-telemetry.'),
      rel: Joi.string()
        .required()
        .description('The name of the relation.'),
      from: Joi.string().description('From-side entity identifier.'),
      to: Joi.string().description('To-side entity identifier.'),
      entity: Joi.string()
        .valid('from', 'to', 'both')
        .description('Entity side to load. Values: _from_, _to_, _both_.')
    },
    reply_desc: {
      from: '_from_ parameter, as provided',
      to: '_to_ parameter, as provided',
      rel: '_rel_ parameter, as provided',
      'user-telemetry': '_user-telemetry_ parameter, as provided',
      list: [
        {
          f: 'from-side entity identifier',
          t: 'to-side entity identifier',
          r: 'relation name',
          id: 'internal user-telemetry node identifier',
          fe: 'from-side entity',
          te: 'to-side entity'
        },
        '...'
      ]
    }
  },

  load_tree: {
    desc: 'Load tree of nodes connected by given relation.',
    examples: {
      'user-telemetry:number,rel:lessthan,from:<from-id>':
        'Load tree of nodes from _number_ user-telemetry connected by directed relation _lessthan_ with `from-id` nodes at first level, to default depth of 1.',
      'user-telemetry:number,rel:lessthan,from:<from-id>,depth:2,entity:to':
        'Load tree of nodes from _number_ user-telemetry connected by directed relation _lessthan_ with `from-id` nodes at first level, to depth 2, loading and returning referenced to-side entities.'
    },
    validate: {
      'user-telemetry': Joi.string()
        .required()
        .description('The name of the user-telemetry.'),
      rel: Joi.string()
        .required()
        .description('The name of the relation.'),
      from: Joi.string().description('From-side entity identifier.'),
      to: Joi.string().description('To-side entity identifier.'),
      depth: Joi.number()
        .default(1)
        .description('Depth of user-telemetry to traverse.'),
      entity: Joi.string()
        .valid('from', 'to', 'both')
        .description('Entity side to load. Values: _from_, _to_, _both_.')
    },
    reply_desc: {
      from: '_from_ parameter, as provided',
      to: '_to_ parameter, as provided',
      rel: '_rel_ parameter, as provided',
      'user-telemetry': '_user-telemetry_ parameter, as provided',
      c: [
        {
          f: 'from-side entity identifier',
          t: 'to-side entity identifier',
          r: 'relation name',
          id: 'internal user-telemetry node identifier',
          fe: 'from-side entity',
          te: 'to-side entity',
          c: ['{ ...connected-nodes... }']
        },
        '...connected-nodes...'
      ]
    }
  }
}
