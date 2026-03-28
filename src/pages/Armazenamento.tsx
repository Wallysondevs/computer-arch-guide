import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Armazenamento() {
  return (
    <PageContainer
      title="Armazenamento (SSD e NVMe)"
      subtitle="Do disco magnético ao flash NAND — como funciona o armazenamento moderno e por que os SSDs são tão mais rápidos."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <h2>HDD — Hard Disk Drive</h2>
      <p>
        HDDs armazenam dados magneticamente em discos rotativos (pratos). Um braço mecânico posiciona a cabeça de leitura/escrita sobre a trilha correta:
      </p>
      <CodeBlock language="text" title="Latência de um HDD a 7200 RPM" code={`
Seek time (posicionar braço):     ~3-10 ms (média ~5 ms)
Rotational latency (esperar setor): 60s/7200RPM/2 = ~4 ms
Transfer time (leitura sequencial): 200 MB/s → 0,005 ms/KB

Total para leitura aleatória:     ~9-14 ms   ← LENTO!
Total para leitura sequencial:    ~0,1 ms    ← OK

Conclusão: HDDs são excelentes para leituras sequenciais
            mas péssimos para acesso aleatório (banco de dados!)
      `} />

      <h2>NAND Flash — A Tecnologia do SSD</h2>
      <p>
        Flash NAND armazena dados como carga em transistores de porta flutuante (floating gate FET ou charge trap). Não tem partes móveis — acesso puramente eletrônico:
      </p>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { type: "SLC (Single Level Cell)", bits: "1 bit/célula", speed: "Muito rápido, muito durável", use: "Cache de SSD enterprise, uso industrial", life: "~100.000 ciclos P/E" },
          { type: "MLC (Multi Level Cell)", bits: "2 bits/célula", speed: "Rápido, durável", use: "SSDs enterprise e prosumer de alta performance", life: "~10.000 ciclos P/E" },
          { type: "TLC (Triple Level Cell)", bits: "3 bits/célula", speed: "Adequado para consumo", use: "SSDs consumer (Samsung 990 Pro, WD Black SN850)", life: "~3.000 ciclos P/E" },
          { type: "QLC (Quad Level Cell)", bits: "4 bits/célula", speed: "Mais lento, menos durável", use: "SSDs de alta capacidade econômicos", life: "~1.000 ciclos P/E" },
        ].map(f => (
          <div key={f.type} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-1">{f.type}</h3>
            <p className="text-xs font-mono text-foreground mb-1">{f.bits} · {f.life}</p>
            <p className="text-xs text-muted-foreground mb-1">{f.speed}</p>
            <p className="text-xs text-muted-foreground">{f.use}</p>
          </div>
        ))}
      </div>

      <h2>Interfaces de Armazenamento</h2>
      <div className="not-prose space-y-3 my-6">
        {[
          { iface: "SATA III", speed: "600 MB/s teórico, ~550 MB/s real", lat: "~70 μs", form: "2,5\" ou M.2 (SATA key)", note: "Bottleneck: interface. SSDs SATA chegam ao limite da interface." },
          { iface: "NVMe via PCIe 3.0 ×4", speed: "~3,5 GB/s leitura", lat: "~20 μs", form: "M.2 (NVMe key), U.2", note: "Salto enorme sobre SATA. Samsung 970 EVO Plus." },
          { iface: "NVMe via PCIe 4.0 ×4", speed: "~7 GB/s leitura", lat: "~10 μs", form: "M.2 (NVMe)", note: "Dobro do PCIe 3.0. Samsung 990 Pro, WD Black SN850X." },
          { iface: "NVMe via PCIe 5.0 ×4", speed: "~14 GB/s leitura", lat: "~7 μs", form: "M.2 (NVMe)", note: "Frontier atual. Corsair MP700 Pro, Crucial T705." },
          { iface: "Optane (Intel 3D XPoint)", speed: "~3,5 GB/s + latência ultra-baixa", lat: "~2 μs", form: "M.2, U.2", note: "Descontinuado em 2022. Latência DRAM-like mas persistente." },
        ].map(i => (
          <div key={i.iface} className="bg-card border border-border rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h3 className="font-bold text-primary text-sm">{i.iface}</h3>
              <div className="flex gap-3 text-xs font-mono text-muted-foreground">
                <span>{i.speed}</span>
                <span>Lat: {i.lat}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{i.note}</p>
          </div>
        ))}
      </div>

      <h2>Arquitetura Interna de um SSD</h2>
      <CodeBlock language="text" title="Componentes de um SSD NVMe" code={`
┌─────────────────────────────────────────┐
│              SSD NVMe                   │
│                                         │
│  ┌──────────┐    ┌────────────────────┐ │
│  │ PCIe     │    │   Controlador SSD  │ │
│  │ Interface│◄──►│ ┌──────────────┐  │ │
│  └──────────┘    │ │  FTL (Flash  │  │ │
│                  │ │  Translation │  │ │
│  ┌──────────┐    │ │   Layer)     │  │ │
│  │ DRAM     │◄──►│ └──────────────┘  │ │
│  │ Cache    │    └────────────────────┘ │
│  │(map table)│           │              │
│  └──────────┘    ┌───────▼───────┐     │
│                  │  NAND Flash   │     │
│                  │ (chips/dies/  │     │
│                  │  planes)      │     │
│                  └───────────────┘     │
└─────────────────────────────────────────┘

FTL (Flash Translation Layer):
  → Traduz endereços lógicos (LBA) para físicos (PBA)
  → Implementa wear leveling (distribui writes)
  → Gerencia garbage collection e over-provisioning
      `} />

      <h2>Write Amplification e Garbage Collection</h2>
      <p>
        Flash NAND só pode ser apagada em blocos grandes (~256KB), mesmo que apenas alguns bytes precisem ser atualizados. Isso causa <strong>write amplification</strong>:
      </p>
      <CodeBlock language="text" title="Garbage Collection no SSD" code={`
Problema: Escrever 4KB pode exigir apagar 256KB

Processo:
1. Dados válidos do bloco são copiados para novo bloco limpo
2. Bloco antigo é apagado (operação lenta: ~1-2ms)
3. Novo dado de 4KB é escrito no bloco limpo

Write Amplification Factor (WAF):
  WAF = bytes escritos no NAND / bytes escritos pelo host
  WAF ideal = 1,0 (sem amplificação)
  WAF real (uso intenso): 3-10×

Over-provisioning (OP):
  SSDs reservam ~7-28% do NAND para uso interno
  7% OP: uso básico do SO
  28% OP: cargas de servidor intensa, reduz WAF significativamente
      `} />

      <AlertBox type="info" title="Por que SSD degrada com o tempo?">
        À medida que células NAND envelhecem (ciclos de apagamento), a camada de óxido desgasta e a célula retém menos carga. O controlador compensa aumentando a tensão de programação e usando ECC mais agressivo, mas eventualmente a célula se torna não confiável. SSDs modernos têm durabilidade de centenas a milhares de TBW (TeraBytes Written).
      </AlertBox>
    </PageContainer>
  );
}
