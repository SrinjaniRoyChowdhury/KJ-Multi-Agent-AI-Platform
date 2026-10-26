import proxy from "express-http-proxy";

export const proxyWithHeader = (serviceURL) => {
  return proxy(serviceURL, {
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers = proxyReqOpts.headers || {};
      const userId = srcReq.user?.userId || srcReq.user?._id;
      if (userId) {
        proxyReqOpts.headers["x-user-id"] = String(userId);
      }
      return proxyReqOpts;
    },
  });
};
