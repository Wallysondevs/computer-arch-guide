import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CicloInstrucao() {
  return (
    <PageContainer
      title="Ciclo de Instrução"
      subtitle="Fetch, Decode, Execute, Memory, Writeback — como a CPU processa cada instrução passo a passo."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <h2>O Ciclo de Instrução</h2>
      <p>
        Toda instrução passa por um conjunto de etapas que formam o ciclo de instrução. Em arquiteturas clássicas, essas etapas ocorrem sequencialmente. Em CPUs modernas com pipeline, ocorrem em paralelo para diferentes instruções.
      </p>

      <h2>As 5 Etapas do Pipeline Clássico (RISC)</h2>
      <div className="not-prose space-y-4 my-8">
        {[
          {
            step: "1. IF — Instruction Fetch",
            color: "border-cyan-500/40 bg-cyan-500/5",
            textColor: "text-cyan-400",
            desc: "A CPU lê a instrução da memória (ou cache L1-I) no endereço apontado pelo PC. O PC é incrementado apontando para a próxima instrução.",
            detail: "PC → MAR → [Cache L1-I] → IR",
          },
          {
            step: "2. ID — Instruction Decode",
            color: "border-purple-500/40 bg-purple-500/5",
            textColor: "text-purple-400",
            desc: "A Unidade de Controle decodifica o opcode da instrução e identifica: tipo de operação, registradores fonte/destino, e imediatos. Também lê os operandos do banco de registradores.",
            detail: "IR → UC → (opcode, rs1, rs2, rd, imm)",
          },
          {
            step: "3. EX — Execute",
            color: "border-yellow-500/40 bg-yellow-500/5",
            textColor: "text-yellow-400",
            desc: "A ALU executa a operação. Para instruções de cálculo: opera sobre os operandos. Para acessos à memória: calcula o endereço efetivo. Para desvios: compara e calcula o endereço alvo.",
            detail: "ALU(A, B, operação) → resultado",
          },
          {
            step: "4. MEM — Memory Access",
            color: "border-orange-500/40 bg-orange-500/5",
            textColor: "text-orange-400",
            desc: "Para instruções LOAD: lê o dado do endereço calculado no EX. Para instruções STORE: escreve o dado no endereço calculado. Para outras instruções, esta etapa é um pass-through.",
            detail: "endereço → Cache L1-D → dado lido/escrito",
          },
          {
            step: "5. WB — Write Back",
            color: "border-green-500/40 bg-green-500/5",
            textColor: "text-green-400",
            desc: "O resultado (da ALU ou da memória) é escrito de volta no registrador destino. Fecha o ciclo da instrução.",
            detail: "resultado → Reg[rd]",
          },
        ].map(s => (
          <div key={s.step} className={`border rounded-xl p-5 ${s.color}`}>
            <h3 className={`font-bold text-base mb-2 ${s.textColor}`}>{s.step}</h3>
            <p className="text-sm text-foreground/80 mb-2">{s.desc}</p>
            <code className="text-xs font-mono text-muted-foreground">{s.detail}</code>
          </div>
        ))}
      </div>

      <h2>Exemplo Completo: ADD R1, R2, R3</h2>
      <CodeBlock language="text" title="Executando ADD R1, R2, R3 (R1 = R2 + R3)" code={`
Instrução RISC-V:  ADD x1, x2, x3   (x1 ← x2 + x3)

IF:   PC=0x1000, busca instrução 0x003100B3 da cache
      PC ← PC + 4 = 0x1004

ID:   0x003100B3 decodificado:
      opcode=0110011 (tipo R, operação aritmética)
      rd=x1, rs1=x2, rs2=x3, funct3=000, funct7=0000000
      Lê: R2=15, R3=27

EX:   ALU: 15 + 27 = 42
      Flags: Zero=0, Negative=0, Overflow=0

MEM:  Não é acesso à memória → pass-through (42)

WB:   x1 ← 42
      Estado: R1=42, R2=15, R3=27
      `} />

      <h2>Exemplo: LOAD x1, 8(x2)</h2>
      <CodeBlock language="text" title="Carregando da memória: LOAD x1, 8(x2)" code={`
Instrução RISC-V: LW x1, 8(x2)   (x1 ← Mem[x2 + 8])

IF:   Busca instrução

ID:   opcode=0000011 (LOAD), rd=x1, rs1=x2, imm=8
      Lê: R2 = 0x2000

EX:   Endereço efetivo = R2 + 8 = 0x2008

MEM:  Lê 4 bytes da Cache L1-D no endereço 0x2008
      Dado lido: 0x0000002A (= 42)

WB:   x1 ← 42
      `} />

      <h2>Instruções de Desvio</h2>
      <CodeBlock language="text" title="BEQ x1, x2, offset — Branch if Equal" code={`
IF:   Busca instrução BEQ

ID:   opcode=1100011, rs1=x1, rs2=x2, imm=offset
      Lê: R1=42, R2=42

EX:   Compara R1 == R2 → True
      Endereço alvo: PC + (offset * 2) = 0x1010

MEM:  N/A

WB:   PC ← 0x1010 (desvio tomado!)
      Instruções após o branch que já entraram no pipeline
      são descartadas (flush) → branch penalty!
      `} />

      <AlertBox type="warning" title="Branch Penalty">
        Quando um desvio é tomado em uma CPU com pipeline profundo, as instruções que foram buscadas especulativamente precisam ser descartadas. Uma CPU com pipeline de 5 estágios paga ~3 ciclos de penalidade por desvio mal predito. CPUs modernas com predição de branch avançada mitigam isso fortemente.
      </AlertBox>

      <h2>Exceções e Interrupções</h2>
      <p>Durante o ciclo de instrução, eventos especiais podem interromper o fluxo normal:</p>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { name: "Divisão por zero", type: "Exceção síncrona", desc: "Causada pela instrução atual. CPU salva o PC e salta para o handler." },
          { name: "Page fault", type: "Exceção síncrona", desc: "Página de memória não está na RAM. CPU chama o SO para carregar." },
          { name: "Interrupt de hardware", type: "Interrupção assíncrona", desc: "Dispositivo de I/O sinalizando dado pronto. CPU termina instrução atual e atende." },
          { name: "System call (ECALL/INT)", type: "Trap", desc: "Software solicita serviço do SO intencionalmente." },
        ].map(e => (
          <div key={e.name} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-foreground text-sm mb-0.5">{e.name}</h3>
            <span className="text-xs text-primary">{e.type}</span>
            <p className="text-sm text-muted-foreground mt-1">{e.desc}</p>
          </div>
        ))}
      </div>

      <h2>CPI — Cycles Per Instruction</h2>
      <CodeBlock language="text" title="Métricas de performance" code={`
CPI (Cycles Per Instruction) = ciclos totais / instruções executadas

CPU sem pipeline:        CPI = 5 (5 etapas por instrução)
CPU com pipeline ideal:  CPI = 1
CPU real (com hazards):  CPI ≈ 1.1 a 2.0

Performance = (1/CPI) × frequência × (instruções por programa)
            = IPC × frequência × N

IPC (Instructions Per Cycle) = 1/CPI

Modern out-of-order CPUs can achieve IPC > 4 (more than 4 instructions
completed per clock cycle!) through superscalar execution.
      `} />
    </PageContainer>
  );
}
