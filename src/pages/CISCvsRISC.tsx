import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CISCvsRISC() {
  return (
    <PageContainer
      title="CISC vs RISC"
      subtitle="A batalha das filosofias de design de processadores — e por que a distinção importa cada vez menos."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
          Ler o capítulo "Introdução" e ter familiaridade básica com lógica binária.
        </AlertBox>
        <h2>Glossário rápido</h2>
        <ul>
          <li>
            <strong>{"CISC"}</strong> {' — '} {"Complex Instruction Set — instruções poderosas e variadas (x86)."}
          </li>
        <li>
            <strong>{"RISC"}</strong> {' — '} {"Reduced Instruction Set — instruções simples e uniformes (ARM, RISC-V)."}
          </li>
        <li>
            <strong>{"Pipeline"}</strong> {' — '} {"RISC facilita pipelining; CISC sofre."}
          </li>
        <li>
            <strong>{"Microcódigo"}</strong> {' — '} {"x86 moderno traduz CISC em micro-ops RISC internamente."}
          </li>
        <li>
            <strong>{"Convergência"}</strong> {' — '} {"linha entre CISC e RISC ficou borrada nas implementações modernas."}
          </li>
        </ul>
        <h2>O Debate Histórico</h2>
      <p>
        Na década de 1980, surgiu um debate fundamental sobre como projetar processadores eficientes. De um lado, a filosofia CISC (Complex Instruction Set Computer); do outro, a RISC (Reduced Instruction Set Computer).
      </p>

      <h2>CISC — Complex Instruction Set Computer</h2>
      <p>
        A filosofia CISC busca fazer o hardware o mais poderoso possível, com instruções complexas que realizam múltiplas operações em um único ciclo (teoricamente):
      </p>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { aspect: "Origem", val: "IBM 360 (1964), Intel 8086 (1978), VAX (1977)" },
          { aspect: "Número de instruções", val: "Centenas a milhares (x86 tem ~1500+)" },
          { aspect: "Tamanho das instruções", val: "Variável (1-15 bytes em x86)" },
          { aspect: "Modos de endereçamento", val: "Muitos e complexos" },
          { aspect: "Registradores", val: "Poucos (x86 original: 8; x86-64: 16 GPRs)" },
          { aspect: "Filosofia", val: "Hardware faz o máximo possível para facilitar o compilador" },
        ].map(r => (
          <div key={r.aspect} className="bg-card border border-border rounded-xl p-3">
            <p className="text-xs text-muted-foreground">{r.aspect}</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{r.val}</p>
          </div>
        ))}
      </div>

      <h2>RISC — Reduced Instruction Set Computer</h2>
      <p>
        A filosofia RISC simplifica o hardware, apostando que compiladores inteligentes podem gerar código eficiente com instruções simples e regulares:
      </p>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { aspect: "Origem", val: "Berkeley RISC (Patterson, 1980), Stanford MIPS (Hennessy, 1981)" },
          { aspect: "Número de instruções", val: "Poucos (RISC-V base: ~50; ARM: ~200)" },
          { aspect: "Tamanho das instruções", val: "Fixo (32 bits na maioria; 16+32 em Thumb/RVC)" },
          { aspect: "Modos de endereçamento", val: "Poucos (tipicamente apenas base+offset)" },
          { aspect: "Registradores", val: "Muitos (ARM64: 31 GPRs; RISC-V: 32 GPRs)" },
          { aspect: "Filosofia", val: "Hardware simples + compilador inteligente = performance" },
        ].map(r => (
          <div key={r.aspect} className="bg-card border border-border rounded-xl p-3">
            <p className="text-xs text-muted-foreground">{r.aspect}</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{r.val}</p>
          </div>
        ))}
      </div>

      <h2>Os 5 Princípios RISC (David Patterson)</h2>
      <div className="not-prose space-y-3 my-6">
        {[
          { num: "1", principle: "Simplicidade favorece regularidade", detail: "Operações de 3 operandos: rd = rs1 OP rs2. Formato fixo. Decodificação O(1)." },
          { num: "2", principle: "Bom design exige compromissos", detail: "Imediatos de 12 bits são suficientes para a maioria dos casos; exceções raramente precisam de mais." },
          { num: "3", principle: "Casos comuns devem ser rápidos", detail: "Registradores são mais frequentes que memória → priorizá-los. ADD rápido; DIV pode ser mais lento." },
          { num: "4", principle: "Menor é mais rápido", detail: "Menos registradores → file menor → acesso mais rápido. Mas 32 GPRs é o mínimo para evitar spilling." },
          { num: "5", principle: "Bom projeto dura longo tempo", detail: "ISA é um contrato de décadas. RISC-V foi projetado para ser simples o suficiente para perdurar." },
        ].map(p => (
          <div key={p.num} className="flex gap-4 bg-card border border-border rounded-xl p-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">{p.num}</div>
            <div>
              <h3 className="font-bold text-foreground text-sm mb-1">{p.principle}</h3>
              <p className="text-xs text-muted-foreground">{p.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <h2>Comparação Direta: Mesma Tarefa</h2>
      <CodeBlock language="text" title="Multiplicar elemento de array: C[i] = A[i] × B[i]" code={`
// x86-64 CISC (pode fazer muito em 1 instrução):
; Supondo A em RSI, B em RDI, C em RDX, i em RCX
movl    (%rsi, %rcx, 4), %eax    ; load A[i]
imull   (%rdi, %rcx, 4), %eax    ; multiplica com B[i] (mem operand!)
movl    %eax, (%rdx, %rcx, 4)    ; store C[i]
; 3 instruções, 1 é memória-a-memória!

// RISC-V (load-store architecture):
slli    t0, a2, 2        ; t0 = i * 4
add     t1, a0, t0       ; t1 = &A[i]
lw      t2, 0(t1)        ; t2 = A[i]
add     t3, a1, t0       ; t3 = &B[i]
lw      t4, 0(t3)        ; t4 = B[i]
mul     t5, t2, t4       ; t5 = A[i] * B[i]
add     t6, a3, t0       ; t6 = &C[i]
sw      t5, 0(t6)        ; C[i] = t5
; 8 instruções — mas cada uma é simples e 32-bit fixa
      `} />

      <h2>A Convergência Moderna</h2>
      <p>
        Na prática, a distinção CISC vs RISC tornou-se muito menos relevante. CPUs x86 modernas são CISC externamente (compatibilidade), mas RISC internamente:
      </p>
      <CodeBlock language="text" title="x86 moderno: CISC por fora, RISC por dentro" code={`
Frontend (CISC):
  Instrução CISC complexa (1-15 bytes) é buscada e decodificada

Decodificação → Micro-ops (μops):
  CISC instruction → 1-4 μops RISC-like
  LOCK CMPXCHG → ~10-15 μops
  ADD [mem], reg → 3 μops: LOAD + ADD + STORE

Backend (RISC):
  Executa μops em pipeline OoO simples e eficiente
  Reservation stations, ROB (Reorder Buffer), 200+ física registradores

Melhor dos dois mundos:
  ✓ Compatibilidade com décadas de software x86
  ✓ Eficiência de execução RISC no backend
      `} />

      <AlertBox type="info" title="ARM: RISC venceu o mercado mobile">
        ARM domina 99% dos smartphones e tablets. Apple Silicon (M1/M2/M3/M4) é ARM e destroçou CPUs Intel em eficiência energética. O RISC-V está crescendo em IoT, embarcados e agora até em HPC. O CISC x86 domina desktops e servidores mas está sendo desafiado cada vez mais por ARM.
      </AlertBox>
    </PageContainer>
  );
}
