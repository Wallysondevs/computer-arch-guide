import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function MemoriaPrincipal() {
  return (
    <PageContainer
      title="Memória Principal (DRAM)"
      subtitle="A RAM do computador — como a DRAM funciona, suas tecnologias e os padrões DDR modernos."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <h2>DRAM vs SRAM</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { type: "SRAM (Static RAM)", cells: "6 transistores/bit", refresh: "Não precisa", speed: "1-5 ns", density: "Baixa", cost: "Alta (~$1000/GB)", use: "Cache L1/L2/L3 da CPU" },
          { type: "DRAM (Dynamic RAM)", cells: "1 transistor + 1 capacitor", refresh: "A cada ~64ms", speed: "60-100 ns", density: "Alta", cost: "Baixa (~$5/GB)", use: "Memória principal (RAM)" },
        ].map(m => (
          <div key={m.type} className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-bold text-primary text-sm mb-3">{m.type}</h3>
            <div className="space-y-1.5 text-sm">
              {[
                ["Células", m.cells], ["Refresh", m.refresh], ["Latência", m.speed],
                ["Densidade", m.density], ["Custo", m.cost], ["Uso", m.use],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2">
                  <span className="text-muted-foreground">{k}:</span>
                  <span className="text-foreground font-medium text-right">{v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h2>Como a DRAM Funciona</h2>
      <p>
        Cada bit em uma DRAM é armazenado como carga em um capacitor minúsculo (1 transistor + 1 capacitor = célula 1T1C). O capacitor vaza lentamente, por isso a memória precisa ser <strong>refrescada</strong> periodicamente (a cada ~64ms).
      </p>
      <CodeBlock language="text" title="Sequência de acesso à DRAM" code={`
1. RAS (Row Address Strobe): endereço da linha é enviado
   → Controller transmite linha para sense amplifiers
   → Linha inteira (tipicamente 8KB) é carregada no row buffer

2. CAS (Column Address Strobe): endereço da coluna é enviado
   → Coluna específica é selecionada no row buffer
   → Dado é enviado ao controlador

3. Precharge: linha é pré-carregada para o próximo acesso

Latências típicas DDR5-6400:
  tRCD (RAS to CAS): 46 ns   (ativar linha)
  CL (CAS Latency):  46 ns   (acessar coluna)
  tRP (Precharge):   46 ns   (preparar para nova linha)
  Total primeira linha: ~140 ns
  Acesso na mesma linha (row hit): apenas ~15 ns!
      `} />

      <h2>Evolução do DDR</h2>
      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="border border-border px-3 py-2 text-left">Geração</th>
              <th className="border border-border px-3 py-2 text-right">Freq.</th>
              <th className="border border-border px-3 py-2 text-right">Largura de Banda</th>
              <th className="border border-border px-3 py-2 text-right">Tensão</th>
              <th className="border border-border px-3 py-2 text-left">Ano</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["DDR", "200-400 MHz", "1,6-3,2 GB/s", "2,5V", "2000"],
              ["DDR2", "400-800 MHz", "3,2-6,4 GB/s", "1,8V", "2003"],
              ["DDR3", "800-1600 MHz", "6,4-12,8 GB/s", "1,5V", "2007"],
              ["DDR4", "1600-3200 MHz", "12,8-25,6 GB/s", "1,2V", "2014"],
              ["DDR5", "3200-8800 MHz", "51-141 GB/s", "1,1V", "2020"],
            ].map(([gen, freq, bw, volt, year]) => (
              <tr key={gen} className="hover:bg-muted/30">
                <td className="border border-border px-3 py-2 font-bold text-primary">{gen}</td>
                <td className="border border-border px-3 py-2 text-right font-mono">{freq}</td>
                <td className="border border-border px-3 py-2 text-right font-mono">{bw}</td>
                <td className="border border-border px-3 py-2 text-right font-mono">{volt}</td>
                <td className="border border-border px-3 py-2">{year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Dual Channel e Memória Interleaved</h2>
      <CodeBlock language="text" title="Configurações de canal de memória" code={`
SINGLE CHANNEL (1 módulo):
  Bus width: 64 bits
  DDR5-6400 bandwidth: 6400 MT/s × 8 bytes = 51,2 GB/s

DUAL CHANNEL (2 módulos idênticos):
  Bus width: 128 bits (dois canais de 64-bit simultâneos)
  Bandwidth dobrado: ~102,4 GB/s
  ✓ Recomendado para CPUs modernas

QUAD CHANNEL (servidores AMD EPYC, Intel Xeon):
  Bus width: 256 bits
  Bandwidth: ~204 GB/s

HBM (High Bandwidth Memory — GPUs, HPCs):
  Bus width: 1024 bits por stack!
  HBM3e: 1,2 TB/s por stack (NVIDIA H100 tem 5 stacks)
      `} />

      <h2>LPDDR — Memória de Baixo Consumo</h2>
      <p>
        Smartphones, tablets e laptops ultrafinos usam LPDDR (Low Power DDR), otimizada para eficiência energética:
      </p>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { gen: "LPDDR5X (2022)", speed: "8533 MT/s, 68 GB/s", power: "1,05V", use: "Apple A17, Qualcomm Snapdragon 8 Gen 3" },
          { gen: "LPDDR5 (2020)", speed: "6400 MT/s, 51 GB/s", power: "1,1V", use: "Apple M3, Samsung Exynos" },
          { gen: "HBM3e (2023)", speed: "9,8 Gbps/pin, 1,2 TB/s", power: "Alta (silício empilhado)", use: "NVIDIA H100, AMD Instinct MI300" },
        ].map(m => (
          <div key={m.gen} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-1">{m.gen}</h3>
            <p className="text-xs font-mono text-foreground mb-1">{m.speed}</p>
            <p className="text-xs text-muted-foreground">Tensão: {m.power}</p>
            <p className="text-xs text-muted-foreground">Usado em: {m.use}</p>
          </div>
        ))}
      </div>

      <h2>ECC Memory</h2>
      <p>
        Memória ECC (Error-Correcting Code) detecta e corrige erros de bit causados por radiação cósmica ou falhas elétricas. Essencial em servidores — um único bit-flip em memória pode causar corrupção silenciosa de dados:
      </p>
      <CodeBlock language="text" title="Como o ECC funciona" code={`
Para cada 64 bits de dados, adiciona 8 bits de paridade (código Hamming).
Total: 72-bit DIMM (vs 64-bit sem ECC).

ECC detecta e corrige erros de 1 bit (SECDED = Single Error Correct, Double Error Detect).

Taxa de erros sem ECC: ~1 bit flip por GB por mês
(para 256GB de RAM, ~1 erro silencioso por hora!)

Sistemas críticos que usam ECC:
  ✓ Servidores web/banco de dados
  ✓ Workstations científicas
  ✓ Supercomputadores (correção multi-bit com Chipkill)
  ✓ Sondas espaciais (radiação intensa)
      `} />

      <AlertBox type="warning" title="Timings de memória importam">
        Os timings CL-tRCD-tRP-tRAS (ex: 16-18-18-38 para DDR4) afetam a latência real. Memória mais rápida em MHz com timings ruins pode ser mais lenta que memória em MHz menor com timings apertados. Para jogos, latência baixa (CL bairxo) é crucial; para workloads de produtividade, largura de banda (MHz alto) importa mais.
      </AlertBox>
    </PageContainer>
  );
}
