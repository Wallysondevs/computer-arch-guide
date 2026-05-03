import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ISA() {
  return (
    <PageContainer
      title="Conjunto de Instruções (ISA)"
      subtitle="A interface entre hardware e software — o contrato que define o que um processador pode fazer."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
          Ler o capítulo "Introdução" e ter familiaridade básica com lógica binária.
        </AlertBox>
        <h2>Glossário rápido</h2>
        <ul>
          <li>
            <strong>{"ISA"}</strong> {' — '} {"Instruction Set Architecture — contrato entre HW e SW."}
          </li>
        <li>
            <strong>{"Opcodes"}</strong> {' — '} {"códigos das operações."}
          </li>
        <li>
            <strong>{"Tipos"}</strong> {' — '} {"aritméticas, lógicas, branches, load/store, system."}
          </li>
        <li>
            <strong>{"Endianness"}</strong> {' — '} {"little (Intel) ou big (ARM antigo) endian."}
          </li>
        <li>
            <strong>{"Word size"}</strong> {' — '} {"tamanho nativo de operandos (32/64 bits)."}
          </li>
        </ul>
        <h2>O que é uma ISA?</h2>
      <p>
        A <strong>ISA (Instruction Set Architecture)</strong> é a especificação formal de como o software pode controlar o hardware. Define: as instruções disponíveis, os registradores acessíveis, os tipos de dados, os modos de endereçamento, e como exceções são tratadas.
      </p>
      <p>
        A ISA é o ponto de compatibilidade: programas compilados para x86-64 rodam em qualquer CPU que implemente essa ISA — seja um Intel Core i9 ou um AMD Ryzen.
      </p>

      <h2>Tipos de Instruções</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { type: "Transferência de dados", color: "text-cyan-400", examples: "LOAD, STORE, MOVE, PUSH, POP, LEA (Load Effective Address)" },
          { type: "Aritméticas inteiras", color: "text-green-400", examples: "ADD, SUB, MUL, DIV, NEG, ABS, INC, DEC, MOD" },
          { type: "Lógicas e deslocamento", color: "text-yellow-400", examples: "AND, OR, XOR, NOT, SHL, SHR, SAR, ROL, ROR" },
          { type: "Comparação e desvio", color: "text-purple-400", examples: "CMP, TEST, JMP, JEQ, JNE, JGT, JLT, JGE, JLE, CALL, RET" },
          { type: "Ponto flutuante", color: "text-orange-400", examples: "FADD, FSUB, FMUL, FDIV, FSQRT, FCVT, FMADD" },
          { type: "Sistema / Privilégio", color: "text-red-400", examples: "SYSCALL, INT, IRET, HLT, IN, OUT (acesso a I/O), CPUID" },
        ].map(t => (
          <div key={t.type} className="bg-card border border-border rounded-xl p-4">
            <h3 className={`font-bold text-sm mb-1 ${t.color}`}>{t.type}</h3>
            <p className="text-xs font-mono text-muted-foreground">{t.examples}</p>
          </div>
        ))}
      </div>

      <h2>Formato de Instrução</h2>
      <p>
        Cada instrução é codificada como uma sequência de bits com campos bem definidos. Em RISC-V, todas as instruções têm exatamente 32 bits:
      </p>
      <CodeBlock language="text" title="Formatos de instrução RISC-V" code={`
Tipo R (registro-registro):
 31      25 24  20 19  15 14 12 11   7 6      0
[ funct7  ][ rs2 ][ rs1 ][funct3][ rd  ][ opcode ]
    7 bits   5 bits  5 bits  3 bits  5 bits  7 bits

Tipo I (imediato):
 31          20 19  15 14 12 11   7 6      0
[   imm[11:0]  ][ rs1 ][funct3][ rd  ][ opcode ]
     12 bits      5 bits  3 bits  5 bits  7 bits

Tipo S (store):
 31      25 24  20 19  15 14 12 11   7 6      0
[imm[11:5]][ rs2 ][ rs1 ][funct3][imm[4:0]][ opcode ]

Tipo B (branch):
[imm[12|10:5]][rs2][rs1][funct3][imm[4:1|11]][opcode]

Tipo U (upper immediate — 20 bits):
 31             12 11   7 6      0
[    imm[31:12]   ][ rd  ][ opcode ]

Tipo J (jump):
[imm[20|10:1|11|19:12]][ rd  ][ opcode ]
      `} />

      <h2>Comparação: x86-64 vs ARM64 vs RISC-V</h2>
      <CodeBlock language="asm" title="Somando dois inteiros: a = b + c" code={`
; x86-64 (AT&T syntax)
movl    b(%rip), %eax    ; carrega b em eax
addl    c(%rip), %eax    ; eax = eax + c
movl    %eax, a(%rip)    ; armazena resultado em a

; ARM64 (AArch64)
adrp    x0, b             ; endereço base de b
ldr     w1, [x0, :lo12:b] ; carrega b
adrp    x2, c
ldr     w3, [x2, :lo12:c] ; carrega c
add     w1, w1, w3         ; w1 = b + c
str     w1, [resultado]    ; armazena

; RISC-V (RV64I)
la      a0, b             ; load address of b
lw      t0, 0(a0)         ; t0 = b
la      a1, c
lw      t1, 0(a1)         ; t1 = c
add     t2, t0, t1         ; t2 = b + c
la      a2, a
sw      t2, 0(a2)          ; a = t2
      `} />

      <h2>Ortogonalidade e Regularidade</h2>
      <p>
        Uma ISA <strong>ortogonal</strong> permite qualquer combinação de operação, operandos e modos de endereçamento. ISAs regulares têm formato de instrução uniforme — facilitam pipeline e decodificação:
      </p>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { arch: "x86-64 (CISC)", regular: false, desc: "Instruções de 1 a 15 bytes. Alta densidade de código mas decodificação complexa. Herança de 40 anos de compatibilidade." },
          { arch: "ARM64 / RISC-V (RISC)", regular: true, desc: "Instruções de tamanho fixo (32 bits). Decodificação simples e rápida, ideal para pipeline profundo." },
        ].map(a => (
          <div key={a.arch} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-foreground text-sm mb-1">{a.arch}</h3>
            <span className={`text-xs font-bold ${a.regular ? "text-green-400" : "text-yellow-400"}`}>
              {a.regular ? "✓ Formato regular" : "⚠ Formato variável"}
            </span>
            <p className="text-sm text-muted-foreground mt-2">{a.desc}</p>
          </div>
        ))}
      </div>

      <h2>Extensões da ISA</h2>
      <p>
        ISAs modernas são extensíveis — novos subconjuntos de instruções adicionam capacidades sem quebrar compatibilidade:
      </p>
      <CodeBlock language="text" title="Extensões do RISC-V" code={`
Base:   RV32I / RV64I — inteiros básicos (obrigatório)
M:      Multiplicação e divisão inteira
A:      Operações atômicas (para multithreading)
F:      Ponto flutuante de precisão simples (32-bit)
D:      Ponto flutuante de precisão dupla (64-bit)
C:      Instruções comprimidas de 16-bit (densidade de código)
V:      Extensão vetorial (SIMD variável)
Zicsr:  Controle de registradores CSR (status/controle)

Perfil padrão: RV64GC = RV64IMAFD + C
(base + multiply + atomic + float + double + compressed)
      `} />

      <CodeBlock language="text" title="Extensões x86-64 ao longo dos anos" code={`
1978: 8086 — base x86, 16-bit
1985: 80386 — 32-bit (IA-32), modo protegido
1997: MMX — primeiras extensões SIMD (inteiros 64-bit)
1999: SSE — 128-bit, floats de 32-bit (4 por ciclo)
2001: SSE2 — doubles 64-bit, inteiros 128-bit
2007: SSE4 — instruções de string, blending, etc.
2011: AVX — 256-bit (8 floats / 4 doubles por ciclo)
2013: AVX2 — 256-bit inteiros, FMA3
2016: AVX-512 — 512-bit (16 floats por ciclo!)
2023: AVX-VNNI — instrucoes para IA / inferência de redes neurais
      `} />

      <AlertBox type="info" title="ISA não é Microarquitetura">
        A ISA define o que o processador faz; a microarquitetura define como ele faz. Um Intel Core i9 e um antigo Pentium 4 implementam a mesma ISA x86, mas com microarquiteturas completamente diferentes — a do i9 é décadas mais avançada, com OoO execution, branch prediction sofisticado, e cache muito maior.
      </AlertBox>
    </PageContainer>
  );
}
