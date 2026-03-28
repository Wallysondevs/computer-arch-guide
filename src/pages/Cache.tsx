import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Cache() {
  return (
    <PageContainer
      title="Memória Cache"
      subtitle="O segredo da velocidade das CPUs modernas — como funciona o cache e por que ele muda tudo."
      difficulty="intermediario"
      timeToRead="18 min"
    >
      <h2>O que é Cache?</h2>
      <p>
        Cache é uma memória SRAM de alta velocidade que armazena cópias de dados e instruções frequentemente usados da DRAM. Quando a CPU precisa de um dado, verifica primeiro o cache — se encontrar (<strong>hit</strong>), usa imediatamente; se não (<strong>miss</strong>), busca da memória principal.
      </p>

      <h2>Organização do Cache: Conjunto, Via e Bloco</h2>
      <CodeBlock language="text" title="Estrutura de um cache" code={`
Cache de 32KB, 8-way associativo, blocos de 64 bytes:

  Número de blocos  = 32KB / 64B = 512 blocos
  Número de sets    = 512 / 8 = 64 sets
  Índice            = log2(64) = 6 bits
  Offset de bloco   = log2(64B) = 6 bits
  Tag               = bits restantes do endereço

Decomposição do endereço (40-bit):
  [  TAG (28 bits)  ][  INDEX (6 bits)  ][ OFFSET (6 bits) ]
  Identifica bloco    Seleciona o set      Byte dentro do bloco
      `} />

      <h2>Tipos de Mapeamento</h2>
      <div className="not-prose grid grid-cols-1 gap-6 my-8">
        {[
          {
            name: "Mapeamento Direto (1-way)",
            desc: "Cada bloco de memória mapeia para exatamente um local no cache. Simples e rápido de implementar, mas sofre com conflito — dois blocos frequentemente usados mapeando para o mesmo local se expulsam mutuamente.",
            pro: "Hardware simples, sem lógica de substituição",
            con: "Alta taxa de conflito (thrashing) mesmo com cache não cheio",
          },
          {
            name: "Totalmente Associativo (N-way, N=all)",
            desc: "Um bloco pode ser colocado em qualquer posição do cache. Máxima flexibilidade, mínimo conflito, mas requer comparação de tag em todas as posições simultaneamente — hardware caro.",
            pro: "Sem conflito de mapeamento",
            con: "Hardware muito complexo e caro para caches grandes",
          },
          {
            name: "Set-Associativo (N-way) — padrão atual",
            desc: "Equilíbrio: o cache é dividido em sets, e cada bloco mapeia para um set específico, mas pode ocupar qualquer uma das N vias dentro do set. CPUs modernas usam 4-way, 8-way ou 16-way.",
            pro: "Bom equilíbrio entre desempenho e complexidade",
            con: "Mais complexo que mapeamento direto",
          },
        ].map(t => (
          <div key={t.name} className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-bold text-primary mb-2">{t.name}</h3>
            <p className="text-sm text-foreground/80 mb-3">{t.desc}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-500/10 rounded-lg p-3">
                <p className="text-xs font-bold text-green-400 mb-1">✓ Vantagem</p>
                <p className="text-xs text-muted-foreground">{t.pro}</p>
              </div>
              <div className="bg-red-500/10 rounded-lg p-3">
                <p className="text-xs font-bold text-red-400 mb-1">✗ Desvantagem</p>
                <p className="text-xs text-muted-foreground">{t.con}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2>Políticas de Substituição</h2>
      <p>Quando um set está cheio e precisa acomodar um novo bloco, qual bloco expulsar?</p>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { name: "LRU (Least Recently Used)", desc: "Expulsa o bloco usado há mais tempo. Ótimo em teoria, mas caro de implementar exatamente para N grande. CPUs usam pseudo-LRU." },
          { name: "FIFO (First In, First Out)", desc: "Expulsa o bloco que entrou há mais tempo. Simples, mas pode ter comportamento ruim com padrões de acesso cíclicos." },
          { name: "Random", desc: "Escolhe aleatoriamente qual bloco expulsar. Surpreendentemente competitivo com LRU na prática. Simples de implementar." },
          { name: "LFU (Least Frequently Used)", desc: "Expulsa o bloco acessado com menor frequência. Ruim para padrões onde blocos são usados intensamente por um curto período." },
        ].map(p => (
          <div key={p.name} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-1">{p.name}</h3>
            <p className="text-sm text-muted-foreground">{p.desc}</p>
          </div>
        ))}
      </div>

      <h2>Políticas de Escrita</h2>
      <CodeBlock language="text" title="Write-through vs Write-back" code={`
WRITE-THROUGH:
  Cada escrita no cache → também escreve na memória imediatamente
  ✓ Simples, memória sempre consistente
  ✗ Gera muito tráfego de barramento; escrita lenta

  Otimização: Write buffer — armazena escritas em fila,
  libera o pipeline enquanto escritas são enviadas à memória.

WRITE-BACK (padrão moderno):
  Escrita vai apenas para o cache; bit "dirty" marcado
  Memória só é atualizada quando o bloco é expulso do cache
  ✓ Menor tráfego de barramento; escritas muito rápidas
  ✗ Complexidade de coerência (múltiplos caches em multicore)
  ✗ Risco de perda de dados em crash (mitigado com técnicas de flush)

WRITE-ALLOCATE (normalmente com write-back):
  Em um write miss: traz o bloco para o cache primeiro, depois escreve
  Alternativa (no-write-allocate): escreve direto na memória no miss
      `} />

      <h2>Miss Penalties e Tipos de Miss (3 Cs)</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        {[
          { c: "Compulsory Miss (Cold miss)", desc: "Primeiro acesso a um bloco — inevitável. Prefetching antecipado pode ajudar.", color: "border-blue-500/30 bg-blue-500/5" },
          { c: "Capacity Miss", desc: "Cache cheio não cabe todos os blocos necessários. Solução: cache maior.", color: "border-yellow-500/30 bg-yellow-500/5" },
          { c: "Conflict Miss", desc: "Dois blocos competem pelo mesmo set. Solução: aumentar associatividade.", color: "border-red-500/30 bg-red-500/5" },
        ].map(m => (
          <div key={m.c} className={`border rounded-xl p-4 ${m.color}`}>
            <h3 className="font-bold text-foreground text-sm mb-2">{m.c}</h3>
            <p className="text-sm text-muted-foreground">{m.desc}</p>
          </div>
        ))}
      </div>

      <h2>Cache nos CPUs Modernos</h2>
      <CodeBlock language="text" title="Intel Core i9-14900K — hierarquia de cache" code={`
L1-I (instrução):  48KB/core,  12-way,  4 ciclos de latência
L1-D (dados):      48KB/core,  12-way,  4 ciclos de latência
L2:               2MB/core,    16-way, 14 ciclos de latência
L3 (LLC):        36MB total,   12-way, 40-55 ciclos de latência

P-cores (performance): 8 cores + HyperThreading
E-cores (efficiency):  16 cores (sem HT, L2 menor)

AMD Ryzen 9 7950X — com 3D V-Cache:
L1-D:  32KB/core,  8-way
L2:   1MB/core,    8-way
L3:  96MB + 96MB V-Cache empilhado = 192MB total!
      `} />

      <AlertBox type="info" title="AMD 3D V-Cache">
        A AMD empilha silício de cache SRAM diretamente sobre o die do processador usando tecnologia TSV (Through-Silicon Via). O AMD Ryzen 9 7950X3D tem 192MB de L3 cache, melhorando drasticamente jogos e simulações que precisam de muitos dados frequentemente acessados.
      </AlertBox>

      <h2>Dicas de Programação para Cache</h2>
      <CodeBlock language="c" title="Cache-friendly vs cache-unfriendly" code={`
// RUIM: percorre coluna por coluna (stride de N floats = N*4 bytes)
// Cada acesso pula uma linha de cache inteira!
for (int j = 0; j < N; j++)
    for (int i = 0; i < N; i++)
        sum += matrix[i][j];  // pulo de N elementos

// BOM: percorre linha por linha (stride de 1 float = 4 bytes)
// Cada linha de cache contém 16 floats contíguos → reutilizados!
for (int i = 0; i < N; i++)
    for (int j = 0; j < N; j++)
        sum += matrix[i][j];  // acesso sequencial

// MELHOR para multiplicação de matrizes: loop tiling/blocking
// Divide a matriz em blocos que cabem no cache L1/L2
#define BLOCK 64
for (int i = 0; i < N; i += BLOCK)
  for (int j = 0; j < N; j += BLOCK)
    for (int k = 0; k < N; k += BLOCK)
      for (int ii = i; ii < i+BLOCK; ii++)
        for (int jj = j; jj < j+BLOCK; jj++)
          for (int kk = k; kk < k+BLOCK; kk++)
            C[ii][jj] += A[ii][kk] * B[kk][jj];
      `} />
    </PageContainer>
  );
}
