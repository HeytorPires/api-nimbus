import client from 'prom-client';
import { Request, Response, NextFunction } from 'express';

// Registra no registry global as métricas padrão do processo Node: CPU, memória (heap),
// atraso do event loop, pausas de GC, handles abertos etc. Vêm "de graça", sem instrumentar nada.
client.collectDefaultMetrics();

/**
 * Latência das requisições HTTP, em segundos.
 *
 * Histograma em vez de média: ele conta quantas requisições caíram em cada faixa (bucket),
 * o que permite ao Prometheus calcular percentis (p50/p95/p99) com `histogram_quantile`.
 * Também gera `_count` (total de requisições, base para taxa de erro) e `_sum` (tempo somado).
 */
export const httpRequestDuration = new client.Histogram({
  // Convenção do Prometheus: nome em snake_case terminando na unidade
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  // Cada combinação distinta de labels vira uma série separada no Prometheus.
  // Por isso os valores precisam ter pouca variedade (baixa cardinalidade):
  // padrão da rota sim, ID ou URL completa não.
  labelNames: ['method', 'route', 'status_code'],
  // Limites superiores das faixas, em segundos (10ms até 5s).
  // Concentrados na faixa de latência esperada de uma API; acima de 5s cai no bucket +Inf.
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});

/**
 * Middleware que mede o tempo de cada requisição e registra no histograma.
 * Precisa ser registrado antes das rotas para envolver todas elas.
 */
export function metricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Não mede o próprio scrape: o Prometheus chama /metrics a cada 15s e isso
  // só poluiria a latência das rotas de verdade.
  if (req.path === '/metrics') {
    return next();
  }

  // Relógio monotônico em nanossegundos: não é afetado por ajuste do relógio do sistema
  // (diferente de Date.now()), então serve para medir duração com precisão.
  const start = process.hrtime.bigint();

  // 'finish' dispara quando a resposta terminou de ser enviada, ou seja, depois que
  // controller, services e ErrorHandler rodaram. Só aqui o status code final é conhecido.
  res.on('finish', () => {
    // Diferença em ns convertida para segundos (unidade do histograma)
    const durationSeconds = Number(process.hrtime.bigint() - start) / 1e9;
    // req.route.path é o padrão declarado na rota (ex: '/:id'), não a URL real
    // ('/1b2c...'), o que mantém a cardinalidade baixa. É relativo ao router onde a rota
    // foi declarada, sem o prefixo de montagem.
    // Fallback req.path: quando nenhuma rota casou (404), req.route não existe e entra a URL
    // real — cada URL inexistente acessada vira uma série nova.
    const route = req.route?.path ?? req.path;

    // Seleciona a série pelos labels (na mesma ordem de labelNames) e registra a duração
    httpRequestDuration
      .labels(req.method, route, String(res.statusCode))
      .observe(durationSeconds);
  });

  next();
}

/**
 * Handler do GET /metrics, rota que o Prometheus raspa (ver docker/prometheus/prometheus.yml).
 * Devolve todas as métricas registradas no formato texto do Prometheus.
 */
export async function metricsHandler(
  req: Request,
  res: Response
): Promise<void> {
  // Content-Type do formato de exposição do Prometheus (text/plain; version=0.0.4)
  res.set('Content-Type', client.register.contentType);
  // Serializa as métricas do registry global (padrão + histograma acima).
  // É assíncrono porque algumas métricas são calculadas no momento da coleta.
  res.end(await client.register.metrics());
}
