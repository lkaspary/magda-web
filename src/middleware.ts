import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((ctx, next) => {
  const host = (ctx.request.headers.get('host') || '').split(':')[0].toLowerCase();
  const isInter = host === 'interdisciplinarist.com' || host.endsWith('.interdisciplinarist.com');

  ctx.locals.site = isInter ? 'interdisciplinarist' : 'magda';

  // On interdisciplinarist.com, the /inter/* pages should serve at the root
  // path (interdisciplinarist.com/articles, not /inter/articles). Rewrite
  // internally so the visible URL stays clean. API routes are excluded —
  // they're not part of the /inter tree and must resolve at their real path.
  if (isInter && !ctx.url.pathname.startsWith('/inter') && !ctx.url.pathname.startsWith('/api')) {
    const target = ctx.url.pathname === '/' ? '/inter' : `/inter${ctx.url.pathname}`;
    return ctx.rewrite(target);
  }

  return next();
});
