import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function MemoriaVirtual() {
  return (
    <PageContainer
      title="Memória Virtual"
      subtitle="Como o sistema operacional dá a cada processo a ilusão de ter toda a memória para si — e muito mais."
      difficulty="avancado"
      timeToRead="16 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
          Ler o capítulo "Introdução" e ter familiaridade básica com lógica binária.
        </AlertBox>
        <h2>Glossário rápido</h2>
        <ul>
          <li>
            <strong>{"VM"}</strong> {' — '} {"Virtual Memory — cada processo vê seu próprio espaço."}
          </li>
        <li>
            <strong>{"Página"}</strong> {' — '} {"unidade típica de 4KB."}
          </li>
        <li>
            <strong>{"Page table"}</strong> {' — '} {"mapeia virtual → físico."}
          </li>
        <li>
            <strong>{"TLB"}</strong> {' — '} {"Translation Lookaside Buffer — cache da page table."}
          </li>
        <li>
            <strong>{"Swap"}</strong> {' — '} {"páginas frias vão pra disco."}
          </li>
        </ul>
        <h2>O Problema da Memória Real</h2>
      <p>
        Sem memória virtual, cada programa precisaria saber exatamente onde na RAM física seus dados estão — impossível quando múltiplos programas rodam simultaneamente. A memória virtual resolve isso criando uma abstração: cada processo vê seu próprio espaço de endereçamento privado, traduzido para endereços físicos pelo hardware.
      </p>

      <h2>Páginas e Endereços Virtuais</h2>
      <p>
        A memória é dividida em páginas de tamanho fixo (tipicamente 4KB). O sistema operacional mapeia páginas virtuais para páginas físicas:
      </p>
      <CodeBlock language="text" title="Decomposição de endereço virtual (x86-64, 48-bit)" code={`
Endereço virtual de 48 bits:

[PGD idx][PUD idx][PMD idx][PTE idx][Page offset]
  9 bits    9 bits   9 bits   9 bits    12 bits
   (512)    (512)    (512)    (512)    (4096 bytes)

4 níveis de tabela de páginas:
  PGD: Page Global Directory (nível 4)
  PUD: Page Upper Directory  (nível 3)
  PMD: Page Middle Directory (nível 2)
  PTE: Page Table Entry      (nível 1)

Cada PTE contém:
  [Physical Frame Number (PFN)] [Valid][Dirty][Accessed][R/W][User/Kernel]
      `} />

      <h2>Page Table Walk</h2>
      <CodeBlock language="text" title="Tradução de endereço virtual → físico" code={`
Processo de tradução (sem TLB):

1. Extrair PGD index do endereço virtual
2. Ler PGD entry do registrador CR3 (x86) / SATP (RISC-V)
3. Extrair PUD index → acessar tabela de 2º nível
4. Extrair PMD index → acessar tabela de 3º nível
5. Extrair PTE index → acessar tabela de 4º nível
6. PTE → Physical Frame Number + offset = endereço físico

Problema: tradução requer 4 acessos à memória antes de chegar
          ao dado! Isso seria inaceitavelmente lento.
Solução: TLB (Translation Lookaside Buffer)
      `} />

      <h2>TLB — Translation Lookaside Buffer</h2>
      <p>
        O TLB é um cache especial dentro da CPU que armazena traduções de páginas recentemente usadas. Com TLB, a tradução ocorre em 1 ciclo (ou menos):
      </p>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
        {[
          { name: "TLB Hit (98-99% dos acessos)", desc: "Tradução encontrada no TLB → endereço físico disponível em ~1 ciclo. Custo praticamente zero.", color: "border-green-500/30 bg-green-500/5" },
          { name: "TLB Miss", desc: "Hardware ou software percorre a tabela de páginas (page table walk). Intel/AMD: hardware page table walker. RISC-V: software TLB miss handler.", color: "border-red-500/30 bg-red-500/5" },
        ].map(t => (
          <div key={t.name} className={`border rounded-xl p-4 ${t.color}`}>
            <h3 className="font-bold text-foreground text-sm mb-2">{t.name}</h3>
            <p className="text-sm text-muted-foreground">{t.desc}</p>
          </div>
        ))}
      </div>

      <CodeBlock language="text" title="TLBs em CPUs modernas" code={`
AMD Zen 4 TLB hierarchy:
  L1 ITLB: 64 entradas (4KB pages), totalmente associativo
  L1 DTLB: 72 entradas (4KB pages), 4-way
  L2 TLB:  3072 entradas unificadas
  L3 TLB (shared): até 7168 entradas

ARM Cortex-X3:
  L1 ITLB: 48 entradas
  L1 DTLB: 48 entradas
  L2 TLB:  2048 entradas unificadas
      `} />

      <h2>Page Fault</h2>
      <p>
        Quando um endereço virtual é acessado mas a página não está na RAM física, ocorre um <strong>page fault</strong>. O processador passa o controle ao kernel:
      </p>
      <div className="not-prose space-y-3 my-6">
        {[
          { type: "Minor page fault", action: "Página existe mas não está mapeada no TLB (ex: área de memória zerada sob demanda). Resolve em microssegundos, sem I/O." },
          { type: "Major page fault", action: "Página está no disco (swap) ou ainda não foi carregada do arquivo. Precisa de I/O de disco — dezenas a centenas de milissegundos." },
          { type: "Segmentation fault", action: "Acesso a endereço inválido (não mapeado, ou permissão errada). O kernel envia SIGSEGV ao processo → crash." },
        ].map(f => (
          <div key={f.type} className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold text-primary text-sm mb-1">{f.type}</h3>
            <p className="text-sm text-muted-foreground">{f.action}</p>
          </div>
        ))}
      </div>

      <h2>Huge Pages</h2>
      <p>
        Além de páginas de 4KB, sistemas modernos suportam páginas maiores para reduzir a pressão no TLB:
      </p>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        {[
          { size: "4 KB", name: "Página normal", note: "Padrão. Máxima granularidade." },
          { size: "2 MB", name: "Huge Page", note: "Reduz TLB misses em 512×. Linux: transparent huge pages automático." },
          { size: "1 GB", name: "Gigantic Page", note: "Para workloads de banco de dados, machine learning, HPC." },
        ].map(p => (
          <div key={p.size} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{p.size}</div>
            <h3 className="font-bold text-foreground text-sm mb-1">{p.name}</h3>
            <p className="text-xs text-muted-foreground">{p.note}</p>
          </div>
        ))}
      </div>

      <h2>ASLR — Address Space Layout Randomization</h2>
      <p>
        O ASLR é uma técnica de segurança que randomiza os endereços base da pilha, heap, bibliotecas e executável a cada execução, dificultando ataques de exploração que dependem de endereços fixos:
      </p>
      <CodeBlock language="bash" title="Verificando ASLR no Linux" code={`
# Ver nível de ASLR:
cat /proc/sys/kernel/randomize_va_space
# 0 = desativado
# 1 = pilha e bibliotecas randomizadas
# 2 = tudo randomizado (padrão Linux)

# Ver mapa de memória de um processo:
cat /proc/self/maps

# Exemplo de saída (endereços mudam a cada execução):
7f8b4a000000-7f8b4a800000 r--p ... /lib/x86_64-linux-gnu/libc.so
7ffd12345000-7ffd12367000 rw-p ... [stack]
      `} />

      <AlertBox type="info" title="Memória virtual e virtualização">
        Hypervisors (VMware, KVM, Hyper-V) usam uma camada extra de tradução: endereços virtuais da VM → endereços físicos da VM → endereços físicos reais do host. CPUs modernas suportam Extended Page Tables (Intel EPT) ou Rapid Virtualization Indexing (AMD RVI) para fazer essa tradução em hardware, sem intervenção do hypervisor.
      </AlertBox>
    </PageContainer>
  );
}
