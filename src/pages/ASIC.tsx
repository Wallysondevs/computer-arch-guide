import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function ASIC() {
  return (
    <PageContainer
      title="ASICs"
      subtitle="Application-Specific Integrated Circuits — chips de função fixa otimizados ao extremo para uma tarefa específica."
      difficulty="avancado"
      timeToRead="12 min"
    >
      <h2>O que é um ASIC?</h2>
      <p>
        Um ASIC (Application-Specific Integrated Circuit) é um chip projetado e fabricado para uma função específica e única. Diferente de CPUs (propósito geral) e FPGAs (programáveis), ASICs são otimizados ao máximo para sua função — resultando em máxima eficiência de energia e performance por área, mas sem flexibilidade.
      </p>

      <h2>ASIC vs CPU vs FPGA</h2>
      <div className="not-prose overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/50">
              <th className="border border-border px-3 py-2 text-left">Aspecto</th>
              <th className="border border-border px-3 py-2 text-center">CPU</th>
              <th className="border border-border px-3 py-2 text-center">FPGA</th>
              <th className="border border-border px-3 py-2 text-center text-primary">ASIC</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Flexibilidade", "Alta", "Alta", "Nenhuma"],
              ["Performance", "Média", "Alta", "Máxima"],
              ["Eficiência energética", "Média", "Alta", "Máxima"],
              ["Custo por unidade (volume)", "Médio", "Alto", "Baixo"],
              ["Custo de desenvolvimento (NRE)", "Zero", "Zero", "$10M–$500M"],
              ["Tempo de desenvolvimento", "—", "Semanas", "1–3 anos"],
              ["Risco de obsolescência", "Baixo", "Baixo", "Alto"],
            ].map(([aspect, cpu, fpga, asic]) => (
              <tr key={aspect} className="hover:bg-muted/30">
                <td className="border border-border px-3 py-2 font-medium">{aspect}</td>
                <td className="border border-border px-3 py-2 text-center text-muted-foreground">{cpu}</td>
                <td className="border border-border px-3 py-2 text-center text-muted-foreground">{fpga}</td>
                <td className="border border-border px-3 py-2 text-center font-bold text-primary">{asic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Fluxo de Design de ASIC</h2>
      <CodeBlock language="text" title="Do RTL ao silício" code={`
1. ESPECIFICAÇÃO
   Definir a função do chip, requisitos de área, frequência, potência.

2. RTL DESIGN (Register-Transfer Level)
   Código em Verilog/VHDL descrevendo o circuito.
   
3. VERIFICAÇÃO FUNCIONAL
   Simulação exaustiva com testbenches, formal verification.
   
4. SÍNTESE LÓGICA
   RTL → netlist de células da biblioteca padrão (Standard Cell Library)
   para o processo alvo (TSMC 3nm, Samsung 4nm, etc.)
   
5. PLACE & ROUTE (P&R) — Implementação Física
   a. Floorplanning: posicionar blocos grandes (CPU core, cache, analog)
   b. Placement: posicionar células lógicas
   c. Clock Tree Synthesis (CTS): distribuir clock uniformemente
   d. Routing: conectar tudo com fios de metal (10-15 camadas!)
   e. Signoff: análise de timing, potência, IR drop, EM
   
6. TAPE-OUT
   Envio dos dados GDS-II/OASIS para a fundição (fab).
   NRE (Non-Recurring Engineering): $5M–$500M+ para 3nm!
   
7. FABRICAÇÃO
   TSMC/Samsung/Intel Foundry: 3-6 meses
   
8. TEST & PACKAGING
   Teste de defeitos de fabricação (yield ~80-95%)
   Empacotamento em BGA, flip-chip, CoWoS (NVIDIA H100)
      `} />

      <h2>Exemplos de ASICs Famosos</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { name: "Bitcoin ASICs (Bitmain Antminer)", purpose: "Mineração SHA-256", perf: "100+ TH/s, eficiência >100 GH/J. 1.000× mais eficiente que GPU.", cost: "$2.000–$10.000" },
          { name: "Google TPU (Tensor Processing Unit)", purpose: "Treinamento e inferência de redes neurais (TensorFlow)", perf: "TPU v5p: 459 TFLOPS BF16, 96 GB HBM2e", cost: "Disponível via Google Cloud" },
          { name: "Apple Neural Engine (ANE)", purpose: "Inferência de ML em iPhone/Mac (Face ID, Siri, etc.)", perf: "A17 Pro ANE: 35 TOPS, integrado no SoC", cost: "Integrado no chip (sem custo separado)" },
          { name: "Amazon Graviton 4", purpose: "CPU ARM para cloud AWS", perf: "96 cores Neoverse V2, desempenho 75% maior que Graviton 3", cost: "EC2 instances na AWS" },
          { name: "NVIDIA H100 (Hopper)", purpose: "Treinamento de LLMs e HPC", perf: "4 PetaFLOPS FP8 (com sparsity)", cost: "$30.000–$40.000 por unidade" },
          { name: "Qualcomm Snapdragon X Elite", purpose: "SoC para laptops Windows on ARM", perf: "12 cores Oryon, 45 TOPS NPU, modem 5G integrado", cost: "Em laptops como Surface Pro 11" },
        ].map(a => (
          <div key={a.name} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-1">{a.name}</h3>
            <p className="text-xs text-muted-foreground mb-1"><strong>Função:</strong> {a.purpose}</p>
            <p className="text-xs text-foreground/80 mb-1">{a.perf}</p>
            <p className="text-xs text-muted-foreground">{a.cost}</p>
          </div>
        ))}
      </div>

      <AlertBox type="info" title="A barreira de entrada do ASIC">
        O custo de tape-out em TSMC 3nm é ~$20-50M para uma máscara completa. Por isso, apenas empresas grandes (Apple, Google, Amazon, NVIDIA) desenvolvem ASICs próprios. Para volumes menores ou orçamentos reduzidos, existem opções como eFabless (processo GFMPW via Google), Tiny Tapeout (chips compartilhados), e Silicon Foundry programs.
      </AlertBox>
    </PageContainer>
  );
}
