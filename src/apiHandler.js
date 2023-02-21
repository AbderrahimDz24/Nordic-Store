import {UnsplashApiError} from "./unsplach.js";
import HttpStatus from "http-status";

export function apiHandler(callback) {
  return async function (ctx, next) {
    try {
      await callback(ctx, next);
    } catch (err) {
      ctx.app.emit('error', err, ctx);
      if (err instanceof UnsplashApiError) {
        ctx.status = HttpStatus.BAD_GATEWAY;
        ctx.body = {
          error: {
            name: err.name,
            message: err.message
          }
        };
      } else {
        ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
        ctx.body = {
          error: {
            name: err.name,
            message: err.message
          }
        };
      }
    }
  }
}