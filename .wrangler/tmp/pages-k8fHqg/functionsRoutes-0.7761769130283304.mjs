import { onRequest as __api_login_ts_onRequest } from "E:\\Zirflow\\公司-Zirflow臻孚科技\\zirflow-office\\functions\\api\\login.ts"
import { onRequest as __api_register_ts_onRequest } from "E:\\Zirflow\\公司-Zirflow臻孚科技\\zirflow-office\\functions\\api\\register.ts"

export const routes = [
    {
      routePath: "/api/login",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_login_ts_onRequest],
    },
  {
      routePath: "/api/register",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_register_ts_onRequest],
    },
  ]