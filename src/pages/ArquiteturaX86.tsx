import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ArquiteturaX86() {
  return (
    <PageContainer
      title="Arquitetura x86 / x86-64"
      subtitle="A arquitetura que domina PCs e servidores há décadas — sua história, registradores e particularidades."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <h2>Uma Breve História do x86</h2>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { year: "1978", cpu: "Intel 8086", note: "16-bit, 8 registradores de 16-bit, 1 MB de endereçamento" },
          { year: "1985", cpu: "Intel 80386 (i386)", note: "32-bit IA-32, modo protegido, 4 GB de endereçamento" },
          { year: "2000", cpu: "AMD Athlon 64 (x86-64)", note: "AMD estende x86 para 64-bit. Intel adota com Intel 64." },
          { year: "2006", cpu: "Intel Core 2 (Conroe)", note: "Nova microarquitetura eficiente, abandona Netburst. Base da era moderna." },
          { year: "2011", cpu: "Intel Sandy Bridge", note: "GPU integrada de qualidade, ring bus, AVX. Sucesso enorme." },
          { year: "2021+", cpu: "Intel Alder Lake / Raptor Lake", note: "Hybrid: P-cores + E-cores. Intel Thread Director." },
        ].map(h => (
          <div key={h.year} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-primary">{h.year}</span>
              <span className="text-sm font-bold text-foreground">{h.cpu}</span>
            </div>
            <p className="text-xs text-muted-foreground">{h.note}</p>
          </div>
        ))}
      </div>

      <h2>Registradores x86-64</h2>
      <CodeBlock language="text" title="Registradores de propósito geral (GPRs)" code={`
64-bit  32-bit  16-bit  8-bit high  8-bit low   Uso convencional
RAX     EAX     AX      AH          AL          Retorno de função, acumulador
RBX     EBX     BX      BH          BL          Caller-saved, ponteiro base
RCX     ECX     CX      CH          CL          Contador, 1º argumento (Windows)
RDX     EDX     DX      DH          DL          I/O, 2º arg (Windows), mul/div
RSI     ESI     SI      —           SIL         3º argumento (Linux), source index
RDI     EDI     DI      —           DIL         1º argumento (Linux), dest index
RSP     ESP     SP      —           SPL         Stack pointer
RBP     EBP     BP      —           BPL         Frame pointer
R8-R15  R8D-15D R8W-15W —           R8B-R15B    Args extras (Linux: R8,R9; Win: R9,R10)

Registradores especiais:
RIP:  Instruction Pointer (Program Counter de 64-bit)
RFLAGS: CF, ZF, SF, OF, PF, AF (resultado da última operação)
CS/DS/ES/FS/GS/SS: Segment registers (legado, maioria zerada em 64-bit)
      `} />

      <h2>Convenção de Chamada Linux (System V AMD64 ABI)</h2>
      <CodeBlock language="c" title="Argumento passing e registradores salvos" code={`
// Função: int func(int a, int b, int c, int d, int e, int f, int g)
//                  RDI  RSI   RDX   RCX   R8    R9   [stack]

// Valor de retorno: RAX (64-bit), RDX:RAX (128-bit), XMM0 (float)

// Caller-saved (callee pode destruir):
//   RAX, RCX, RDX, RSI, RDI, R8, R9, R10, R11

// Callee-saved (callee DEVE preservar):
//   RBX, RBP, R12, R13, R14, R15

// Stack frame:
//   [ret addr]  ← RSP antes do CALL
//   [saved RBP] ← RBP aponta aqui
//   [locals]
//   [args 7+]   ← args extras vão na pilha

// Exemplo de prologue/epilogue:
push rbp
mov  rbp, rsp
sub  rsp, 32      ; espaço para locais
...
leave             ; mov rsp, rbp; pop rbp
ret
      `} />

      <h2>Modos de Operação</h2>
      <div className="not-prose grid grid-cols-1 gap-3 my-6">
        {[
          { mode: "Real Mode (16-bit)", desc: "Boot. Legado puro do 8086. Sem proteção, sem memória virtual. 1 MB máximo. Só para BIOS/bootloader.", active: false },
          { mode: "Protected Mode (32-bit)", desc: "IA-32 clássico. Proteção de memória, privilégios, multitarefa. 4 GB de RAM máximo.", active: false },
          { mode: "Long Mode (64-bit)", desc: "x86-64 moderno. 48-bit de endereçamento virtual (256 TB), registradores de 64-bit, sem modo segmentado legado.", active: true },
          { mode: "SMM (System Management Mode)", desc: "Modo oculto para firmware BIOS/UEFI. Inacessível ao SO. Usado para gestão de energia, segurança.", active: false },
        ].map(m => (
          <div key={m.mode} className={`border rounded-xl p-4 ${m.active ? "border-primary/30 bg-primary/5" : "border-border"}`}>
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-bold text-sm ${m.active ? "text-primary" : "text-foreground"}`}>{m.mode}</h3>
              {m.active && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Atual</span>}
            </div>
            <p className="text-sm text-muted-foreground">{m.desc}</p>
          </div>
        ))}
      </div>

      <h2>Microarquiteturas Intel Modernas</h2>
      <CodeBlock language="text" title="Intel Raptor Lake (Core 13ª geração) — visão geral" code={`
Frontend (Fetch + Decode):
  Branch Prediction Unit → Instruction Fetch (32 bytes/ciclo)
  → Decodificação: 6 decoders CISC → μops
  → μop Cache (Decoded ICache): 4096 μops, evita re-decodificação

Backend (Execution Engine):
  Scheduler (Reservation Station): 512 entradas P-core
  Portas de execução: 12 portas (P-core)
    Porta 0,1: ALU inteira, multiplicação, saltos
    Porta 4,9: Store address
    Porta 5,6,11: ALU inteira, shift
    Porta 2,3: Load address
    Porta 7,8,10: Store data
    
  ROB (Reorder Buffer): 512 entradas — buffer de OoO execution
  Register File: 280 registradores físicos inteiros

Caches:
  L1: 48KB I + 48KB D, 12-way
  L2: 2MB unified, 16-way (P-core) / 4MB per cluster (E-core)
  L3: até 36MB, 12-way, compartilhado
      `} />

      <AlertBox type="warning" title="Spectre e Meltdown — o preço das otimizações">
        Vulnerabilidades descobertas em 2018 exploram a execução especulativa e o cache side-channel do x86 (e ARM). Um processo pode ler dados de outro processo ou do kernel via timing do cache. Mitigações de software (retpoline, KPTI) adicionam até 30% de overhead em certas cargas. Intel adicionou mitigações em hardware nas gerações Cascade Lake e posteriores.
      </AlertBox>
    </PageContainer>
  );
}
