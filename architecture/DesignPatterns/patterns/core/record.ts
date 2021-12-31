const serverConfig: Record<string, string | number | boolean> = {
  port: 3000,
  basePath: "http://localhost",
  enableStripePayments: false,
};

type ServiceConfigParams = "port" | "basePath" | "enableStripePayments";

const advancedServerConfig: Record<
  ServiceConfigParams,
  string | number | boolean
> = {
  port: 3000,
  basePath: "http://localhost",
  enableStripePayments: false,
};

console.log(advancedServerConfig.port);
