import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function InterrupcoesDMA() {
  return (
    <PageContainer
      title="Interrupções e DMA"
      subtitle="Como a CPU responde a eventos assíncronos e como o DMA permite transferências de dados sem custo de CPU."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <h2>O Mecanismo de Interrupção</h2>
      <p>
        Uma interrupção é um sinal elétrico que faz a CPU pausar o que está fazendo, salvar o estado atual, e executar um tratador específico (ISR — Interrupt Service Routine). Após o tratamento, a CPU retoma a execução de onde parou.
      </p>

      <h2>Tipos de Interrupção</h2>
      <div className="not-prose space-y-4 my-8">
        {[
          {
            type: "Interrupção de Hardware (IRQ)",
            color: "border-cyan-500/30 bg-cyan-500/5",
            examples: ["Timer (para preempção do escalonador)", "Dispositivo de rede (novo pacote recebido)", "Disco (operação de I/O completada)", "Teclado/Mouse (evento de entrada)"],
            desc: "Gerada por hardware externo à CPU. Assíncrona — pode ocorrer a qualquer momento.",
          },
          {
            type: "Exceção (Exception)",
            color: "border-yellow-500/30 bg-yellow-500/5",
            examples: ["Page fault (página não na memória)", "Division by zero", "Invalid opcode", "Overflow aritmético", "Proteção de memória (segfault)"],
            desc: "Gerada pela própria CPU em resposta à execução de uma instrução. Síncrona.",
          },
          {
            type: "Trap (System Call)",
            color: "border-green-500/30 bg-green-500/5",
            examples: ["SYSCALL / INT 0x80 (Linux)", "SVC (ARM)", "ECALL (RISC-V)", "HyperCall (virtualização)"],
            desc: "Instrução especial que intencionalmente transfere controle ao kernel. Interface SO-userspace.",
          },
          {
            type: "NMI — Non-Maskable Interrupt",
            color: "border-red-500/30 bg-red-500/5",
            examples: ["Erro de hardware grave (paridade ECC)", "Watchdog timer expirado", "ACPI critical events", "Debug breakpoint (JTAG)"],
            desc: "Não pode ser desabilitada. Usada para eventos críticos que devem sempre ser tratados.",
          },
        ].map(t => (
          <div key={t.type} className={`border rounded-xl p-5 ${t.color}`}>
            <h3 className="font-bold text-foreground mb-2">{t.type}</h3>
            <p className="text-sm text-foreground/70 mb-3">{t.desc}</p>
            <ul className="space-y-1">
              {t.examples.map(e => (
                <li key={e} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">›</span> {e}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2>Fluxo de Tratamento de Interrupção</h2>
      <CodeBlock language="text" title="Sequência completa de tratamento de IRQ" code={`
1. Dispositivo asserta linha IRQ no controlador de interrupção (APIC/GIC)

2. APIC prioriza e notifica a CPU via INTR pin

3. CPU termina instrução atual (não interrompe no meio de uma instrução)

4. CPU desabilita outras interrupções (IF flag = 0 em x86)

5. CPU salva contexto na pilha (automático em x86):
   PUSH RFLAGS, CS, RIP  (estado para retornar após ISR)
   (Outros registradores são salvos pela ISR)

6. CPU lê vetor de interrupção do APIC e salta para ISR:
   IDT[vetor] → endereço da ISR

7. ISR executa:
   a. Salva registradores usados (caller-saved)
   b. Identifica dispositivo que gerou a interrupção
   c. Trata o evento (lê dado do dispositivo, etc.)
   d. Envia EOI (End Of Interrupt) ao APIC
   e. Restaura registradores

8. CPU executa IRET:
   Restaura RFLAGS, CS, RIP do topo da pilha
   Reabilita interrupções (IF = 1)
   Continua execução de onde parou
      `} />

      <h2>APIC — Advanced Programmable Interrupt Controller</h2>
      <CodeBlock language="text" title="Arquitetura APIC em sistemas multicore" code={`
                    ┌──────────────────┐
Dispositivo ──IRQ──▶│   I/O APIC       │
                    │ (na placa-mãe)   │
                    └────────┬─────────┘
                             │ Mensagem de interrupção
                    ┌────────▼─────────────────────────┐
                    │         Bus do Sistema             │
                    └────────┬──────────┬───────────────┘
                    ┌────────▼───┐  ┌──▼──────────┐
                    │ Local APIC │  │ Local APIC  │
                    │  (Core 0)  │  │  (Core 1)   │
                    └────────────┘  └─────────────┘

Funcionalidades do APIC:
  ✓ Até 240 vetores de interrupção
  ✓ Priorização de interrupções (TPR - Task Priority Register)
  ✓ Distribuição de IRQs entre cores (load balancing)
  ✓ IPIs (Inter-Processor Interrupts) para comunicação entre cores
  ✓ Timer APIC (para preempção de SO sem timer externo)
      `} />

      <h2>DMA — Direct Memory Access</h2>
      <p>
        O DMA permite que dispositivos de I/O transfiram dados diretamente para/da memória RAM sem envolver a CPU em cada byte:
      </p>
      <CodeBlock language="text" title="Transferência DMA vs PIO" code={`
PIO (Programmed I/O) — sem DMA:
  CPU lê/escreve cada word individualmente:
  for (int i = 0; i < 4096; i++) {
      buffer[i] = inb(0x1F0);   // lê 1 byte do disco
  }
  Custo: 4096 × (latência I/O + interrupção de contexto)
  CPU bloqueada 100% durante a transferência

DMA — transferência de 4096 bytes:
  1. CPU configura registradores do DMA controller:
     DMA.src_addr = 0xFE000000 (registrador do disco)
     DMA.dst_addr = 0x00400000 (buffer na RAM)
     DMA.count    = 4096
     DMA.mode     = READ | INCREMENT_DST
  2. CPU inicia DMA: DMA.start = 1
  3. CPU livre para outras tarefas!
  4. DMA controller realiza a transferência (hardware)
  5. Ao terminar: DMA gera IRQ notificando a CPU
      `} />

      <h2>DMA e Coerência de Cache</h2>
      <AlertBox type="warning" title="Problema de coerência DMA-Cache">
        Quando o DMA escreve na RAM sem saber o que está na cache, pode haver inconsistência: a CPU lê dado antigo do cache, não o novo da RAM. Soluções: cache coherent DMA (hardware notifica cache), ou flush/invalidate manual do cache antes/depois de operações DMA.
      </AlertBox>

      <CodeBlock language="c" title="DMA em Linux: API de streaming" code={`
// Alocar buffer compatível com DMA:
void *buf = kmalloc(4096, GFP_KERNEL | GFP_DMA);

// Mapear para DMA (garante coerência):
dma_addr_t dma_handle = dma_map_single(
    dev,          // struct device*
    buf,          // endereço virtual
    4096,         // tamanho
    DMA_FROM_DEVICE  // direção
);

// Configurar DMA controller...
// DMA transfere dados do dispositivo para buf...

// Após DMA completar (na IRQ handler):
dma_unmap_single(dev, dma_handle, 4096, DMA_FROM_DEVICE);
// Agora buf contém dados válidos, coerentes com a cache
      `} />
    </PageContainer>
  );
}
