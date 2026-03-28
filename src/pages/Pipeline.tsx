import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Pipeline() {
  return (
    <PageContainer
      title="Pipeline"
      subtitle="A técnica que permite executar múltiplas instruções em paralelo, como uma linha de montagem de fábrica."
      difficulty="intermediario"
      timeToRead="16 min"
    >
      <h2>A Ideia do Pipeline</h2>
      <p>
        Assim como uma linha de montagem de fábrica processa múltiplos carros simultaneamente em diferentes estágios, um pipeline de CPU processa múltiplas instruções ao mesmo tempo — cada uma em um estágio diferente do ciclo.
      </p>

      <div className="not-prose my-8">
        <h3 className="font-bold text-foreground mb-4">Sem pipeline vs. Com pipeline de 5 estágios:</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono border-collapse">
            <thead>
              <tr className="text-muted-foreground">
                <th className="border border-border px-3 py-2 text-left">Instrução</th>
                {[1,2,3,4,5,6,7,8,9].map(c => (
                  <th key={c} className="border border-border px-3 py-2">Ciclo {c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { instr: "I1", stages: ["IF","ID","EX","MEM","WB","","","",""] },
                { instr: "I2", stages: ["","","","","","IF","ID","EX","MEM"] },
                { instr: "I3", stages: ["","","","","","","","","IF"] },
              ].map(row => (
                <tr key={row.instr}>
                  <td className="border border-border px-3 py-2 font-bold text-foreground">{row.instr}</td>
                  {row.stages.map((s, i) => (
                    <td key={i} className={`border border-border px-3 py-2 text-center ${s ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}>{s || "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-muted-foreground mt-2">Sem pipeline: I1 termina no ciclo 5, I2 começa no ciclo 6. Com pipeline: I2 começa no ciclo 2!</p>
        </div>

        <div className="mt-6 overflow-x-auto">
          <h3 className="font-bold text-foreground mb-4">Com pipeline — 3 instruções simultâneas a partir do ciclo 5:</h3>
          <table className="w-full text-xs font-mono border-collapse">
            <thead>
              <tr className="text-muted-foreground">
                <th className="border border-border px-3 py-2 text-left">Instrução</th>
                {[1,2,3,4,5,6,7,8,9].map(c => (
                  <th key={c} className="border border-border px-3 py-2">Ciclo {c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { instr: "I1", stages: ["IF","ID","EX","MEM","WB","","","",""] },
                { instr: "I2", stages: ["","IF","ID","EX","MEM","WB","","",""] },
                { instr: "I3", stages: ["","","IF","ID","EX","MEM","WB","",""] },
                { instr: "I4", stages: ["","","","IF","ID","EX","MEM","WB",""] },
                { instr: "I5", stages: ["","","","","IF","ID","EX","MEM","WB"] },
              ].map(row => (
                <tr key={row.instr}>
                  <td className="border border-border px-3 py-2 font-bold text-foreground">{row.instr}</td>
                  {row.stages.map((s, i) => (
                    <td key={i} className={`border border-border px-3 py-2 text-center ${s ? "bg-primary/20 text-primary font-bold" : "text-muted-foreground"}`}>{s || "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-muted-foreground mt-2">Pipeline de 5 estágios: idealmente 1 instrução completa por ciclo (CPI ≈ 1)</p>
        </div>
      </div>

      <h2>Hazards — Os Problemas do Pipeline</h2>
      <p>
        Três tipos de situações impedem o pipeline de funcionar a CPI=1:
      </p>

      <h3>1. Hazard de Dados</h3>
      <p>Uma instrução precisa do resultado de uma instrução que ainda não terminou:</p>
      <CodeBlock language="asm" title="Data hazard — RAW (Read After Write)" code={`
ADD x1, x2, x3    ; x1 é escrito no WB (ciclo 5)
SUB x4, x1, x5    ; x1 é lido no ID (ciclo 3) ← HAZARD!
AND x6, x1, x7    ; x1 é lido no ID (ciclo 4) ← HAZARD!
OR  x8, x1, x9    ; x1 é lido no ID (ciclo 5) ← OK (WB já terminou)

Solução 1: Stalls (bolhas no pipeline — ciclos desperdiçados)
Solução 2: Forwarding/Bypassing — envia resultado direto da ALU
           para a entrada da próxima instrução, sem esperar o WB
      `} />

      <CodeBlock language="text" title="Forwarding resolve o data hazard" code={`
Sem forwarding (2 stalls necessários):
  ADD: IF ID EX MEM WB
  SUB:    IF ID  **  **  EX MEM WB  (stalls = bolhas)

Com forwarding (0 stalls):
  ADD: IF ID EX ──▶ resultado disponível aqui
  SUB:    IF ID EX  (recebe resultado do EX de ADD via forwarding)

Forwarding paths:
  EX/MEM → EX input   (1 ciclo de distância)
  MEM/WB → EX input   (2 ciclos de distância — para LOADs)
      `} />

      <h3>2. Hazard de Controle (Branch Hazard)</h3>
      <CodeBlock language="text" title="Branch hazard" code={`
BEQ x1, x2, label  ; branch — resultado sabido no EX (ciclo 3)
ADD x3, x4, x5     ; buscada no ciclo 2 — pode não ser a certa!
SUB x6, x7, x8     ; buscada no ciclo 3 — pode não ser a certa!

Soluções:
  1. Flush: descarta instruções erradas (penalidade = profundidade do branch)
  2. Branch prediction: tenta adivinhar o destino antes de saber
  3. Delayed branch (MIPS): instrução após branch SEMPRE executa
  4. Predição dinâmica: usa histórico de branches para decidir
      `} />

      <h3>3. Hazard Estrutural</h3>
      <p>
        Dois componentes precisam do mesmo recurso de hardware ao mesmo tempo. Exemplo clássico: uma memória única (sem cache separada de instrução/dados) — IF e MEM tentam acessá-la simultaneamente.
      </p>
      <p>
        <strong>Solução:</strong> Caches Harvard separadas para instruções (I$) e dados (D$) — eliminam o hazard estrutural mais comum.
      </p>

      <h2>Branch Prediction</h2>
      <CodeBlock language="text" title="Estratégias de predição de branches" code={`
Nível 1 — Estático:
  Predict Not Taken:  assume que o branch não é tomado
  Predict Taken:      assume que o branch é tomado
  Acurácia: ~60-70%

Nível 2 — Dinâmico (baseado em histórico):
  1-bit predictor:    lembra se o último branch foi tomado
  2-bit saturating counter:
    00 (Strongly Not Taken) ↔ 01 (Weakly Not Taken)
                            ↔ 10 (Weakly Taken) ↔ 11 (Strongly Taken)
  Acurácia: ~85-90%

Nível 3 — Correlacionado:
  (2,2) predictor:    usa histórico dos últimos 2 branches
  Acurácia: ~93%

Nível 4 — Neural (CPUs modernas):
  Perceptron predictor, TAGE (AMD Zen, Intel)
  Acurácia: >99% para padrões regulares!
  Usado no AMD Zen 4 e Intel Alder Lake.
      `} />

      <h2>Pipelines Profundos</h2>
      <p>
        CPUs modernas têm pipelines muito mais profundos que 5 estágios:
      </p>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { cpu: "Intel Pentium 4 (Netburst)", stages: "31 estágios", note: "Clock muito alto, mas penalidade de branch enorme. Ineficiente." },
          { cpu: "Intel Core (Merom, 2006)", stages: "14 estágios", note: "Ponto de equilíbrio melhor. Base da arquitetura atual." },
          { cpu: "AMD Zen 4 (2022)", stages: "19 estágios", note: "Frontend profundo com execução OoO de alta largura." },
          { cpu: "ARM Cortex-A77 (2019)", stages: "13 estágios", note: "Mobile: equilíbrio entre performance e consumo." },
        ].map(p => (
          <div key={p.cpu} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-foreground text-sm">{p.cpu}</h3>
            <p className="text-primary font-bold text-sm">{p.stages}</p>
            <p className="text-xs text-muted-foreground mt-1">{p.note}</p>
          </div>
        ))}
      </div>

      <AlertBox type="warning" title="Pipeline profundo ≠ mais rápido">
        Pipelines mais profundos aumentam a frequência de clock possível (cada estágio faz menos trabalho), mas aumentam a penalidade por branch (mais estágios para limpar) e o consumo de energia. A tendência moderna é aumentar a largura do pipeline (mais instruções por ciclo) em vez da profundidade.
      </AlertBox>
    </PageContainer>
  );
}
