import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ArquiteturaARM() {
  return (
    <PageContainer
      title="Arquitetura ARM"
      subtitle="A ISA que domina smartphones e está conquistando laptops, servidores e supercomputadores."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
          Ler o capítulo "Introdução" e ter familiaridade básica com lógica binária.
        </AlertBox>
        <h2>Glossário rápido</h2>
        <ul>
          <li>
            <strong>{"ARM"}</strong> {' — '} {"arquitetura RISC dominante em mobile e crescente em desktop."}
          </li>
        <li>
            <strong>{"Apple Silicon"}</strong> {' — '} {"M1/M2/M3 baseados em ARM com performance/Watt excelente."}
          </li>
        <li>
            <strong>{"big.LITTLE"}</strong> {' — '} {"combina cores potentes e cores eficientes no mesmo chip."}
          </li>
        <li>
            <strong>{"SoC"}</strong> {' — '} {"System on Chip — CPU+GPU+modem integrados."}
          </li>
        <li>
            <strong>{"Licenciamento"}</strong> {' — '} {"ARM vende design; Qualcomm, Apple, Samsung fabricam."}
          </li>
        </ul>
        <h2>História e Filosofia ARM</h2>
      <p>
        A ARM Holdings foi fundada em 1990 como joint venture entre Acorn, Apple e VLSI Technology. Diferente da Intel, a ARM não fabrica chips — ela desenvolve a ISA e designs de núcleo e <strong>licencia</strong> para fabricantes (Apple, Qualcomm, Samsung, NVIDIA, etc.).
      </p>
      <p>
        A filosofia ARM é RISC puro: instruções simples, 32 registradores de 64 bits, load-store architecture, e foco em eficiência energética — por isso domina dispositivos móveis com bateria.
      </p>

      <h2>AArch64 (ARM64) — Registradores</h2>
      <CodeBlock language="text" title="Registradores ARM64" code={`
Registradores inteiros (31 GPRs + ZR + SP):
  X0-X7:   Argumentos e retorno de funções
  X8:      Resultado indireto (structs grandes), syscall number
  X9-X15:  Temporários (caller-saved)
  X16,X17: Scratch inter-procedure (IP0, IP1)
  X18:     Platform register (reservado em alguns SOs)
  X19-X28: Callee-saved (o código chamado deve preservar)
  X29 (FP): Frame Pointer
  X30 (LR): Link Register (endereço de retorno)
  SP:      Stack Pointer
  XZR:    Zero Register (leitura = 0, escrita = /dev/null)
  PC:     Program Counter (não diretamente acessível)

Registradores de 32-bit: W0-W30, WSP, WZR
  (os 32 bits superiores são zerados nas escritas)

Registradores SIMD/FP (128-bit):
  V0-V31:  Registradores vetoriais de 128-bit (NEON)
  Q0-Q31:  128-bit (quadword)
  D0-D31:  64-bit (double)
  S0-S31:  32-bit (single)
  H0-H31:  16-bit (half)
  B0-B31:  8-bit (byte)

SVE (Scalable Vector Extension):
  Z0-Z31:  128 a 2048 bits (tamanho definido pelo hardware)
      `} />

      <h2>Principais Instruções ARM64</h2>
      <CodeBlock language="asm" title="Instruções ARM64 essenciais" code={`
; Aritméticas:
ADD  X0, X1, X2          ; X0 = X1 + X2
SUB  X0, X1, #10         ; X0 = X1 - 10
MUL  X0, X1, X2          ; X0 = X1 * X2 (32-bit result)
MADD X0, X1, X2, X3      ; X0 = X1 * X2 + X3 (FMA inteiro!)
SDIV X0, X1, X2          ; X0 = X1 / X2 (signed)
LSL  X0, X1, #2           ; X0 = X1 << 2 (shift left)

; Memória (LOAD/STORE):
LDR  X0, [X1]             ; X0 = Mem64[X1]
LDR  X0, [X1, #8]         ; X0 = Mem64[X1 + 8]
LDR  X0, [X1, X2, LSL #3] ; X0 = Mem64[X1 + X2*8] (indexed)
STR  X0, [X1, #-16]!      ; pre-decrement: SP-=16; store
LDP  X0, X1, [X2]         ; load pair: X0,X1 = Mem128[X2]
STP  X0, X1, [SP, #-16]!  ; push pair (prologue de função)

; Controle de fluxo:
B    label                ; branch incondicional
BL   func                 ; branch e link (call de função), LR=PC+4
RET                       ; return (JMP LR)
CBZ  X0, label            ; branch if X0 == 0
CBNZ X0, label            ; branch if X0 != 0
B.EQ / B.NE / B.GT / B.LT ; branches condicionais
      `} />

      <h2>Execução Condicional e NZCV</h2>
      <CodeBlock language="text" title="Flags NZCV e uso eficiente" code={`
Flags ARM (NZCV):
  N: Negative (resultado negativo)
  Z: Zero (resultado = 0)
  C: Carry (carry out / borrow)
  V: oVerflow (overflow de inteiro com sinal)

Instrução CMP seta flags: CMP X0, X1 → subtrai X1 de X0, só flags
CSEL (conditional select): X0 = (cond) ? X1 : X2
  Evita branch! Muito útil:

; if (a > 0) x = a; else x = -a;
CMP  X0, #0
CNEG X1, X0, LE    ; X1 = (X0 <= 0) ? -X0 : X0 (abs value!)

; Ou com CSEL:
CMP  X0, #0
CNEG X1, X0, LT    ; negate if negative
      `} />

      <h2>Apple Silicon: O Sucesso da ARM</h2>
      <CodeBlock language="text" title="Apple M4 (2024) — arquitetura do chip" code={`
Processo: TSMC 3nm (N3E)
Transistores: ~28 bilhões

P-cores (Firestorm descendentes): 4 cores
  IPC ultra-alto, pipeline de 12 estágios
  ROB: 630+ entradas
  Scheduler: 16 portas de execução
  L1: 192KB I + 128KB D per core
  L2: 16MB per cluster

E-cores (Icestorm descendentes): 6 cores
  Eficiência energética, menor área

Unified Memory Architecture:
  L3 shared: 28MB (todos os cores + GPU + NPU)
  LPDDR5X: 120 GB/s (consumer), 273 GB/s (M4 Ultra)
  Memória unificada: CPU e GPU compartilham fisicamente a mesma RAM!
  → Sem cópia de dados CPU→VRAM (enorme vantagem em IA e gráficos)

GPU (Apple GPU):
  10 cores GPU, 4,7 TFLOPS FP32
Neural Engine (ANE):
  16-core NPU, 38 TOPS
      `} />

      <AlertBox type="success" title="Por que ARM venceu no mobile">
        A eficiência energética ARM é consequência do design RISC e da co-projetação com o processo de fabricação (TSMC 3nm). O Apple M1 em 2020 mostrou que ARM pode superar x86 em performance por watt e até em performance absoluta — mudando a narrativa de que RISC é apenas para dispositivos simples.
      </AlertBox>
    </PageContainer>
  );
}
