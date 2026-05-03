import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ModosEnderecamento() {
  return (
    <PageContainer
      title="Modos de Endereçamento"
      subtitle="As diferentes formas de especificar onde os operandos estão — registrador, memória, imediato e mais."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
          Ler o capítulo "Introdução" e ter familiaridade básica com lógica binária.
        </AlertBox>
        <h2>Glossário rápido</h2>
        <ul>
          <li>
            <strong>{"Imediato"}</strong> {' — '} {"operando dentro da própria instrução."}
          </li>
        <li>
            <strong>{"Direto"}</strong> {' — '} {"endereço dado explicitamente."}
          </li>
        <li>
            <strong>{"Indireto"}</strong> {' — '} {"endereço guardado em registrador/memória."}
          </li>
        <li>
            <strong>{"Indexado"}</strong> {' — '} {"base + deslocamento — útil para arrays."}
          </li>
        <li>
            <strong>{"PC-relativo"}</strong> {' — '} {"offset relativo ao Program Counter — comum em branches."}
          </li>
        </ul>
        <h2>Por que Existem Múltiplos Modos?</h2>
      <p>
        Modos de endereçamento definem como o endereço efetivo de um operando é calculado. Diferentes situações exigem acesso a dados em diferentes locais: dentro da instrução, em registradores, em posições fixas ou calculadas de memória.
      </p>

      <h2>Modos Principais</h2>
      <div className="not-prose space-y-4 my-8">
        {[
          {
            mode: "Imediato (Immediate)",
            formula: "Operando = constante embutida na instrução",
            example: "ADD x1, x2, #5    ; x1 = x2 + 5",
            desc: "O valor está diretamente na instrução. Rápido, sem acesso à memória. Limitado ao tamanho do campo imediato (ex: 12 bits no RISC-V, -2048 a 2047).",
            color: "border-cyan-500/30 bg-cyan-500/5",
          },
          {
            mode: "Registrador (Register Direct)",
            formula: "Operando = Reg[especificado na instrução]",
            example: "ADD x1, x2, x3    ; x1 = x2 + x3",
            desc: "O operando está num registrador. O modo mais rápido — sem acesso à memória. CPUs RISC favorecem este modo ao máximo.",
            color: "border-green-500/30 bg-green-500/5",
          },
          {
            mode: "Direto / Absoluto",
            formula: "Endereço efetivo = endereço na instrução",
            example: "MOV AX, [0x1000]   ; x86: AX = Mem[0x1000]",
            desc: "O endereço completo está na instrução. Útil para variáveis globais com endereço fixo. Instruções ficam grandes (endereço de 64-bit = 8 bytes extras).",
            color: "border-yellow-500/30 bg-yellow-500/5",
          },
          {
            mode: "Indireto por Registrador",
            formula: "Endereço efetivo = Reg[base]",
            example: "LW x1, 0(x2)       ; x1 = Mem[x2]",
            desc: "O endereço está num registrador. Flexível: permite percorrer estruturas de dados mudando o registrador base.",
            color: "border-purple-500/30 bg-purple-500/5",
          },
          {
            mode: "Base + Deslocamento (Displacement)",
            formula: "Endereço efetivo = Reg[base] + deslocamento",
            example: "LW x1, 8(x2)       ; x1 = Mem[x2 + 8]",
            desc: "O mais comum em RISC. Acesso a campos de structs (struct.campo = base + offset), variáveis locais na pilha (base = SP, offset = posição).",
            color: "border-orange-500/30 bg-orange-500/5",
          },
          {
            mode: "Indexado (Base + Index + Deslocamento)",
            formula: "Endereço = Base + Index × Escala + Deslocamento",
            example: "MOV EAX, [RBX + RCX*4 + 8]   ; x86",
            desc: "Muito poderoso para acesso a arrays: Base = início do array, Index = índice do elemento, Escala = tamanho do elemento (1,2,4,8).",
            color: "border-red-500/30 bg-red-500/5",
          },
          {
            mode: "PC-Relativo",
            formula: "Endereço = PC + deslocamento",
            example: "BEQ x1, x2, label  ; if x1==x2: PC = PC + offset",
            desc: "Usado em desvios e acesso a constantes próximas. Código é position-independent — pode ser carregado em qualquer endereço de memória.",
            color: "border-pink-500/30 bg-pink-500/5",
          },
          {
            mode: "Indireto (Pointer Indirection)",
            formula: "Endereço = Mem[Endereço]",
            example: "JMP [RBX]    ; x86: PC = Mem[RBX]",
            desc: "Desreferência de ponteiro. Usado em tabelas de função, vtables de C++, indirect calls.",
            color: "border-indigo-500/30 bg-indigo-500/5",
          },
        ].map(m => (
          <div key={m.mode} className={`border rounded-xl p-5 ${m.color}`}>
            <h3 className="font-bold text-foreground mb-1">{m.mode}</h3>
            <code className="text-xs font-mono text-muted-foreground block mb-2">{m.formula}</code>
            <p className="text-sm text-foreground/80 mb-2">{m.desc}</p>
            <div className="bg-black/30 rounded-lg px-3 py-2 font-mono text-xs text-green-300">{m.example}</div>
          </div>
        ))}
      </div>

      <h2>Acesso a Arrays e Structs</h2>
      <CodeBlock language="c" title="Como o compilador usa os modos de endereçamento" code={`
// C:
int arr[10] = {1, 2, 3, ...};
int x = arr[i];   // acesso indexado ao array

// Assembly x86-64 gerado:
// arr em [rip+offset], i em rcx
leaq    arr(%rip), rax        ; rax = &arr[0]
movl    (%rax, %rcx, 4), eax  ; eax = *(rax + rcx*4)
//                       ↑ escala 4 = sizeof(int)

// Acesso a campo de struct:
// struct { int x; int y; int z; }; s.y = ...
movl    8(%rbp), eax          ; base=rbp (stack), offset=8
//             ↑ y está no offset 8 (4 bytes de x + alinhamento)
      `} />

      <h2>Auto-incremento e Auto-decremento</h2>
      <p>
        Algumas ISAs (ARM, PDP-11) suportam modos de auto-incremento/decremento, muito úteis para percorrer arrays e implementar pilhas:
      </p>
      <CodeBlock language="asm" title="ARM: Load com auto-incremento (post-index)" code={`
; ARM: LDR rd, [rn], #imm  (load, depois incrementa)
LDR r0, [r1], #4    ; r0 = Mem[r1]; r1 = r1 + 4
; Perfeito para loop de cópia de array:

loop:
    LDR r0, [r1], #4     ; carrega e avança src
    STR r0, [r2], #4     ; armazena e avança dst
    SUBS r3, r3, #1      ; decrementa contador
    BNE loop             ; repete se não zero
      `} />

      <AlertBox type="info" title="RISC vs CISC e modos de endereçamento">
        ISAs RISC (RISC-V, ARM) limitam modos de endereçamento para memória ao simples base+deslocamento, mantendo a lógica de acesso simples e previsível. ISAs CISC (x86) oferecem modos mais ricos (base+index×scale+displacement) que economizam instruções mas complicam o hardware.
      </AlertBox>
    </PageContainer>
  );
}
