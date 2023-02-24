import Koa from "koa";
import BodyParser from "koa-bodyparser";
import Router from "koa-router";
import Logger from "koa-logger";
import serve from "koa-static";
import {getRandomPhotos} from "./unsplach.js";
import {errorHandler} from "./errorHandler.js";
import ejs from "koa-ejs";
import * as path from "path";
import {fileURLToPath} from 'url';

const app = new Koa();

const PORT = process.env.PORT || 3000;

app.on('error', errorHandler);
app.use(BodyParser());
app.use(Logger());

ejs(app, {
  root: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../template'),
  layout: false,
  viewExt: 'ejs',
  cache: false,
  debug: false
});


app.use(serve("./public"));

const router = new Router();

router.get("/", async (ctx, next) => {
  let slidesPromise = getRandomPhotos({
    count: 3,
    query: "toys"
  });
  let productsPromise = getRandomPhotos({
    count: 8,
    query: "toys",
    orientation: "squarish",
    defaultDescription: "Product Name"
  })
  let [slidesResp, productsResp] = await Promise.allSettled([slidesPromise, productsPromise]);
  let slides = [], products = [];

  if (slidesResp.status === "rejected") {
    ctx.app.emit('error', new Error(`Fetching slides failed. Reason ${productsResp.reason}`), ctx);
  } else {
    slides = slidesResp.value;
  }
  if (productsResp.status === "rejected") {
    ctx.app.emit('error', new Error(`Fetching products failed. Reason ${productsResp.reason}`), ctx);
  } else {
    products = productsResp.value.map(p => ({
      name: p.description,
      price: Math.round((Math.random() * 89 + 10) * 100) / 100,
      picture_url: p.url
    }));
  }

  await ctx.render('index', {
    slides,
    products
  })
})

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, function () {
  console.log(
    "==> 🌎  Listening on port %s. Visit http://localhost:%s/",
    PORT,
    PORT
  );
});