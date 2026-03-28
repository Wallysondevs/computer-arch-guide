import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function HierarquiaMemoria() {
  return (
    <PageContainer
      title="Hierarquia de Memória"
      subtitle="Da velocidade dos registradores até a capacidade dos SSDs — como os computadores equilibram custo, velocidade e capacidade."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <h2>O Problema Fundamental</h2>
      <p>
        Existe uma contradição central no design de memória: memória <em>rápida</em> é cara e pequena; memória <em>barata</em> é lenta e grande. Nenhuma tecnologia única resolve esse dilema. A solução é criar uma <strong>hierarquia</strong> de diferentes tipos de memória, cada um com seu custo-benefício.
      </p>

      <h2>Os Níveis da Hierarquia</h2>
      <div className="not-prose space-y-3 my-8">
        {[
          { level: "Registradores", cap: "< 1 KB", lat: "< 1 ns", bw: "~10 TB/s", tech: "Flip-flops CMOS", color: "bg-cyan-500", barW: "5%", note: "Dentro do núcleo da CPU. Acesso em 0 ciclos extras." },
          { level: "Cache L1", cap: "32–128 KB", lat: "1–4 ns", bw: "~5 TB/s", tech: "SRAM 6T", color: "bg-blue-500", barW: "15%", note: "Separada: 32KB instrução + 32KB dados por core." },
          { level: "Cache L2", cap: "256 KB – 2 MB", lat: "5–12 ns", bw: "~1 TB/s", tech: "SRAM 6T", color: "bg-indigo-500", barW: "30%", note: "Unificada (dados + instruções) por core." },
          { level: "Cache L3", cap: "8–192 MB", lat: "20–50 ns", bw: "~500 GB/s", tech: "SRAM 6T", color: "bg-purple-500", barW: "45%", note: "Compartilhada entre todos os cores do processador." },
          { level: "DRAM (RAM)", cap: "4–512 GB", lat: "60–100 ns", bw: "~100 GB/s", tech: "DRAM 1T1C", color: "bg-yellow-500", barW: "65%", note: "Memória principal. Requer refresh periódico." },
          { level: "NVMe SSD", cap: "250 GB – 8 TB", lat: "~100 μs", bw: "~12 GB/s", tech: "Flash NAND", color: "bg-orange-500", barW: "80%", note: "Armazenamento rápido via PCIe 5.0." },
          { level: "SATA SSD / HDD", cap: "500 GB – 20 TB", lat: "0.1–10 ms", bw: "0.5–6 GB/s", tech: "Flash / Magnético", color: "bg-red-500", barW: "100%", note: "Armazenamento de massa. HDDs têm latência mecânica." },
        ].map(l => (
          <div key={l.level} className="bg-card border border-border rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${l.color}`} />
                <h3 className="font-bold text-foreground text-sm">{l.level}</h3>
              </div>
              <div className="flex gap-4 text-xs text-muted-foreground font-mono">
                <span>Cap: {l.cap}</span>
                <span>Lat: {l.lat}</span>
                <span>BW: {l.bw}</span>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mb-2">
              <div className={`h-1.5 rounded-full ${l.color} opacity-70`} style={{ width: l.barW }} />
            </div>
            <p className="text-xs text-muted-foreground">{l.note} — <em>{l.tech}</em></p>
          </div>
        ))}
      </div>

      <h2>Princípio da Localidade</h2>
      <p>
        A hierarquia de memória funciona graças ao <strong>princípio da localidade</strong> — a observação empírica de que programas tendem a acessar memória de forma previsível:
      </p>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { type: "Localidade Temporal", desc: "Dados acessados recentemente provavelmente serão acessados de novo em breve. Exemplo: variáveis de loop, o próprio PC." },
          { type: "Localidade Espacial", desc: "Dados próximos de dados recentemente acessados também serão acessados. Exemplo: percorrer um array sequencialmente." },
        ].map(l => (
          <div key={l.type} className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-bold text-primary text-sm mb-2">{l.type}</h3>
            <p className="text-sm text-muted-foreground">{l.desc}</p>
          </div>
        ))}
      </div>

      <h2>Custo por Bit</h2>
      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="border border-border px-4 py-2 text-left">Tipo</th>
              <th className="border border-border px-4 py-2 text-right">Custo por GB</th>
              <th className="border border-border px-4 py-2 text-right">Fator relativo</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["SRAM (cache)", "~$1.000–10.000", "10.000×"],
              ["DRAM (RAM)", "~$5–10", "100×"],
              ["NAND Flash (SSD)", "~$0,05–0,15", "1–3×"],
              ["HDD", "~$0,02–0,05", "1×"],
            ].map(([type, cost, factor]) => (
              <tr key={type} className="hover:bg-muted/30">
                <td className="border border-border px-4 py-2 font-medium">{type}</td>
                <td className="border border-border px-4 py-2 text-right font-mono">{cost}</td>
                <td className="border border-border px-4 py-2 text-right text-primary font-bold">{factor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AlertBox type="success" title="Por que a hierarquia funciona?">
        Se 90% dos acessos de memória forem servidos pela cache L1 (que responde em 1-4 ns) e apenas 10% chegarem à DRAM (100 ns), a latência média é 0,9×4 + 0,1×100 = 13,6 ns — muito próxima da velocidade do cache! A localidade de acesso dos programas garante que isso aconteça na prática.
      </AlertBox>

      <h2>Impacto de Performance: Um Exemplo Real</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        {[
          { scenario: "Loop com array pequeno (cabe em L1)", perf: "100%", bar: "bg-green-500", desc: "Todos os acessos servidos pelo L1 cache em ~4 ciclos." },
          { scenario: "Array médio (cabe em L3)", perf: "20–40%", bar: "bg-yellow-500", desc: "Mix de hits L1/L2 e misses para L3 (~40 ciclos)." },
          { scenario: "Array grande (DRAM necessária)", perf: "5–10%", bar: "bg-red-500", desc: "Frequentes misses chegam à DRAM: 200+ ciclos por acesso." },
        ].map(s => (
          <div key={s.scenario} className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-bold text-foreground mb-2">{s.scenario}</h3>
            <div className="w-full bg-muted rounded-full h-2 mb-1">
              <div className={`h-2 rounded-full ${s.bar}`} style={{ width: s.perf.split("–")[0] }} />
            </div>
            <p className="text-xs font-bold text-foreground mb-1">Performance relativa: {s.perf}</p>
            <p className="text-xs text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
