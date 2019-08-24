const initClient = require('@lunchbox-lambda/client').default;

module.exports = function main(RED) {
  function LunchboxNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    const globalContext = node.context().global;

    const state = {
      connectivity: null,
      computer: null,
      'environment-list': null,
      environments: null,
      recipes: null,
    };

    const client = initClient({
      serverHost: config.serverHost || globalContext.get('serverHost'),
    });

    function set(topic, payload) {
      state[topic] = payload;
      node.send({ topic, payload });
    }

    const subscriptions = [

      client.store.getConnectivity().subscribe(
        (connectivity) => set('connectivity', connectivity),
      ),

      client.store.getComputer().subscribe(
        (computer) => set('computer', computer),
      ),

      client.store.getEnvironmentList().subscribe(
        (environmentList) => set('environment-list', environmentList),
      ),

      client.store.getEnvironments().subscribe(
        (environments) => set('environments', environments),
      ),

      client.store.getRecipeContexts().subscribe(
        (recipeContexts) => set('recipes', recipeContexts),
      ),

      client.store.getConnectivity().subscribe((connectivity) =>
        (connectivity.socket ?
          node.status({ fill: 'green', shape: 'dot', text: 'connected' }) :
          node.status({ fill: 'red', shape: 'ring', text: 'disconnected' })),
      ),
    ];

    node.on('input', () => node.send([
      Object.entries(state).map(([key, value]) => ({
        topic: key, payload: value,
      })),
    ]));

    node.on('close', () => subscriptions.forEach(
      (subscription) => subscription.unsubscribe(),
    ));
  }

  RED.nodes.registerType('lunchbox', LunchboxNode);
};
