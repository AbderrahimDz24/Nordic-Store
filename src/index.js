import Koa from "koa";
import BodyParser from "koa-bodyparser";
import Router from "koa-router";
import Logger from "koa-logger";
import serve from "koa-static";
import HttpStatus from "http-status";
import {getRandomPhotos} from "./unsplach.js";


const app = new Koa();

const PORT = process.env.PORT || 3000;

app.use(BodyParser());
app.use(Logger());

app.use(serve("./public"));

const router = new Router();

router.get("/api/slides", async (ctx, next) => {
  try {
    ctx.status = HttpStatus.OK;
    ctx.body = await getRandomPhotos({count: 3, query: "toys"});
    await next();
  } catch (e) {
    ctx.status = HttpStatus.BAD_GATEWAY;
    ctx.body = {
      error_message: e.message
    };
  }
});

router.get("/api/products", async (ctx, next) => {
  try {
    ctx.status = HttpStatus.OK;
    ctx.body = (await getRandomPhotos({
      count: 8,
      query: "toys",
      orientation: "squarish",
      defaultDescription: "Product Name"
    })).map(p => ({
      name: p.description,
      price: Math.round((Math.random() * 89 + 10) * 100) / 100,
      picture_url: p.url
    }));
    await next();
  } catch (e) {
    ctx.status = HttpStatus.BAD_GATEWAY;
    ctx.body = {
      error_message: e.message
    };
  }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, function () {
  console.log(
    "==> 🌎  Listening on port %s. Visit http://localhost:%s/",
    PORT,
    PORT
  );
});