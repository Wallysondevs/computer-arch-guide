import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Superescalaridade() {
  return (
    <PageContainer
      title="Superescalaridade e Execução Fora de Ordem"
      subtitle="Como CPUs modernas executam múltiplas instruções por ciclo e na ordem que for mais eficiente."
      difficulty="avancado"
      timeToRead="17 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
          Ler o capítulo "Introdução" e ter familiaridade básica com lógica binária.
        </AlertBox>
        <h2>Glossário rápido</h2>
        <ul>
          <li>
            <strong>{"Superescalar"}</strong> {' — '} {"executa múltiplas instruções por ciclo."}
          </li>
        <li>
            <strong>{"Despacho"}</strong> {' — '} {"múltiplas unidades funcionais em paralelo."}
          </li>
        <li>
            <strong>{"Out-of-order"}</strong> {' — '} {"executa fora da ordem do programa quando seguro."}
          </li>
        <li>
            <strong>{"ILP"}</strong> {' — '} {"Instruction-Level Parallelism — explorado por superescalar."}
          </li>
        <li>
            <strong>{"Reorder buffer"}</strong> {' — '} {"garante que retiros sejam em ordem."}
          </li>
        </ul>
        <h2>Além do Pipeline Simples</h2>
      <p>
        Um pipeline de 5 estágios ideal atinge CPI=1 (1 instrução por ciclo). Mas para superar esse limite, precisamos de duas técnicas poderosas: <strong>superescalaridade</strong> (múltiplas instruções por ciclo) e <strong>execução fora de ordem — OoO</strong> (reordenar instruções para minimizar hazards).
      </p>

      <h2>Superescalaridade</h2>
      <p>
        Uma CPU superescalar replica as unidades de execução e larga mais de uma instrução por ciclo:
      </p>
      <CodeBlock language="text" title="Pipeline 4-wide superescalar" code={`
Ciclo  | Unidade 1 | Unidade 2 | Unidade 3 | Unidade 4
  1    |    I1     |    I2     |    I3     |    I4
  2    |    I5     |    I6     |    I7     |    I8
  3    |    I9     |    I10    |    I11    |    I12

IPC ideal: 4 instruções/ciclo!

Mas: apenas instrução independentes podem ir em paralelo.
Dependências de dados e estruturais limitam o IPC real.

Exemplos de IPC real em cargas típicas:
  Intel Core i9-14900K: ~4-5 IPC (benchmark SPEC CPU2017)
  Apple M3:             ~5-6 IPC (benchmark SPEC CPU2017)
  AMD Zen 4:            ~4-5 IPC
      `} />

      <h2>Execução Fora de Ordem (Out-of-Order Execution)</h2>
      <p>
        OoO permite que a CPU execute instruções que estão prontas (sem dependências pendentes), mesmo que instrução anteriores ainda não tenham terminado. Isso esconde latências de cache miss e outras esperas:
      </p>
      <CodeBlock language="asm" title="OoO em ação" code={`
; Sequência original:
LW   x1, 0(x2)        ; Miss de cache! Vai para DRAM (200+ ciclos)
ADD  x3, x1, x4       ; Depende de x1 → deve esperar
MUL  x5, x6, x7       ; INDEPENDENTE! CPU executa isso enquanto
ADD  x8, x9, x10      ; INDEPENDENTE! aguarda o LW terminar
SUB  x11, x12, x13    ; INDEPENDENTE! e isso também
AND  x14, x15, x16    ; INDEPENDENTE! 
LW   x17, 8(x2)       ; Pode iniciar prefetch...
ADD  x3, x1, x4       ; Agora x1 chegou, executa ADD

; OoO: CPU reordena automaticamente, executando as instruções
; independentes enquanto o LW espera a DRAM
      `} />

      <h2>Arquitetura OoO: Os Componentes</h2>
      <div className="not-prose space-y-4 my-8">
        {[
          {
            name: "Frontend",
            parts: ["Branch Predictor: prediz direção de branches", "Instruction Fetch: busca 4-8 instruções/ciclo do cache I$", "Decodificador: converte instruções ISA em micro-ops", "µop Cache / Decoded ICache: evita re-decodificação (4096 μops em Intel)"],
          },
          {
            name: "Register Renaming (Renomeamento)",
            parts: ["Elimina hazards WAR (Write After Read) e WAW (Write After Write)", "Mapeia registradores arquiteturais (16 em x86) para físicos (280+ em Intel)", "RAT (Register Alias Table): mantém o mapeamento atual", "Permite execução verdadeiramente fora de ordem"],
          },
          {
            name: "Issue / Dispatch",
            parts: ["Reservation Station / Scheduler: buffer de µops aguardando operandos", "Instrução é despachada quando TODOS os seus operandos estiverem prontos", "OoO: instruções são despachadas conforme ficam prontas, não em ordem", "Intel Core Ultra: 256 entradas; AMD Zen 4: 320+ entradas"],
          },
          {
            name: "Execution Units",
            parts: ["Múltiplas unidades em paralelo: ALU, FPU, Load/Store, Branch", "Cada instrução vai para a unidade correta", "Intel Core: 12 portas de execução; AMD Zen 4: 12 portas"],
          },
          {
            name: "ROB — Reorder Buffer (Retire em Ordem)",
            parts: ["Armazena instruções em ordem original enquanto executam OoO", "Retire: instrução sai do ROB apenas em ordem — garante estado arquitetural correto", "Permite rollback de execução especulativa (branch misprediction)", "Intel Core: 512 entradas no ROB; AMD Zen 4: 448 entradas"],
          },
        ].map(c => (
          <div key={c.name} className="bg-card border border-border rounded-xl p-5">
            <h3 className="font-bold text-primary mb-3">{c.name}</h3>
            <ul className="space-y-1">
              {c.parts.map(p => (
                <li key={p} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5 shrink-0">›</span> {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2>Renomeamento de Registradores em Detalhes</h2>
      <CodeBlock language="text" title="Como o renomeamento elimina hazards" code={`
Código original (com hazards WAW e WAR):
  I1: ADD R1, R2, R3      ; escreve R1
  I2: ADD R4, R1, R5      ; lê R1 (RAW dependency com I1 — real!)
  I3: SUB R1, R6, R7      ; escreve R1 (WAW com I1 — false!)
  I4: MUL R8, R1, R9      ; lê R1 (RAW de qual R1? I3! WAR com I2 — false!)

Após renomeamento (R1 arquitetural → P1,P2 físicos):
  I1: ADD P1, R2, R3      ; P1 ← R2 + R3
  I2: ADD R4, P1, R5      ; depende P1 (I1) — verdadeira dependência
  I3: SUB P2, R6, R7      ; P2 ← R6 - R7 (independente! pode executar antes de I2!)
  I4: MUL R8, P2, R9      ; depende P2 (I3) — independente de I1 e I2!

Resultado: I1, I3 podem executar em paralelo!
           I2 espera I1; I4 espera I3. Dois pares independentes.
      `} />

      <AlertBox type="info" title="Limite de Tomasulo">
        O algoritmo de Tomasulo (1967), desenvolvido para o IBM System/360/91, é a base matemática do renomeamento de registradores e execução OoO moderno. Robert Tomasulo recebeu o Eckert-Mauchly Award em 1997 por este trabalho fundamental.
      </AlertBox>
    </PageContainer>
  );
}
