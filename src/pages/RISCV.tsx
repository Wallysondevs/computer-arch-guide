import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function RISCV() {
  return (
    <PageContainer
      title="RISC-V"
      subtitle="A ISA open-source que está democratizando o design de processadores — do IoT aos supercomputadores."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
          Ler o capítulo "Introdução" e ter familiaridade básica com lógica binária.
        </AlertBox>
        <h2>Glossário rápido</h2>
        <ul>
          <li>
            <strong>{"RISC-V"}</strong> {' — '} {"ISA aberta e gratuita — sem royalties."}
          </li>
        <li>
            <strong>{"Modular"}</strong> {' — '} {"RV32I/RV64I + extensões M, A, F, D, C, V."}
          </li>
        <li>
            <strong>{"Adoção"}</strong> {' — '} {"Western Digital, Alibaba, NASA, SiFive, e crescendo."}
          </li>
        <li>
            <strong>{"Ecossistema"}</strong> {' — '} {"GCC, LLVM, Linux já portados."}
          </li>
        <li>
            <strong>{"Perspectiva"}</strong> {' — '} {"potencial para quebrar duopólio x86/ARM."}
          </li>
        </ul>
        <h2>O que é RISC-V?</h2>
      <p>
        RISC-V (pronunciado "risk five") é uma ISA open-source criada em 2010 na UC Berkeley por Andrew Waterman, Yunsup Lee e David Patterson. Ao contrário de x86 (Intel) e ARM (ARM Holdings), RISC-V é completamente livre de royalties — qualquer um pode implementar, modificar e vender produtos baseados nela.
      </p>

      <h2>Por que RISC-V é Revolucionário?</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { aspect: "Open Source", desc: "Sem royalties, sem licenças. Qualquer empresa pode criar chips RISC-V sem pagar a ninguém." },
          { aspect: "Modular", desc: "Base mínima + extensões opcionais. Perfeito para domínios específicos: IoT usa RV32I; HPC usa RV64GCVH." },
          { aspect: "Design limpo", desc: "Projetado do zero sem herança de compatibilidade. Aproveita 50 anos de pesquisa em ISAs." },
          { aspect: "Suporte ecossistema", desc: "GCC, LLVM, Linux, FreeRTOS, Zephyr, QEMU, Spike simulator — tudo disponível." },
        ].map(a => (
          <div key={a.aspect} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-1">{a.aspect}</h3>
            <p className="text-sm text-muted-foreground">{a.desc}</p>
          </div>
        ))}
      </div>

      <h2>Extensões Modulares</h2>
      <CodeBlock language="text" title="Extensões RISC-V" code={`
Base ISAs:
  RV32I: 32-bit, 47 instruções de inteiros
  RV64I: 64-bit (extensões ×W para 32-bit word ops)
  RV128I: 128-bit (futuro)

Extensões padrão ratificadas:
  M: Multiplicação e divisão (MUL, DIV, REM)
  A: Operações atômicas (LR/SC, AMO*)
  F: Ponto flutuante 32-bit (FADD.S, FMUL.S...)
  D: Ponto flutuante 64-bit (FADD.D, FMUL.D...)
  Q: Ponto flutuante 128-bit
  C: Compressed (instruções de 16-bit para densidade de código)
  B: Bit manipulation (CLZ, CTZ, POPCOUNT...)
  V: Vector (SIMD de comprimento variável)
  H: Hypervisor (virtualização)
  J: Dynamically Translated Languages (JIT)
  P: Packed-SIMD (SIMD em registradores normais)
  Zicsr: Control and Status Registers
  Zifencei: Instruction-Fetch Fence
  
Perfil RVA23 (2023) — padrão para Linux:
  RV64GCB + Zba + Zbb + Zbs + Zicond + Vector

Perfis personalizados (exemplo hardware IA):
  + Xvendor_NN: extensão neural de um fabricante específico
      `} />

      <h2>ISA Base: RV64I</h2>
      <CodeBlock language="asm" title="Instruções RV64I essenciais" code={`
# Registradores: x0(zero), x1(ra), x2(sp), x3(gp), x4(tp)
#                x5-x7(t0-t2), x8-x9(s0-s1/fp), x10-x17(a0-a7)
#                x18-x27(s2-s11), x28-x31(t3-t6)

# Aritméticas Registrador-Registrador (Tipo R):
add  a0, a1, a2       # a0 = a1 + a2
sub  a0, a1, a2       # a0 = a1 - a2
and  a0, a1, a2       # a0 = a1 & a2
or   a0, a1, a2       # a0 = a1 | a2
xor  a0, a1, a2       # a0 = a1 ^ a2
sll  a0, a1, a2       # a0 = a1 << a2
srl  a0, a1, a2       # logical shift right
sra  a0, a1, a2       # arithmetic shift right
slt  a0, a1, a2       # a0 = (a1 < a2) ? 1 : 0 (signed)

# Imediatos (Tipo I):
addi a0, a1, 42       # a0 = a1 + 42 (12-bit immediate)
andi a0, a1, 0xFF     # a0 = a1 & 255
ori  a0, a1, 0x10     # a0 = a1 | 16

# Memória (Load/Store):
lw   a0, 0(a1)        # a0 = Mem32[a1+0] (sign-extended)
ld   a0, 8(a1)        # a0 = Mem64[a1+8] (RV64)
lb   a0, 0(a1)        # a0 = Mem8[a1] (sign-extended)
lbu  a0, 0(a1)        # a0 = Mem8[a1] (zero-extended)
sw   a0, 0(a1)        # Mem32[a1] = a0
sd   a0, 8(a1)        # Mem64[a1+8] = a0 (RV64)

# Desvios (Tipo B):
beq  a0, a1, label    # branch if a0 == a1
bne  a0, a1, label    # branch if a0 != a1
blt  a0, a1, label    # branch if a0 < a1 (signed)
bge  a0, a1, label    # branch if a0 >= a1 (signed)

# Jumps:
jal  ra, func         # call: ra = PC+4; PC = func
jalr zero, 0(ra)      # return: PC = ra (= ret pseudoinstrução)
      `} />

      <h2>Implementações RISC-V Reais</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { name: "SiFive U74 / U84", use: "HiFive Unmatched, StarFive JH7100. Linux-capable." },
          { name: "Allwinner D1 (XuanTie C906)", use: "Primeiro SoC RISC-V Linux de baixo custo. Lichee Pi (U$10)." },
          { name: "Alibaba XuanTie C910", use: "Server-class RISC-V. 3+ GHz, OoO execution." },
          { name: "NVIDIA (Falcon, etc.)", use: "RISC-V internamente em GPUs para firmware e gerenciamento." },
          { name: "Western Digital SweRV EH1", use: "Open-source, para SSD controllers e storage." },
          { name: "SpacemiT K1 (X60)", use: "8-core RISC-V com V (vector extension), 28nm. Starfive." },
        ].map(i => (
          <div key={i.name} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-1">{i.name}</h3>
            <p className="text-xs text-muted-foreground">{i.use}</p>
          </div>
        ))}
      </div>

      <AlertBox type="info" title="RISC-V na China">
        A China está investindo pesadamente em RISC-V como alternativa ao ARM (por receio de restrições de licença como as impostas ao Huawei) e ao x86. Alibaba (Pingtouge T-Head), Huawei, e dezenas de startups chinesas estão lançando chips RISC-V. Isso pode acelerar enormemente o ecossistema global.
      </AlertBox>
    </PageContainer>
  );
}
