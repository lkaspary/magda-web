import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((ctx, next) => {
  const host = (ctx.request.headers.get('host') || '').split(':')[0].toLowerCase();
  const isInter = host === 'interdisciplinarist.com' || host.endsWith('.interdisciplinarist.com');

  ctx.locals.site = isInter ? 'interdisciplinarist' : 'magda';

  // On interdisciplinarist.com, the /inter/* pages should serve at the root
  // path (interdisciplinarist.com/articles, not /inter/articles). Rewrite
  // internally so the visible URL stays clean.
  if (isInter && !ctx.url.pathname.startsWith('/inter')) {
    const target = ctx.url.pathname === '/' ? '/inter' : `/inter${ctx.url.pathname}`;
    return ctx.rewrite(target);
  }

  return next();
});
