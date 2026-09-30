import proxy from "express-http-proxy";

export const proxyWithHeader = (serviceURL) => {
  return proxy(serviceURL, {
    proxyReqBodyDecorator: (proxyReqOpts, srcReq) => {
      if (srcReq.user) {
        proxyReqOpts: Headers["x-user-id"] = srcReq.user.userId;
      }
    },
  });
};
